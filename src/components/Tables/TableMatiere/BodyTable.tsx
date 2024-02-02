import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModalDelete, setShowModalUpdate } from "../../../_redux/features/setting_slice"
import { Matiere } from "../../../pages/Admin/ListeMatieres"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"

const BodyTable = ({ data }: { data: Matiere[] }) => {

    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* code */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* libelle */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.libelle}</h5>
                </td>

                {/* nombre de chapitre */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.nbChapitre}</h5>
                </td>

                {/* volume horaire */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{item.volumeHoraire}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            
                            dispatch(setShowModalUpdate())
                        }}
                        onClickDelete={roles.admin === userRole ?() => {
                            dispatch(setShowModalDelete())
                        }:undefined}
                        onClickAddInfoSub={() => {
                            
                        }}
                    />
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable