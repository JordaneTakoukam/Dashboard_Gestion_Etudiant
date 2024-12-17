import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";

const HeaderTable = () => {
    const {t}=useTranslation();
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageSubjectPermission = userPermissions.includes('gerer_matieres');
    const hasManageChapterPermission = userPermissions.includes('gerer_chapitres') || userPermissions.includes('consulter_liste_chapitres');
    const hasManageObjectivePermission = userPermissions.includes('gerer_objectifs') || userPermissions.includes('consulter_liste_objectifs')
    const hasManageActPedPermission = userPermissions.includes('gerer_activites_pedagogiques');
    const hasUpdateSubjectPermission = userPermissions.includes('modifier_information_matiere');
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th>

                {/* Titre */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.titre')}
                </th>

                {/* Enseignant */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.enseignant')}
                </th>
                

                {/* Nombre de question */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.nombre_question')}
                </th>
            
                {/* Volume horaire  */}
                <th className="min-w-[100px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black ">
                    {t('label.date_fin')}
                </th>

                {/* Actions  */}
                {(true) &&  <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.actions')}
                </th>}
            </tr>
        </thead>
    )
}

export default HeaderTable