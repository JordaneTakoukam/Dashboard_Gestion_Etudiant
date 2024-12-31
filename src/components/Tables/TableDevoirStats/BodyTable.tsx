import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { useNavigate } from "react-router-dom"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { setDevoirSelected } from "../../../_redux/features/devoir_slice"
import { formatDatetime } from "../../../fonctions/fonction"

interface BodyDevoirProps {
    data: {
        etudiant:UserState
        meilleureScore: number,
        nombreTentatives: number,
    }[];
    noteSur:number
}

const BodyTable = ({ data, noteSur }: BodyDevoirProps) => {
    // const [selectedDevoir, setSelectedDevoir] = useState<DevoirType>();
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);    
    
    
    const {t}=useTranslation();
  
    const dispatch = useDispatch();
    
   
   
    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0  pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{item.etudiant.nom}</h5>
                </td>

                {/* prénom */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> {item.etudiant?.prenom || ""}</h5>
                </td>

                {/* meilleur note */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{`${item.meilleureScore}/${noteSur}`}</h5>
                </td>

                {/* nombre tentative */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{item.nombreTentatives}</h5>
                </td>

            </tr>
        ))}
    </tbody>
}

export default BodyTable