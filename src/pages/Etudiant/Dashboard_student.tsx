import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';


const DashBoardStudent = () => {
    return (
        <>
            <Breadcrumb pageName="Tableau de bord" isDashboard={true} />

            <div className='flex flex-col md:flex-row gap-3 justify-between '>
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-5 2xl:gap-7.5"> */}
                <div className="flex flex-col gap-y-3">
                    <CardDashboard title={"Nombres total d'heures d'abscences"} value={'22H'} id={1} />
                    <CardDashboard title={"Progression globales des enseignants"} id={4} progressionValue={10} />
                    <CardAlertRecente alertList={[]} />

                </div>

                {/*  */}
                <CardCourProgrammer  listCourProgrammer={[]}/>
                <CardEvenement listEvenement={[]} />


            </div>
        </>
    );
};

export default DashBoardStudent;


