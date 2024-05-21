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
import { config, socket_url } from './config.js';
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
import { io } from 'socket.io-client';
import { addSignalementAbsence, setNewAbsence, setSignalementAbsences } from './_redux/features/absence/signalement_absence.js';
import { apiGetAbsencesSignaler } from './api/discipline/api_discipline.js';
import { t } from 'i18next';
import { setEtudiantDiscipline, setErrorPageEtudiantDiscipline, setEtudiantsDisciplineLoading } from './_redux/features/absence/discipline_etudiant_slice.js';
import { RootState } from './_redux/store.js';
import { apiGetNiveauxByEnseignant } from './api/other_users/api_enseignant.js';
import { niveau } from './pages/Admin/Niveaux.js';

function App() {

  const dispatch = useDispatch();


  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const roles = config.roles;


  const [userRole, setUserRole] = useState<String>('');

  const [loading, setLoading] = useState<boolean>(false);
  // recuperer les info en local storage
  var isAuth = isUserAuthenticated();
  const [userLog, setUserLog]=useState<UserState>();

  const sommesRoutesDelegateStudent = [...routeStudent, ...routeDelegate];
  const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
  const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;



  // au lencement de la page
  const checkIfMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  useEffect(() => {
    dispatch(setSaveDeviceType(checkIfMobileOrTablet))
    if (checkIfMobileOrTablet) {
      setIsMobileOrTablet(false);
    }
  }, [checkIfMobileOrTablet]);

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
              absences,
              niveaux,
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
                absences: [],
                niveaux: niveaux,
                categorie: categorie,
                fonction: fonction,
                service: service,
                commune: commune,
                abscence: null,
              }));
              setUserLog({
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
                absences: absences,
                niveaux: niveaux,
                categorie: categorie,
                fonction: fonction,
                service: service,
                commune: commune,
                abscence: null,
              })
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

  const fetchAbsencesSignaler = async (user:UserState, niveaux:string[]|undefined) => {
    try {
      const emptySignalement : SignalementAbsence[]=[]
      const fetchedAbsences = await apiGetAbsencesSignaler({
         userId:user._id, niveauxId:niveaux, role:user.role, annee:currentYear, semestre:currentSemester
      });
      
      
          if (fetchedAbsences && fetchedAbsences.length>0) {
            dispatch(setNewAbsence(true));
            dispatch(setSignalementAbsences(fetchedAbsences));
          } else {
              dispatch(setSignalementAbsences(emptySignalement));
          }
      } catch (error) {
          
      } 
  }

  const fetchNiveauEnseignant = async (user:UserState) => {
    
    return await apiGetNiveauxByEnseignant({ enseignantId: user._id, annee: currentYear, semestre: currentSemester });
  }
  useEffect( () => {

    if (isAuth) {
        if(userLog && currentSemester && currentYear){
          let niveauxId = userLog.niveaux.map(inscription => inscription.niveau) ?? [];
          
          // Établit une connexion avec le serveur Socket.io
          const socket = io(socket_url);          
          
          socket.on('message', (data: { message: SignalementAbsence }) => {
            if ((userLog.role === config.roles.admin) || userLog.role === config.roles.superAdmin) {
              dispatch(addSignalementAbsence(data.message));
              dispatch(setNewAbsence(true));
            }

            if ((data.message.role === config.roles.etudiant) || (data.message.role === config.roles.delegue)) {
              // verifier si lutilisateur qui recupere le msg est un enseignant ou un delegue
              if ((userLog._id !== data.message.user._id) && (userLog.role === config.roles.delegue) && (niveauxId.includes(data.message.niveau))) {
                //  
                dispatch(addSignalementAbsence(data.message));
                dispatch(setNewAbsence(true));
              }

              if((userLog._id !== data.message.user._id) && userLog.role===config.roles.enseignant){
                fetchNiveauEnseignant(userLog).then(niveaux=>{
                  if(niveaux){
                    niveauxId = niveaux.map(inscription => inscription.niveau) ?? [];
                  }
                  if((userLog._id===data.message.enseignant?._id) && niveauxId.includes(data.message.niveau)){
                    dispatch(addSignalementAbsence(data.message));
                    dispatch(setNewAbsence(true));
                  }
                })
              }
            }

            if ((data.message.role === config.roles.enseignant)) {
              // verifier si lutilisateur qui recupere le msg est un enseignant ou un delegue
              if ((userLog._id !== data.message.user._id) && (userLog.role === config.roles.delegue || userLog.role === config.roles.enseignant) && (niveauxId.includes(data.message.niveau))) {
                dispatch(addSignalementAbsence(data.message));
                dispatch(setNewAbsence(true));
              }
            }
  
          });
          if(userLog.role===config.roles.admin){
            fetchAbsencesSignaler(userLog, undefined);
          }else if(userLog.role===config.roles.enseignant){
            
              fetchNiveauEnseignant(userLog).then(niveaux=>{
                if(niveaux){
                  niveauxId = niveaux.map(inscription => inscription.niveau) ?? [];
                }
                fetchAbsencesSignaler(userLog, niveauxId);
              })
            
            
          }else{
            fetchAbsencesSignaler(userLog, niveauxId);
          }
          
          

          // Nettoie la connexion lorsque le composant est démonté
          return () => {
            socket.disconnect();
          };

      }
    }
  }, [userRole, currentSemester, currentYear])
  





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