import Breadcrumb from "../../components/Breadcrumb";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import { CardEvenement } from "../../components/CardDashboard/CardEvenement";
import { ChartEtudiantNiveau } from "../../components/Chart/ChartEtudiantParNiveau";
import { ChartNombreEtudiant } from "../../components/Chart/ChartAbscenceEtudiant";


const DashBoardAmin = () => {
    const style = 'text-[13px] xl:text-[14px]';
    return (
        <>
            <Breadcrumb pageName="Tableau de bord" isDashboard={true} />

            {/*  */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5">
                <CardDashboard title={"Nombres total d'étudiants"} value={'600'} id={1} additionalStyle={style} />
                <CardDashboard title={"Abscences total des étudiants"} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={"Nombres total d'enseignants"} value={'35'} id={3} additionalStyle={style} />
                <CardDashboard title={"Abscences total des enseignants"} value={'100H'} id={2} additionalStyle={style} />
                <CardDashboard title={"Progression globales des enseignants"} id={4} progressionValue={40}  />

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
