import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { getPeriodesAVenirByEnseignant } from '../../api/api_periode.tsx';
import { apiGetNiveauxByEnseignant } from '../../api/other_users/api_enseignant.tsx';
import { apiGetTotalEtudiantByNiveaux } from '../../api/other_users/api_etudiant.tsx';
import { getProgressionGlobalEnseignant } from '../../api/api_objectif.tsx';
import { updateUserAbsences, updateUserNiveaux } from '../../_redux/features/user_slice.tsx';
import { setSections, setCycles, setNiveaux } from '../../_redux/features/data_setting_slice.tsx';
import { apiGetAbsencesByUserAndFilter } from '../../api/discipline/api_discipline.tsx';
import { nbTotalAbsences } from '../../fonctions/fonction.tsx';

const DashboardTeacher = () => {
    const { t } = useTranslation();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [pageEtudiantLoading, setPageEtudiantLoading] = useState(true);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [pageEventLoading, setPageEventLoading] = useState(true);
    const [periodes, setPeriodes] = useState<PeriodeType[]>([]);
    const [pagePeriodeLoading, setPagePeriodeLoading] = useState(true);
    const [progression, setProgression] = useState<number>(0);
    const [nbAbsence, setNbAbsence] = useState<string>("0");

    const dispatch = useDispatch();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    
    // Récupérer TOUTES les données du store (pas seulement filtrées)
    const allNiveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const allCycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const allSections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔍 Début du chargement des données enseignant');
                
                // 1. Charger les niveaux de l'enseignant
                const niveauxEnseignant = await apiGetNiveauxByEnseignant({ 
                    enseignantId: currentUser._id, 
                    annee: currentYear, 
                    semestre: currentSemester 
                });
                
                console.log('📚 Niveaux enseignant reçus:', niveauxEnseignant);

                if (niveauxEnseignant && niveauxEnseignant.length > 0) {
                    // Mettre à jour les niveaux de l'utilisateur
                    dispatch(updateUserNiveaux(niveauxEnseignant));

                    // Extraire les IDs des niveaux
                    const niveauxEnseignantIds = niveauxEnseignant.map(inscription => inscription.niveau);
                    console.log('🔑 IDs des niveaux:', niveauxEnseignantIds);

                    // Attendre que les données soient disponibles dans le store
                    if (allNiveaux.length > 0 && allCycles.length > 0 && allSections.length > 0) {
                        console.log('✅ Données disponibles dans le store');
                        console.log('📊 Total niveaux dans store:', allNiveaux.length);
                        console.log('📊 Total cycles dans store:', allCycles.length);
                        console.log('📊 Total sections dans store:', allSections.length);

                        // Filtrer les niveaux de l'enseignant
                        const niveauxEns = allNiveaux.filter(niveau => 
                            niveau._id && niveauxEnseignantIds.includes(niveau._id)
                        );
                        console.log('✅ Niveaux filtrés:', niveauxEns);

                        // Filtrer les cycles correspondants
                        const filteredCycles = allCycles.filter(cycle =>
                            niveauxEns.some(niveau => niveau.cycle === cycle._id)
                        );
                        console.log('✅ Cycles filtrés:', filteredCycles);

                        // Filtrer les sections correspondantes
                        const filteredSections = allSections.filter(section =>
                            filteredCycles.some(cycle => cycle.section === section._id)
                        );
                        console.log('✅ Sections filtrées:', filteredSections);

                        // Mettre à jour le store avec les données filtrées
                        dispatch(setNiveaux(niveauxEns));
                        dispatch(setCycles(filteredCycles));
                        dispatch(setSections(filteredSections));

                        console.log('✅ Store mis à jour avec les données filtrées');
                    } else {
                        console.warn('⚠️ Données non disponibles dans le store, réessai dans 1 seconde...');
                        // Si les données ne sont pas encore chargées, réessayer après un court délai
                        setTimeout(() => {
                            fetchData();
                        }, 1000);
                        return; // Sortir de la fonction pour éviter de continuer
                    }
                } else {
                    console.warn('⚠️ Aucun niveau trouvé pour cet enseignant');
                }

                // 2. Charger la progression
                const progressionGlobal = await getProgressionGlobalEnseignant(
                    currentUser._id, 
                    currentYear, 
                    currentSemester
                );
                if (progressionGlobal !== null) {
                    setProgression(progressionGlobal);
                    console.log('✅ Progression chargée:', progressionGlobal);
                }

                // 3. Charger les événements
                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                    console.log('✅ Événements chargés:', eventsOfYear.evenements.length);
                }
                setPageEventLoading(false);

                // 4. Charger les périodes à venir
                const periodeBecome = await getPeriodesAVenirByEnseignant({ 
                    enseignantId: currentUser._id, 
                    annee: currentYear, 
                    semestre: currentSemester 
                });
                if (periodeBecome !== null && periodeBecome.periodes) {
                    setPeriodes(periodeBecome.periodes);
                    console.log('✅ Périodes chargées:', periodeBecome.periodes.length);
                }
                setPagePeriodeLoading(false);

                // 5. Charger les absences
                const absences = await apiGetAbsencesByUserAndFilter({ 
                    userId: currentUser._id, 
                    annee: currentYear, 
                    semestre: currentSemester 
                });
                if (absences) {
                    dispatch(updateUserAbsences(absences));
                    setNbAbsence(nbTotalAbsences(absences));
                    console.log('✅ Absences chargées:', nbTotalAbsences(absences));
                }

                console.log('✅ Toutes les données ont été chargées avec succès');

            } catch (error) {
                console.error("❌ Erreur lors du chargement des données:", error);
            }
        };

        // Attendre que les données de base soient chargées avant de lancer fetchData
        if (allNiveaux.length > 0 && allCycles.length > 0 && allSections.length > 0) {
            fetchData();
        } else {
            console.log('⏳ En attente du chargement des données de base...');
        }
    }, [dispatch, currentYear, currentSemester, currentUser._id, allNiveaux.length, allCycles.length, allSections.length]);

    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
                <CardDashboard 
                    title={t('tableau_de_bord.semestre_courant')} 
                    value={currentSemester.toString()} 
                    id={2} 
                />
                <CardDashboard 
                    title={t('tableau_de_bord.nombre_total_absence')} 
                    value={nbAbsence + ' H'} 
                    id={2} 
                />
                <CardDashboard 
                    title={t('tableau_de_bord.progression')} 
                    id={4} 
                    progressionValue={progression} 
                />
            </div>

            <div className='flex flex-col md:flex-row gap-3 mt-3'>
                <CardAlertRecente />
                <CardCourProgrammer 
                    listCourProgrammer={periodes} 
                    pageIsLoading={pagePeriodeLoading} 
                />
                <CardEvenement 
                    listEvenement={evenements} 
                    pageIsLoading={pageEventLoading} 
                />
            </div>
        </>
    );
};

export default DashboardTeacher;