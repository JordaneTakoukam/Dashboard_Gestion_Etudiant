import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { setMatiereSelected } from "../../../_redux/features/matiere_slice"

interface BodyMatiereProps {
    data: MatiereType[];
    onEdit: (matiere: MatiereType) => void;
}

const BodyTable = ({ data, onEdit }: BodyMatiereProps) => {
    // const [selectedMatiere, setSelectedMatiere] = useState<MatiereType>();
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    
    const {t}=useTranslation();
    // const onMoreActionsClick = (actionName: string) => {
    //     switch (actionName) {
    //         case 'Ajouter un chapitre':
    //             if (selectedMatiere) {
    //                 onAddChap(selectedMatiere);
    //             }
    //             // dispatch(setShowModalChapitre())
    //             break;
    //         case 'Ajouter un objectif':
    //             // Logic to add an objective                    


    //             break;
    //         case 'Ajouter une compétence':
    //             // Logic to add a competency
    //             break;
    //         default:
    //             console.error(`Unknown action: ${actionName}`);
    //     }
    // };

    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    function nombreDeChapitres(matiere: MatiereType) {
        // Vérifier si la matière existe et si elle a une liste de chapitres
        if (matiere && matiere.chapitres && Array.isArray(matiere.chapitres)) {
            // Retourner la longueur de la liste des chapitres
            return matiere.chapitres.length;
        } else {
            // Si la matière est invalide ou n'a pas de chapitres, retourner 0
            return 0;
        }
    }

    function volumeHoraireGlobal(matiere: MatiereType) {
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
                <td className="border-b border-[#eee] py-0  pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* code */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* libelle */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> {lang === 'fr' ? item.libelleFr : item.libelleEn}</h5>
                </td>

                {/* nombre de chapitre */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{nombreDeChapitres(item)}</h5>
                </td>

                {/* volume horaire */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{volumeHoraireGlobal(item)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark flex justify-center items-center">
                    <SelectButton
                        listPage={[
                            {
                                "name": t('label.chapitres'),
                                "handleClick": () => { dispatch(setMatiereSelected(item));navigate('/subjects/chapitres/manage') }
                            },
                            {
                                "name": t('label.objectifs'),
                                "handleClick": () => {dispatch(setMatiereSelected(item));navigate('/subjects/objectifs/manage') }
                            },
                            {
                                "name": t('label.types_ens'),
                                "handleClick": () => {dispatch(setMatiereSelected(item));navigate('/subjects/enseignements/manage')}
                            }
                        ]}
                    />
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={(roles.admin === userRole || roles.superAdmin === userRole) ? () => {
                            onEdit(item);
                            dispatch(setShowModalDelete())
                        } : undefined}

                    // onClickOpenChapitres={() => onAddChap(item)}
                    />



                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable