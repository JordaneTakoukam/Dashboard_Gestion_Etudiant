import { HiOutlineBellAlert } from "react-icons/hi2";
import { CurrentYearDate } from "./_CommonYear";

interface CardAlertRecenteProps {
    alertList: [];
    additionalStyle?: String,
}


export const CardAlertRecente = ({ additionalStyle, alertList }: CardAlertRecenteProps) => {
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
                    alertList.length === 0 ?
                        (
                            <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                                Alerte récentes
                            </h3>
                        ) :
                        (
                            <h3>Liste des alertes recentes </h3>
                        )
                }

            </div>



            {/* contenu */}
            <div className='flex justify-center'>
                <h4 className="text-[13px] dark:text-gray-3 font-normal text-body   text-center mt-[40px]">
                    Aucune alerte pour le moment
                </h4>
            </div>





            {/* texte en absolute */}
            <CurrentYearDate />
        </div>
    );
};

