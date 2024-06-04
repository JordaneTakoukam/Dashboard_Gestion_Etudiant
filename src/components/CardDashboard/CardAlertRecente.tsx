import { HiOutlineBellAlert } from "react-icons/hi2";
import { CurrentYearDate } from "./_CommonYear";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { formatDate, formatDateWithLang } from "../../fonctions/fonction";
import { jours } from "../../pages/CommonPage/EmploiDeTemp";

interface CardAlertRecenteProps {
    additionalStyle?: String,
}


export const CardAlertRecente = ({ additionalStyle }: CardAlertRecenteProps) => {
    const {t}=useTranslation();
    const listAbsenceSignaler:SignalementAbsence[] = useSelector((state: RootState) => state.signalementAbsence.data);
    const sortedAbsenceSignaler = [...listAbsenceSignaler].sort((a, b) => {
        const dateA = a.date_creation ? new Date(a.date_creation) : new Date(0);
        const dateB = b.date_creation ? new Date(b.date_creation) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    return (
        <div className={`${additionalStyle} relative rounded-sm border border-stroke bg-white py-6 px-5 shadow-default dark:border-strokedark dark:bg-boxdark min-h-[200px] min-w-[300px]`}>

            {/* icone position en haut a gauche */}
            <div className="absolute top-0 right-0 mt-5 mr-2 z-10">
                <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 '>
                    <div className="text-primary text-[25px]">
                        <HiOutlineBellAlert />
                    </div>
                </div>
            </div>


            {/* titre */}
            <div className="flex justify-between">
                {
                    sortedAbsenceSignaler.length === 0 ?
                        (
                            <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                                {t('tableau_de_bord.alertes')}
                            </h3>
                        ) :
                        (
                            <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                                {t('tableau_de_bord.liste_alerte')} 
                            </h3>
                        )
                }

            </div>



            {/* contenu */}
            <div className='flex justify-center mt-5 '>
                {sortedAbsenceSignaler.length === 0 ?(<h4 className="text-[13px] dark:text-gray-3 font-normal text-body   text-center mt-[40px]">
                    {t('tableau_de_bord.aucune_alerte')}
                </h4>):
                (
                    <div className="w-full">
                        {sortedAbsenceSignaler && sortedAbsenceSignaler.slice(0, 5).map((e, index) => (
                            
                            <div key={index} className={index % 2 === 0 ? "border-b border-[#eee] py-0 lg:py-2 px-2 dark:border-strokedark bg-gray-2 dark:bg-black w-full" :
                            "border-b border-[#eee] py-0 lg:py-2 px-2  dark:border-strokedark w-full"}>
                                <div className='flex gap-x-1'>
                                    <span className="text-black dark:text-white">
                                    {`${e.user?.nom??""} ${e.user?.prenom??""}`}
                                    </span>
                                </div>
                                <p className='text-[14px] font-medium'>
                                    {t('label.notif_abs_debut')}
                                    {lang === 'fr' ? jours.find(jour => jour.ordre === e.jour_absence)?.libelleFr : jours.find(jour => jour.ordre === e.jour_absence)?.libelleEn}
                                    {t('label.notif_abs_milieu')}{e.heure_debut_absence + "-" + e.heure_fin_absence}
                                </p>
                                <p className="text-right">
                                    {`${e.date_creation?formatDateWithLang(e.date_creation.toString(), lang):""}`}
                                </p>
                            </div>
                        ))}
                    </div>)
                }
            </div>





            {/* texte en absolute */}
            <CurrentYearDate />
        </div>
    );
};

