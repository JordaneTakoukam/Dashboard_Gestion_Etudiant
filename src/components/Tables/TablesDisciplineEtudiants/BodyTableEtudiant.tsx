import { useDispatch } from "react-redux"
import { capitalizeFirstLetter } from "../../../fonctions/fonction"
import { Etudiant } from "../../../pages/Admin/ListeEtudiants"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModalDelete, setShowModalUpdate } from "../../../_redux/features/setting_slice"

const BodyTableEtudiant = ({ data }: { data: Etudiant[] }) => {

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
                    <h5>{capitalizeFirstLetter(item.matricule)}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{capitalizeFirstLetter(item.lastName)}</h5>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{capitalizeFirstLetter(item.firstName)}</h5>
                </td>


                {/* e-mail */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5>{capitalizeFirstLetter(item.email)}</h5>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.contact}</h5>
                </td>

                {/* nombre d'heure d'absence */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.nbAbscences}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickAddHour={() => {
                            dispatch(setShowModalUpdate())
                        } }
                        onClickRemovHour={() => {
                            dispatch(setShowModalUpdate())
                        } }                                             
                    />
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTableEtudiant