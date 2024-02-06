import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete, setShowModalUpdate } from "../../../_redux/features/setting_slice"
import { Matiere } from "../../../pages/Admin/ListeMatieres"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"

const BodyTable = ({ data, onEdit }: { data: Matiere[], onEdit:(matiere:Matiere)=>void }) => {

    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    function nombreDeChapitres(matiere:Matiere) {
        // Vérifier si la matière existe et si elle a une liste de chapitres
        if (matiere && matiere.chapitres && Array.isArray(matiere.chapitres)) {
            // Retourner la longueur de la liste des chapitres
            return matiere.chapitres.length;
        } else {
            // Si la matière est invalide ou n'a pas de chapitres, retourner 0
            return 0;
        }
    }

    function volumeHoraireGlobal(matiere:Matiere) {
        let volumeTotal = 0;
    
        // Vérifier si la matière existe et si elle a une liste de chapitres
        if (matiere && matiere.chapitres && Array.isArray(matiere.chapitres)) {
            // Parcourir tous les chapitres de la matière
            matiere.chapitres.forEach(chapitre => {
                // Vérifier si le chapitre a une liste de types d'enseignement
                if (chapitre.typesEnseignement && Array.isArray(chapitre.typesEnseignement)) {
                    // Ajouter le volume horaire de chaque type d'enseignement du chapitre au volume total
                    chapitre.typesEnseignement.forEach(typeEnseignement => {
                        if (typeEnseignement.volumeHoraire) {
                            volumeTotal += typeEnseignement.volumeHoraire;
                        }
                    });
                }
            });
        }
    
        return volumeTotal;
    }
    
    

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
                    <h5>{nombreDeChapitres(item)}</h5>
                </td>

                {/* volume horaire */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{volumeHoraireGlobal(item)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={roles.admin === userRole ?() => {
                            onEdit(item);
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