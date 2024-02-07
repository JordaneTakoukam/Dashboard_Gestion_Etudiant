import { useDispatch } from "react-redux"
import { capitalizeFirstLetter } from "../../../fonctions/fonction"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalUpdate } from "../../../_redux/features/setting_slice"
import { Enseignant } from "../../../pages/Admin/ListeEnseignants"
import { nbTotal } from "../TableAbsences/Table"


const BodyTable = ({ data, onEdit }: { data: Enseignant[],  onEdit: (enseignant: Enseignant, isHourRemove:boolean) => void }) => {

    const dispatch = useDispatch();

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.matricule?item.matricule:""}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.nom}</h5>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.prenom?item.prenom:""}</h5>
                </td>


                {/* e-mail */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5>{item.email}</h5>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.contact?item.contact:""}</h5>
                </td>

                {/* nombre d'heure d'absence */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{nbTotal(item, 1)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickAddHour={() => {
                            onEdit(item, false);
                            dispatch(setShowModal())
                        } }
                        onClickRemovHour={() => {
                            onEdit(item, true);
                            dispatch(setShowModal())
                        } }                                             
                    />
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable