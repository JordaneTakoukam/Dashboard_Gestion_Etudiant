import { Key, Suspense, useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { config, socket_url } from './config.js';
import InitialPage from './pages/InitialPage/InitialPage.js';
import Layout from './layout/Layout.js';
import DashboardDelegate from './pages/Delegue/Dashboard_delegue.js';
import ResetPassword from './pages/Authentication/ResetPassword.js';
import { isUserAuthenticated } from './middlewares/auth_middleware.js';
import { setMinimumUser, setRole, setUser } from './_redux/features/user_slice.js';
import Loading from './components/ui/loading.js';
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from './_redux/features/data_setting_slice.js';
import { apiGetAllSettings } from './api/settings/api_data_setting.js';
import { setSaveDeviceType } from './_redux/features/setting.js';
import ChoisirCompte from './pages/ChoisirCompte/ChoisirCompte.js';
import { io } from 'socket.io-client';
import { RootState } from './_redux/store.js';
import { apiGetNiveauxByEnseignant } from './api/other_users/api_enseignant.js';
import { getCurrentUserData } from './api/api_user.js';
import VerificationCode from './pages/Authentication/verification_code.js';
import { addNotification, setNewNotification, setNotifications } from './_redux/features/notification_slice.js';
import { getNotifications } from './api/api_notification.js';

function App() {

  const dispatch = useDispatch();


  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);
  const roles = config.roles;


  const [userRole, setUserRole] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  // recuperer les info en local storage

  const [isAuth, setIsAuth] = useState<{ value: any; status: boolean }>({ value: 'default', status: false });

  const [userLog, setUserLog] = useState<UserState>();

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



  // recupeer les info du token
  useEffect(() => {
    setLoading(true)
    const updateAuthStatus = async () => {
      await isUserAuthenticated().then((getAuth) => {
        setIsAuth(getAuth);
      })

    };
    updateAuthStatus();

  }, []);


  useEffect(() => {

    const handleAuthentication = async () => {
      if (isAuth.status) {
        const localUser = isAuth.value;

        if (localUser) {
          const { userId, roles, role } = localUser;

          if (role !== "" && role !== null && role !== undefined) {
            dispatch(setMinimumUser({ _id: userId, roles: roles, role: role }));
            setUserRole(role);

            // recuperer les data du user en bd
            try {
              await getCurrentUserData({ userId: userId }).then((e: UserState) => {
                dispatch(setUser(e));
                setUserLog(e);
                dispatch(setRole(role));
                setLoading(false);
              }).catch((e) => {
                setLoading(false);
              })
            } catch (e) {
              setLoading(false);
            }
          }
        }

      } else {
        // console.log('isAuth.value  = null');

        setLoading(false);
        // setIsAuth({ value: '', status: false });
      }

      // if (isAuth.value != null)
      //   createToast(isAuth.value, "", 1);

    }

    handleAuthentication();
  }, [isAuth]);


  useEffect(() => {
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

    const fetchSettingsDataIfAuth = async () => {
      if (isAuth.status) {
        await fetchSettingsData();
      }
    };

    fetchSettingsDataIfAuth();
  }, [isAuth]);



  // recuperer les info du token si le user est connecter


  const fetchNotifications = async (user: UserState, niveaux: string[] | undefined) => {
    try {
      const emptyNotification: NotificationType[] = []
      const fetchedNotifications = await getNotifications({
        userId: user._id, niveauxId: niveaux, role: userRole, annee: currentYear, semestre: currentSemester
      });

      // console.log(fetchedNotifications);
      if (fetchedNotifications && fetchedNotifications.length > 0) {
        dispatch(setNotifications(fetchedNotifications));
        dispatch(setNewNotification(true));
      } else {
        dispatch(setNotifications(emptyNotification));
      }
    } catch (error) {
    }
  }

  const fetchNiveauEnseignant = async (user: UserState) => {
    return await apiGetNiveauxByEnseignant({ enseignantId: user._id, annee: currentYear, semestre: currentSemester });
  }


  useEffect(() => {

    if (isAuth) {
      if (userLog && currentSemester && currentYear) {
        let niveauxId = userLog.niveaux.map(inscription => inscription.niveau) ?? [];

        // Établit une connexion avec le serveur Socket.io
        const socket = io(socket_url);

        socket.on('message', (data : NotificationType ) => {
          
          if ((userRole === config.roles.admin) || userRole === config.roles.superAdmin) {
            dispatch(addNotification(data));
            dispatch(setNewNotification(true));
          }
          if(data.type.toString() === config.typeNotifications.absence){
              if ((data.role === config.roles.etudiant) || (data.role === config.roles.delegue)) {
                // verifier si lutilisateur qui recupere le msg est un enseignant ou un delegue
                
                if (data.signalementAbsence && ((userLog._id.toString() !== data.user._id.toString()) && (userRole === config.roles.delegue) && (data.signalementAbsence.niveau && (niveauxId.includes(data.signalementAbsence.niveau))))) {
                  //  
                  dispatch(addNotification(data));
                  dispatch(setNewNotification(true));
                }
                
                if ((userLog._id.toString() !== data.user._id.toString()) && userRole === config.roles.enseignant) {
                  fetchNiveauEnseignant(userLog).then(niveaux => {
                    if (niveaux) {
                      niveauxId = niveaux.map(inscription => inscription.niveau) ?? [];
                    }
                    if (data.signalementAbsence && ((userLog._id.toString() === data.signalementAbsence.enseignant?.toString()) && (data.signalementAbsence.niveau && niveauxId.includes(data.signalementAbsence.niveau)))) {
                      dispatch(addNotification(data));
                      dispatch(setNewNotification(true));
                    }
                  })
                }
              }

              if ((data.role === config.roles.enseignant)) {
                // verifier si lutilisateur qui recupere le msg est un enseignant ou un delegue
                if (data.signalementAbsence && ((userLog._id.toString() !== data.user._id.toString()) && (userRole === config.roles.delegue || userRole === config.roles.enseignant) && (data.signalementAbsence.niveau && niveauxId.includes(data.signalementAbsence.niveau)))) {
                  dispatch(addNotification(data));
                  dispatch(setNewNotification(true));
                }
              }
          }

        });
        if (userRole === config.roles.admin) {
          fetchNotifications(userLog, undefined);
        } else if (userRole === config.roles.enseignant) {

          fetchNiveauEnseignant(userLog).then(niveaux => {
            if (niveaux) {
              niveauxId = niveaux.map(inscription => inscription.niveau) ?? [];
            }
            fetchNotifications(userLog, niveauxId);
          })


        } else {
          fetchNotifications(userLog, niveauxId);
        }


        // Nettoie la connexion lorsque le composant est démonté
        return () => {
          socket.disconnect();
        };

      }
    }
  }, [isAuth, userRole, currentSemester, currentYear])






  return loading ? (
    <InitialPage />
  ) : (
    <>
      <ToastContainer />

      {
        isAuth.value !== 'default' && <Routes>
          {/* Redirect to /auth/signup if not authenticated */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/choose-account" element={<ChoisirCompte />} />
          <Route path="/verification-code/:id" element={<VerificationCode />} />


          {/* Menu de gauche pour les differents roles  */}
          <Route element={isAuth.value !== null && isAuth.status ?
            <Layout isMobileOrTablet={isMobileOrTablet} /> : <Navigate to={'/signin'} />} >

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
                        routeStudent.map((route: { path: any; component: any; }, index: Key | null | undefined) => {
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
      }
    </>
  );
}

export default App;