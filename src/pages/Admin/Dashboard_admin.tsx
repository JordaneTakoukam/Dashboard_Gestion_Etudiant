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


const DashBoardAmin = () => {
    const style = 'text-[13px] xl:text-[14px]';
    const { t } = useTranslation();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const[totalEtudiant, setTotalEtudiant]=useState<number>();
    const[totalEnseignant, setTotalEnseignant]=useState<number>();
    const [evenements, setEvenements]=useState<EvenementType[]>();
    useEffect(() => {
        const fetchTotalEtudiants = async () => {
            try {
                setTotalEtudiant(0);
                let fetchedTotal = await apiGetTotalEtudiantByYear({annee:currentYear });
                if (fetchedTotal) { 
                    setTotalEtudiant(fetchedTotal)
                } 
                setTotalEnseignant(0);
                fetchedTotal = await apiGetTotalEnseignants();
                if (fetchedTotal) { // Vérifiez si fetchedEtudiants n'est pas faux, vide ou indéfini
                    setTotalEnseignant(fetchedTotal)
                } 
            } catch (error) {
                console.log("error")
            } finally {
               
            }
        }
        fetchTotalEtudiants();
        const fetchTotalEnseignant = async () => {
            try {
                setTotalEnseignant(0);
                const fetchedTotal = await apiGetTotalEnseignants();
                if (fetchedTotal) { // Vérifiez si fetchedEtudiants n'est pas faux, vide ou indéfini
                    setTotalEnseignant(fetchedTotal)
                } 
            } catch (error) {
                console.log("error")
            } finally {
            }
        }
        fetchTotalEnseignant();
        const fetchEvenements = async () => {
            try {
                setEvenements([]);
                const fetchedEvenements = await getFirstTenEventsOfYear({ annee: currentYear});
                if(fetchedEvenements){
                    setEvenements(fetchedEvenements.evenements);
                }
                // Mettez à jour l'état Redux avec les données récupérées
    
            } catch (error) {
            } finally {
            }
        };
        fetchEvenements();
    }, [t]);
    return (
        
        <>
            <Breadcrumb pageName={t('tableau_de_bord.title')} isDashboard={true} />

            {/*  */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={totalEtudiant?.toString()} id={1} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={totalEnseignant?.toString()} id={3} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={40}  />

            </div>

            <div className="xl:hidden mt-5 block" >
                <CardEvenement listEvenement={evenements} />
            </div>
            <div className="flex justify-between  mt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 w-full mr-0 xl:mr-3 ">

                    <ChartEtudiantNiveau />
                    <ChartNombreEtudiant />

                    {/* a droite */}

                </div>

                <div className="hidden xl:block" >
                    <CardEvenement additionalStyle={'min-w-[350px] min-h-[431px]'} listEvenement={[]} />
                </div>
            </div>




            {/* <div className="mt-4 grid grid-cols-10 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartConducteur />
                <ChartDepense />
            </div> */}

            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-6">
        <CardPrixAuKm />
        <CardPrixAuLitre />
      </div> */}

            {/* Depenses par semaines  */}

            {/* <div className="my-4 grid grid-cols-10 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartSemaine />
                <ChartMonth />
            </div> */}

            {/* Depenses annuelles  */}
            {/* <ChartAnnee /> */}
        </>
    );
};

export default DashBoardAmin;
