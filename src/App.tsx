import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn.js';
import { ToastContainer } from 'react-toastify';
import routeAdmin from './routes/routes.admin.js'
import routeTeacher from './routes/routes.teacher.js'
import routeStudent from './routes/routes.student.js'
import routeDelegate from './routes/route.delegate.js'
import { NotFound, NotFoundIsAuth } from './pages/NotFound/NotFound.js';
import DashBoardAmin from './pages/Admin/Dashboard_admin.js';
import DashboardTeacher from './pages/Enseignant/Dashboard_teacher.js';
import DashBoardStudent from './pages/Etudiant/Dashboard_student.js';
import { useDispatch, useSelector } from 'react-redux';
import { config } from './config.js';
import InitialPage from './pages/InitialPage/InitialPage.js';
import Layout from './layout/Layout.js';
import DashboardDelegate from './pages/Delegue/Dashboard_delegue.js';
import ResetPassword from './pages/Authentication/ResetPassword.js';
import { isUserAuthenticated } from './middlewares/auth_middleware.js';
import { setMinimumUser } from './_redux/features/user_slice.js';
import createToast from './hooks/toastify.js';
import Loading from './components/ui/loading.js';
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from './_redux/features/data_setting_slice.js';
import { apiGetAllSettings } from './api/settings/api_data_setting.js';
import { setSaveDeviceType } from './_redux/features/setting.js';
import ChoisirCompte from './pages/ChoisirCompte/ChoisirCompte.js';
import { RootState } from './_redux/store.js';

function App() {

  const dispatch = useDispatch();


  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const roles = config.roles;


  const [userRole, setUserRole] = useState<String>('');

  const [loading, setLoading] = useState<boolean>(false);
  // recuperer les info en local storage
  var isAuth = isUserAuthenticated();

  const sommesRoutesDelegateStudent = [...routeStudent, ...routeDelegate];


  // au lencement de la page
  const checkIfMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  useEffect(() => {
    dispatch(setSaveDeviceType(checkIfMobileOrTablet))
    if (checkIfMobileOrTablet) {
      setIsMobileOrTablet(false);
    }
  }, [checkIfMobileOrTablet]);


  //
  //
  //
  //
  //
  //
  //
  //
  //

  // recuperer les info du token si le user est connecter
  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuth != null) {
        if (isAuth.status) {
          const localUser = isAuth.value;

          if (localUser) {
            const { 
                userId, 
                roles, 
                role, 
                nom, 
                prenom, 
                genre, 
                email, 
                photo_profil, 
                contact, 
                matricule, 
                date_naiss, 
                lieu_naiss, 
                date_entree, 
                abscences, 
                niveaux, 
                grade, 
                categorie, 
                fonction, 
                service, 
                commune 
            } = localUser;
        
            if (role !== "" && role !== null && role !== undefined) {
                dispatch(setMinimumUser({
                  _id: userId,
                  roles: roles,
                  role: role,
                  nom: nom,
                  prenom: prenom,
                  genre: genre,
                  email: email,
                  photo_profil: photo_profil,
                  contact: contact,
                  matricule: matricule,
                  date_naiss: date_naiss,
                  lieu_naiss: lieu_naiss,
                  date_entree: date_entree,
                  abscence: abscences,
                  niveaux: niveaux,
                  grade: grade,
                  categorie: categorie,
                  fonction: fonction,
                  service: service,
                  commune: commune
                }));
        
                setUserRole(role);
            }
        }
        

        } else {
          if (isAuth.value != null)
            createToast(isAuth.value, "", 1);
        }
      }
    };

    handleAuthentication();
  }, [isAuth]);


  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // recuperer les settings 
  const fetchSettingsData = async () => {

    dispatch(setLoadingDataSetting(true));
    try {
      const settingsData = await apiGetAllSettings();
      dispatch(setDataSetting(settingsData));
      dispatch(setErrorDataSetting(null))
    } catch (error) {
      dispatch(setErrorDataSetting('une erreur est survenue'))
    } finally {
      dispatch(setLoadingDataSetting(false));

    }
  };

  useEffect(() => {

    const fetchSettingsDataIfAuth = async () => {
      if (isAuth.status) {
        await fetchSettingsData();
      } else {
      }
    };

    fetchSettingsDataIfAuth();
  }, []);




  return loading ? (
    <InitialPage />
  ) : (
    <>
      <ToastContainer />

      <Routes>
        {/* Redirect to /auth/signup if not authenticated */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/choose-account" element={<ChoisirCompte />} />

        {/* Menu de gauche pour les differents roles  */}
        <Route element={isAuth.status ? <Layout isMobileOrTablet={isMobileOrTablet} /> : <Navigate to={'/signin'} />}>

          {/*  Page de droites   */}
          {/* page dashboard est celle selectionner par defaut */}
          <Route index element={
            (roles.superAdmin === userRole || roles.admin === userRole) ? <DashBoardAmin /> :
              roles.enseignant === userRole ? <DashboardTeacher /> :
                roles.etudiant === userRole ? <DashBoardStudent /> :
                  roles.delegue === userRole ? <DashboardDelegate /> :
                    <NotFoundIsAuth />

          } />
          {/* autres pagges pour chaque type de compte */}
          {
            (userRole === roles.superAdmin) ?
              (
                routeAdmin.map((route, index) => {
                  const { path, component: Component } = route;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Suspense fallback={<Loading />}>
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })
              ) :
              (userRole === roles.admin) ?
                (
                  routeAdmin.map((route, index) => {
                    const { path, component: Component } = route;
                    return (
                      <Route
                        key={index}
                        path={path}
                        element={
                          <Suspense fallback={<Loading />}>
                            <Component />
                          </Suspense>
                        }
                      />
                    );
                  })
                ) :
                userRole === roles.enseignant ?
                  (
                    routeTeacher.map((route, index) => {
                      const { path, component: Component } = route;
                      return (
                        <Route
                          key={index}
                          path={path}
                          element={
                            <Suspense fallback={<Loading />}>
                              <Component />
                            </Suspense>
                          }
                        />
                      );
                    })
                  ) :
                  userRole === roles.etudiant ?
                    (
                      routeStudent.map((route, index) => {
                        const { path, component: Component } = route;
                        return (
                          <Route
                            key={index}
                            path={path}
                            element={
                              <Suspense fallback={<Loading />}>
                                <Component />
                              </Suspense>
                            }
                          />
                        );
                      })
                    ) :
                    userRole === roles.delegue ?
                      (
                        sommesRoutesDelegateStudent.map((route, index) => {
                          const { path, component: Component } = route;
                          return (
                            <Route
                              key={index}
                              path={path}
                              element={
                                <Suspense fallback={<Loading />}>
                                  <Component />
                                </Suspense>
                              }
                            />
                          );
                        })
                      )


                      : <Route element={<NotFoundIsAuth />} />

          }
        </Route>


        {/* si mauvaises url est rechercher */}
        <Route path='*' element={isAuth.status ? <div className='h-screen w-screen flex  items-center justify-center ml-[150px]'><Loading /></div> : <NotFound />} />
      </Routes >
    </>
  );
}

export default App;