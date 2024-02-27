import Breadcrumb from "../../components/Breadcrumb";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import { CardEvenement } from "../../components/CardDashboard/CardEvenement";
import { ChartEtudiantNiveau } from "../../components/Chart/ChartEtudiantParNiveau";
import { ChartNombreEtudiant } from "../../components/Chart/ChartAbscenceEtudiant";
import { useTranslation } from "react-i18next";


const DashBoardAmin = () => {
    const style = 'text-[13px] xl:text-[14px]';
    const { t } = useTranslation();
    return (
        <>
            <Breadcrumb pageName={t('tableau_de_bord.title')} isDashboard={true} />

            {/*  */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={'600'} id={1} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.total_enseignants')} value={'35'} id={3} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.absences_enseignants')} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={40}  />

            </div>

            <div className="xl:hidden mt-5 block" >
                <CardEvenement listEvenement={[]} />
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
