//src/components/Tables/TableEvaluation/HeaderTable.tsx

import { useTranslation } from "react-i18next";

const HeaderTable = () => {
    const { t } = useTranslation();

    return (
        <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white xl:pl-5 hidden md:table-cell">
                    #
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    {t('label.libelle')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white hidden md:table-cell">
                    {t('label.type')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    {t('label.date_epreuve')}
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                    {t('label.statut')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white hidden lg:table-cell">
                    {t('label.anonymats')}
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                    {t('label.actions')}
                </th>
            </tr>
        </thead>
    );
};

export default HeaderTable;