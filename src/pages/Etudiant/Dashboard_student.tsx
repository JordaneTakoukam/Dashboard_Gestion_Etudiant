import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store.tsx';
import { getProgressionGlobalEnseignants } from '../../api/api_chapitre.tsx';
import { getFirstTenEventsOfYear } from '../../api/api_evenement.tsx';
import { apiGetTotalEnseignants } from '../../api/other_users/api_enseignant.tsx';
import { apiGetTotalEtudiantByYear } from '../../api/other_users/api_etudiant.tsx';


const DashBoardStudent = () => {
    const {t}=useTranslation();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const [totalEtudiant, setTotalEtudiant] = useState<number>(0);
    const [totalEnseignant, setTotalEnseignant] = useState<number>(0);
    const [evenements, setEvenements] = useState<EvenementType[]>([]);
    const [progression, setProgression] = useState<number>(0);

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

                const progressionGlobal = await getProgressionGlobalEnseignants();
                if (progressionGlobal !== null) {
                    setProgression(progressionGlobal);
                }

                const eventsOfYear = await getFirstTenEventsOfYear({ annee: currentYear });
                if (eventsOfYear !== null && eventsOfYear.evenements) {
                    setEvenements(eventsOfYear.evenements);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentYear]);
    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className='flex flex-col md:flex-row gap-3 justify-between '>
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5"> */}
                <div className="flex flex-col gap-y-3">
                    <CardDashboard title={t('tableau_de_bord.nombre_total_absence')} value={'22H'} id={1} />
                    <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={40} />
                    <CardAlertRecente alertList={[]} />

                </div>

                {/*  */}
                <CardCourProgrammer  listCourProgrammer={[]}/>
                <CardEvenement listEvenement={evenements} />


            </div>
        </>
    );
};

export default DashBoardStudent;


