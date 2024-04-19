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
import { apiGetNiveauxByEnseignant, apiGetTotalEnseignants } from '../../api/other_users/api_enseignant.tsx';
import { apiGetTotalEtudiantByNiveaux, apiGetTotalEtudiantByYear } from '../../api/other_users/api_etudiant.tsx';
import { getProgressionGlobalEnseignant } from '../../api/api_chapitre.tsx';
import { setMinimumUser, updateUserNiveaux } from '../../_redux/features/user_slice.tsx';
import { setSections, setCycles, setNiveaux } from '../../_redux/features/data_setting_slice.tsx';

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

    const dispatch = useDispatch();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections:CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalEnseignants = await apiGetTotalEnseignants();
                if (totalEnseignants !== null) {
                    setTotalEnseignant(totalEnseignants);
                }

                const progressionGlobal = await getProgressionGlobalEnseignant(currentUser._id);
                if (progressionGlobal !== null) {
                    setProgression(progressionGlobal);
                }

                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                    setPageEventLoading(false);
                } else {
                    setPageEventLoading(false);
                }

                const periodeBecome = await getPeriodesAVenirByEnseignant({ enseignantId: currentUser._id, annee: currentYear, semestre: currentSemester });
                if (periodeBecome !== null && periodeBecome.periodes) {
                    setPeriodes(periodeBecome.periodes);
                    setPagePeriodeLoading(false);
                } else {
                    setPagePeriodeLoading(false);
                }

                const niveauxEnseignant = await apiGetNiveauxByEnseignant({ enseignantId: currentUser._id, annee: currentYear, semestre: currentSemester });
                if (niveauxEnseignant) {
                    dispatch(updateUserNiveaux(niveauxEnseignant));
                    const niveauxEnseignantIds = niveauxEnseignant.map(inscription => inscription.niveau) ?? [];
                    const niveauxEns = niveaux.filter(niveau => niveau._id && niveauxEnseignantIds.includes(niveau._id));
                    const filteredCycles = cycles.filter(cycle =>
                        niveauxEns.some(niveau => niveau.cycle === cycle._id)
                    );
                    const filteredSections = sections.filter(section =>
                        filteredCycles.some(cycle => cycle.section === section._id)
                    );
                    dispatch(setSections(filteredSections));
                    dispatch(setCycles(filteredCycles));
                    dispatch(setNiveaux(niveauxEns));
                    
                    // Récupérer le total des étudiants par niveaux
                    const totalEtudiantByNiveaux = await apiGetTotalEtudiantByNiveaux({ niveaux: niveauxEnseignant, annee: currentYear });
                    if (totalEtudiantByNiveaux !== null) {
                        setTotalEtudiant(totalEtudiantByNiveaux);
                        setPageEtudiantLoading(false);
                    }
                    
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dispatch, currentYear, currentSemester, t, currentUser._id]);

    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={totalEtudiant.toString()} id={1} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} />
                <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={totalEnseignant.toString()} id={3} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={progression} />
            </div>

            <div className='flex flex-col md:flex-row gap-3 mt-3'>
                <div className='gap-3'>
                    <CardDashboard title={t('tableau_de_bord.nombre_total_absence')} value={'100H'} id={2} />

                    <div className='mt-3'>
                        <CardAlertRecente alertList={[]} additionalStyle={'min-h-[250px]'} />
                    </div>
                </div>

                <CardCourProgrammer listCourProgrammer={periodes} pageIsLoading={pagePeriodeLoading} />
                <CardEvenement listEvenement={evenements} pageIsLoading={pageEventLoading} />
            </div>
        </>
    );
};

export default DashboardTeacher;
