import { useTranslation } from "react-i18next";
import { CurrentYearDate } from "./_CommonYear";

interface CardEvenementProps {
    additionalStyle?: String,
    listEvenement: [],
}


export const CardEvenement = ({ additionalStyle, listEvenement }: CardEvenementProps) => {
    const { t } = useTranslation();
    return (
        <div className={`relative ${additionalStyle} rounded-sm border border-stroke bg-white py-6 px-5 shadow-default dark:border-strokedark dark:bg-boxdark  w-full`}>

            {/* titre */}
            <div className="flex justify-between">
                <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                    {t('tableau_de_bord.evenements_titre')}
                </h3>
            </div>



            {/* contenu */}
            <div className='flex justify-center'>
                {
                    listEvenement.length === 0 ?
                        <h4 className="text-[15px] font-normal text-body dark:text-white py-[100px] text-center mt-0   lg:py-[150px]">
                            {t('tableau_de_bord.evenements_aucun')}
                        </h4>

                        :
                        <div></div>
                }


            </div>





            {/* texte en absolute */}
            <CurrentYearDate />

        </div>
    );
};

