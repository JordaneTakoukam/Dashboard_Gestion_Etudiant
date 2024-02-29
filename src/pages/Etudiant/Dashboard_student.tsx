import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';


const DashBoardStudent = () => {
    const {t}=useTranslation();
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
                <CardEvenement listEvenement={[]} />


            </div>
        </>
    );
};

export default DashBoardStudent;


