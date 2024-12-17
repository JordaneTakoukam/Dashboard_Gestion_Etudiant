import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { useNavigate } from "react-router-dom"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { setDevoirSelected } from "../../../_redux/features/devoir_slice"
import { formatDateWithLang } from "../../../fonctions/fonction"

interface BodyDevoirProps {
    data: DevoirType[];
    onEdit: (devoir: DevoirType) => void;
    semestre:number|undefined;
    annee:number|undefined
}

const BodyTable = ({ data, semestre,annee, onEdit }: BodyDevoirProps) => {
    // const [selectedDevoir, setSelectedDevoir] = useState<DevoirType>();
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    // const hasManageSubjectPermission = userPermissions.includes('gerer_devoirs');
    // const hasManageChapterPermission = userPermissions.includes('gerer_questions') || userPermissions.includes('consulter_liste_questions');
    // const hasManageObjectivePermission = userPermissions.includes('gerer_objectifs') || userPermissions.includes('consulter_liste_objectifs')
    // const hasManageActPedPermission = userPermissions.includes('gerer_activites_pedagogiques');
    // const hasUpdateSubjectPermission = userPermissions.includes('modifier_information_devoir');
    
    const {t}=useTranslation();
  
    const dispatch = useDispatch();
    
    function nombreDeQuestions(devoir: DevoirType) {
        // Vérifier si le devoir existe et si il a une liste de questions
        if (devoir && devoir.questions && Array.isArray(devoir.questions)) {
           
            return devoir.questions.length;
            
        } else {
            // Si le devoir est invalide ou n'a pas de questions, retourner 0
            return 0;
        }
    }

   
    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0  pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* code */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{lang === 'fr' ? item.titre_fr : item.titre_en}</h5>
                </td>

                {/* utilisateur */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> {`${item.utilisateur.nom} ${item.utilisateur?.prenom || ""}`}</h5>
                </td>

                {/* nombre de question */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark">
                    <h5>{nombreDeQuestions(item)}</h5>
                </td>

                {/* date de fin */}
                <td className="border-b border-[#eee] py-0  px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{formatDateWithLang(item.deadline, lang)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark flex justify-center items-center">
                    {(true) && (() => {
                        // Construire dynamiquement la liste des pages en fonction des permissions
                        const listPage = [];

                        if (true) {
                            listPage.push({
                                name: t('label.details'),
                                handleClick: () => {
                                   alert("Fonctionnalitée pas encore disponible")
                                },
                            });
                        }

                        if (true) {
                            listPage.push({
                                name: t('label.questions'),
                                handleClick: () => {
                                    dispatch(setDevoirSelected(item));
                                    navigate('/subjects/questions/manage');
                                },
                            });
                        }

                        if (true) {
                            listPage.push({
                                name: t('label.effectuer_devoir'),
                                handleClick: () => {
                                    alert("Fonctionnalité pas encore disponible")
                                },
                            });
                        }

                        if (true) {
                            listPage.push({
                                name: t('label.statistique'),
                                handleClick: () => {
                                    alert("Fonctionnalité pas encore disponible")
                                },
                            });
                        }

                        return listPage.length > 0 ? (
                            <SelectButton listPage={listPage} />
                        ) : null;
                    })()}
                    
                    <ButtonCrudTable
                        onClickEdit={
                            (true)
                                ? () => {
                                    onEdit(item);
                                    dispatch(setShowModal());
                                }
                                : undefined
                        }
                        onClickDelete={
                            (true)
                                ? () => {
                                    onEdit(item);
                                    dispatch(setShowModalDelete());
                                }
                                : undefined
                        }
                    />
                </td>

            </tr>
        ))}
    </tbody>
}

export default BodyTable