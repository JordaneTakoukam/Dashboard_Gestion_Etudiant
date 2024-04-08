import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalChapitre, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

interface BodyPeriodeEnseignementProps {
    data: PeriodeEnseignementType[];
    onEdit: (matiere : PeriodeEnseignementType) => void;
    onAddEnseignement:(matiere : PeriodeEnseignementType)=>void;
}

const BodyTable = ({ data, onEdit, onAddEnseignement }: BodyPeriodeEnseignementProps) => {
    const [selectedPeriodeEnseignement, setSelectedPeriodeEnseignement] = useState<PeriodeEnseignementType>();
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const handleAddChapitre = (matiere: PeriodeEnseignementType) => {
        onAddEnseignement(matiere); // Appeler la fonction onAddEnseignement avec la matière sélectionnée
        navigate("save/chapitres"); // Rediriger vers l'interface d'ajout de chapitres
    };
    
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

                {/* periode */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> {lang === 'fr' ? item.periodeFr : item.periodeEn}</h5>
                </td>

                {/* date début */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.dateDebut}</h5>
                </td>

                {/* date fin */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{item.dateFin}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={roles.admin === userRole || roles.superAdmin === userRole ?() => {
                            onEdit(item);
                            dispatch(setShowModalDelete())
                        }:undefined}
                        
                        onClickOpenChapitres={() => onAddEnseignement(item)} 
                    />
                    
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable