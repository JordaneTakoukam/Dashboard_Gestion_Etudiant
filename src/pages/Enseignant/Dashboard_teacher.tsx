import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import { CardAlertRecente } from '../../components/CardDashboard/CardAlertRecente.tsx';
import { CardCourProgrammer } from '../../components/CardDashboard/CardCourProgrammer.tsx';
import CardDashboard from '../../components/CardDashboard/CardDashboard.tsx';
import { CardEvenement } from '../../components/CardDashboard/CardEvenement.tsx';


const DashboardTeacher = () => {
    const {t}=useTranslation();
    return (
        <>
            <Breadcrumb pageName={t('menu.tableau_de_bord')} isDashboard={true} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 xl:grid-cols-3 2xl:gap-7.5">
                <CardDashboard title={t('tableau_de_bord.total_etudiants')} value={'600'} id={1} />
                <CardDashboard title={t('tableau_de_bord.absences_etudiants')} value={'100H'} id={2} />
                {/* <CardDashboard title={"Nombres total d'enseignants"} value={'35'} id={3} /> */}
                <CardDashboard title={t('tableau_de_bord.progression')} id={4} progressionValue={40} />

            </div>

            <div className='flex flex-col md:flex-row gap-3 mt-3'>
                <div className='gap-3'>
                    <CardDashboard title={t('tableau_de_bord.nombre_total_absence')} value={'100H'} id={2} />

                    <div className='mt-3'>
                        <CardAlertRecente alertList={[]} additionalStyle={'min-h-[250px]'} />

                    </div>
                </div>

                <CardCourProgrammer listCourProgrammer={[]} />
                <CardEvenement listEvenement={[]} />
            </div>

        </>
    );
};

export default DashboardTeacher;


