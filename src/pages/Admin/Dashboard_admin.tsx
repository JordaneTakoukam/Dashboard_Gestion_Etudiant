import Breadcrumb from "../../components/Breadcrumb";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import { CardEvenement } from "../../components/CardDashboard/CardEvenement";
import { ChartEtudiantNiveau } from "../../components/Chart/ChartEtudiantParNiveau";
import { ChartNombreEtudiant } from "../../components/Chart/ChartAbscenceEtudiant";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useEffect, useState } from "react";
import { apiGetTotalEtudiantByYear } from "../../api/other_users/api_etudiant";
import { apiGetTotalEnseignants } from "../../api/other_users/api_enseignant";
import { getFirstTenEventsOfYear } from "../../api/api_evenement";
import { getProgressionGlobalEnseignants } from "../../api/api_chapitre";

const DashBoardAmin = () => {
    const style = 'text-[13px] xl:text-[14px]';
    const { t } = useTranslation();
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
            <Breadcrumb pageName={t('tableau_de_bord.title')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={totalEtudiant.toString()} id={1} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={totalEnseignant.toString()} id={3} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={progression}  />
            </div>

            <div className="xl:hidden mt-5 block">
                <CardEvenement listEvenement={evenements} />
            </div>

            <div className="flex justify-between mt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 w-full mr-0 xl:mr-3">
                    <ChartEtudiantNiveau />
                    <ChartNombreEtudiant />
                </div>

                <div className="hidden xl:block">
                    <CardEvenement additionalStyle={'min-w-[350px] min-h-[431px]'} listEvenement={evenements} />
                </div>
            </div>
        </>
    );
};

export default DashBoardAmin;
