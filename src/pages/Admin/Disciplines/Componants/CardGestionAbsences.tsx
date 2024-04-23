
import { useTranslation } from "react-i18next";
import { FaArrowUpLong } from "react-icons/fa6";
import { TbClockHour11 } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";


interface CardGestionUserProps {
    title: String,
    value?: String,
    id: number,
    isStudent?:boolean
}



export const CardGestionUser = ({ title, value, id, isStudent}: CardGestionUserProps) => {
    const { t } = useTranslation();
    const { semestre, annee } = !isStudent?useSelector((state: RootState) => state.enseignantDisciplineSlice.selected):useSelector((state: RootState) => state.etudiantDisciplineSlice.selected)
    
    return (
        <div className={`
        
        text-black bg-white
    dark:bg-boxdark dark:text-gray
    relative rounded-sm border border-stroke pb-12  py-6 px-5 shadow-default dark:border-strokedark  w-full`}>
            {
                id != 4 && <div className="absolute top-0 right-0 mt-5 mr-2 z-10">
                    <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 '>
                        <div className="text-[#1111114e] text-[25px]" >
                            <TbClockHour11 />

                        </div>
                    </div>
                </div>
            }

            {/* titre */}
            <div className="flex justify-between h-[40px] ">
                <h3 className={` mt-0  text-[13px] xl:text-[14px] text-start  font-semibold`}>
                    {t(title.toString())}
                </h3>
            </div>


            <div className="flex items-start justify-center">
                <h3 className={` mt-0  text-[13px] xl:text-[14px] text-start  font-semibold
                ${id === 102 && value === '0' && 'text-[#24910cf9]'}
                ${id === 102 && value !== '0' && 'text-[#fd0707f3]'}
                `}>
                    {value} <span className="pl-1">
                        {id === 101 && semestre}
                        {id === 102 && value === '0' && t('menu.heure_d_absence')}
                        {id === 102 && value !== '0' && t('menu.heures_d_absences')}
                    </span>
                </h3>
            </div>


            {/* texte en absolute */}
            <div className={` absolute bottom-0 right-0 mb-4 mr-2 z-10 text-meta-5 `}>
                {/* annee  */}
                <span className="flex items-center gap-1 text-[12px] font-medium">
                    {annee}
                    <div className="fill-meta-5 h-[10px] w-[10px]">
                        <FaArrowUpLong />
                    </div>
                </span>
            </div>
        </div >
    );
};

