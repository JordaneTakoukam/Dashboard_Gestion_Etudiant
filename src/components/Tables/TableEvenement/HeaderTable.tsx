import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";

const HeaderTable = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                {/* <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th> */}

                {/* numéro Evènement */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    N° Evènement
                </th>

                {/* Libellé */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    Libellé
                </th>
                

                {/* Période */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    Période
                </th>
            
                {/* Personnel  */}
                <th className="min-w-[100px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    Personnel
                </th>

                {/* Description/obsercation */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    Description/Observations
                </th>

                {/* Actions  */}
                {roles.admin === userRole && (<th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    Actions
                </th>)}
            </tr>
        </thead>
    )
}

export default HeaderTable