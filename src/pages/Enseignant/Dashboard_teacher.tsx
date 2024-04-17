import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { getPeriodesAVenirByEnseignant } from '../../api/api_periode.tsx';
import { apiGetTotalEnseignants } from '../../api/other_users/api_enseignant.tsx';
import { apiGetTotalEtudiantByYear } from '../../api/other_users/api_etudiant.tsx';
import { getProgressionGlobalEnseignant } from '../../api/api_chapitre.tsx';


const DashboardTeacher = () => {
    const {t}=useTranslation();const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemester = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [periodes, setPeriodes] = useState<PeriodeType[]>([]);
    const [progression, setProgression] = useState<number>(0);
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau=>niveau.annee===currentYear)?.niveau);
    const currentNiveauId=currentNiveau?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalEtudiantByYear = await apiGetTotalEtudiantByYear({ annee: currentYear });
                if (totalEtudiantByYear !== null) {
                    setTotalEtudiant(totalEtudiantByYear);
                }

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
                }
                                    
                const periodeBecome = await getPeriodesAVenirByEnseignant({ enseignantId: currentUser._id, annee:currentYear, semestre:currentSemester });
                if (periodeBecome !== null && periodeBecome.periodes) {
                    setPeriodes(periodeBecome.periodes);
                }
                
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentYear, currentNiveauId, t]);
    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={'600'} id={1} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} />
                {/* <CardDashboard title={"Nombres total d'enseignants"} value={'35'} id={3} /> */}
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={progression} />

            </div>

            <div className='flex flex-col md:flex-row gap-3 mt-3'>
                <div className='gap-3'>
                    <CardDashboard title={t('tableau_de_bord.nombre_total_absence')} value={'100H'} id={2} />

                    <div className='mt-3'>
                        <CardAlertRecente alertList={[]} additionalStyle={'min-h-[250px]'} />

                    </div>
                </div>

                <CardCourProgrammer listCourProgrammer={periodes} />
                <CardEvenement listEvenement={evenements} />
            </div>

        </>
    );
};

export default DashboardTeacher;


