import { useTranslation } from "react-i18next";
import { CurrentYearDate } from "./_CommonYear";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { jours } from "../../pages/CommonPage/EmploiDeTemp";
import LoadingTable from "../Tables/common/LoadingTable";

interface CardCourProgrammerPros {
    additionalStyle?: String,
    listCourProgrammer: PeriodeType[] 
    pageIsLoading?:boolean,
}

export const CardCourProgrammer = ({ additionalStyle,listCourProgrammer, pageIsLoading }: CardCourProgrammerPros) => {
    const {t}=useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const typesEnseignement=useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement); 
    const sallesCours=useSelector((state: RootState) => state.dataSetting.dataSetting.salleDeCours); 
    return (
        <div className={`relative ${additionalStyle} rounded-sm border border-stroke bg-white py-6 px-5 shadow-default dark:border-strokedark dark:bg-boxdark  w-full`}>

            {/* titre */}
            <div className="flex justify-between">
                <h3 className=" mt-0 text-meta-4 dark:text-gray text-[13px] xl:text-[14px] text-start mr-[42px] font-semibold">
                    {t('tableau_de_bord.cours_programmes')}
                </h3>
            </div>

            {/* contenu */}
            {pageIsLoading ?
                <LoadingTable />:<div className='flex justify-center w-full'>

               {listCourProgrammer && listCourProgrammer.length === 0 ? (
                    <h4 className="text-[15px] font-normal text-body dark:text-white py-[100px] text-center mt-0 lg:py-[150px] w-full">
                        {t('tableau_de_bord.aucun_cour')}
                    </h4>
                ) :(
                    <div className="w-full">
                        {listCourProgrammer && listCourProgrammer.map((periode, index) => (
                            <div key={index} className={index % 2 === 0 ? "border-b border-[#eee] py-0 lg:py-2 px-2 dark:border-strokedark bg-gray-2 dark:bg-black w-full" :
                            "border-b border-[#eee] py-0 lg:py-2 px-2  dark:border-strokedark w-full"}>
                                <p>{t('label.horaire')} : {periode.heureDebut+"-"+periode.heureFin}</p>
                                <p>{t('label.jour')} : {lang === 'fr' ? jours.find(jour=>jour.ordre==periode.jour)?.libelleFr??"" : jours.find(jour=>jour.ordre==periode.jour)?.libelleEn??""}</p>
                                <p>{t('label.matiere')} : {(typesEnseignement.find(type=>type._id===periode.typeEnseignement)?.code??"")+" "+periode.matiere.code}</p>
                                <p>{t('label.salle_cour')} : {sallesCours.find(salle=>salle._id===periode.salleCours)?.code??""}</p>
                            </div>
                        ))}
                    </div>)
                }

            </div>}

            {/* texte en absolute */}
            <CurrentYearDate />

        </div>
    );
};
