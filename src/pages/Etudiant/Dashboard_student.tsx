import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { getProgressionGlobalEnseignantsNiveau } from '../../api/api_objectif.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { getPeriodesAVenirByNiveau } from '../../api/api_periode.tsx';
import { setSections, setCycles, setNiveaux } from '../../_redux/features/data_setting_slice.tsx';
import { updateUserAbsences } from '../../_redux/features/user_slice.tsx';
import { apiGetAbsencesByUserAndFilter } from '../../api/discipline/api_discipline.tsx';
import { nbTotalAbsences } from '../../fonctions/fonction.tsx';



const DashBoardStudent = () => {
    const {t}=useTranslation();
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [periodes, setPeriodes] = useState<PeriodeType[]>([]);
    const [progression, setProgression] = useState<number>(0);
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const niveaux:NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections:SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau=>niveau.annee===currentYear)?.niveau);
    const currentNiveauId=currentNiveau?._id;
    const dispatch = useDispatch();
    const [nbAbsence, setNbAbsence]=useState<string>("0");

    useEffect(() => {
        const niveauxEtuIds = currentUser.niveaux.map(inscription => inscription.niveau) ?? [];
        const niveauxEtu = niveaux.filter(niveau => niveau._id && niveauxEtuIds.includes(niveau._id));
        const filteredCycles = cycles.filter(cycle =>
            niveauxEtu.some(niveau => niveau.cycle === cycle._id)
        );
        const filteredSections = sections.filter(section =>
            filteredCycles.some(cycle => cycle.section === section._id)
        );
        dispatch(setSections(filteredSections));
        dispatch(setCycles(filteredCycles));
        dispatch(setNiveaux(niveauxEtu));
        const fetchData = async () => {
            try {
                // const totalEtudiantByYear = await apiGetTotalEtudiantByYear({ annee: currentYear });
                // if (totalEtudiantByYear !== null) {
                //     setTotalEtudiant(totalEtudiantByYear);
                // }

                // const totalEnseignants = await apiGetTotalEnseignants();
                // if (totalEnseignants !== null) {
                //     setTotalEnseignant(totalEnseignants);
                // }
                if(currentNiveauId){
                    const progressionGlobal = await getProgressionGlobalEnseignantsNiveau({niveauId:currentNiveauId, annee:currentYear, semestre:currentSemester});
                    console.log(progressionGlobal)
                    if (progressionGlobal !== null) {
                        setProgression(progressionGlobal);
                    }
                }

                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                }
                if(currentNiveauId){                    
                    const periodeBecome = await getPeriodesAVenirByNiveau({ niveauId: currentNiveauId, annee:currentYear, semestre:currentSemester });
                    if (periodeBecome !== null && periodeBecome.periodes) {
                        setPeriodes(periodeBecome.periodes);
                    }
                }

                const absences = await apiGetAbsencesByUserAndFilter({ userId: currentUser._id, annee: currentYear, semestre: currentSemester });
                if(absences){
                    dispatch(updateUserAbsences(absences));
                    setNbAbsence(nbTotalAbsences(absences));
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [dispatch, currentYear, currentSemester,currentUser._id, t]);
    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className='flex flex-col md:flex-row gap-3 justify-between '>
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5"> */}
                <div className="flex flex-col gap-y-3">
                    <CardDashboard title={t('tableau_de_bord.nombre_total_absence')} value={nbAbsence+' H'} id={1} />
                    <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={progression} />
                    <CardAlertRecente />

                </div>

                {/*  */}
                <CardCourProgrammer  listCourProgrammer={periodes}/>
                <CardEvenement listEvenement={evenements} />


            </div>
        </>
    );
};

export default DashBoardStudent;


