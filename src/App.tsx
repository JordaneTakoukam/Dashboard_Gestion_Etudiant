import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
import { config } from './config.js';
import InitialPage from './pages/InitialPage/InitialPage.js';
import Layout from './layout/Layout.js';
import DashboardDelegate from './pages/Delegue/Dashboard_delegue.js';
import ResetPassword from './pages/Authentication/ResetPassword.js';
import { isUserAuthenticated } from './middlewares/auth_middleware.js';
import { setMinimumUser } from './_redux/features/user_slice.js';
import createToast from './hooks/toastify.js';
import Loading from './components/ui/loading.js';

function App() {

  const dispatch = useDispatch();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const roles = config.roles;
  const [userRole, setUserRole] = useState<String>('');

  const [loading, setLoading] = useState<boolean>(false);
  // recuperer les info en local storage
  var isAuth = isUserAuthenticated();

  const sommesRoutesDelegateStudent = [...routeStudent, ...routeDelegate];


  // au lencement de la page
  useEffect(() => {
    const checkIfMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
   
    if (checkIfMobileOrTablet) {
      setIsMobileOrTablet(false);
    } else {
      setIsMobileOrTablet(true);
    }
  }, [isAuth.status]);



  // recuperer les info du token si le user est connecter
  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuth != null) {
        if (isAuth.status) {
          const localUser = isAuth.value;

          if (localUser) {
            const { userId, role, nom, prenom } = localUser;

            dispatch(setMinimumUser({
              _id: userId,
              role: role,
              nom: nom,
              prenom: prenom,
            }));

            setUserRole(role);
          }
          setLoading(false);
        } else {
          if (isAuth.value != null)
            createToast(isAuth.value, "", 1);
        }
      }
      setLoading(false);
    };

    handleAuthentication();
  }, [isAuth]);



  return loading ? (
    <InitialPage />
  ) : (
    <>
      <ToastContainer />

      <Routes>
        {/* Redirect to /auth/signup if not authenticated */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
            (userRole === roles.admin || userRole === roles.superAdmin) ?
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


                    : <Route element={<NotFound />} />

          }
        </Route>


        {/* si mauvaises url est rechercher */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;