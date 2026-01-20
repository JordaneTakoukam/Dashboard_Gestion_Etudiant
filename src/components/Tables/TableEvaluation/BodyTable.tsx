//src/components/Tables/TableEvaluation/BodyTable.tsx

import { useDispatch, useSelector } from "react-redux";
import ButtonCrudTable from "../common/ButtonActionTable";
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setEvaluationSelected } from "../../../_redux/features/evaluation_slice";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { SelectButton } from "../common/composants/SelectButton";
import { config } from "../../../config";

interface BodyEvaluationProps {
    data: EvaluationType[];
    onEdit: (evaluation: EvaluationType) => void;
}

const BodyTable = ({ data, onEdit }: BodyEvaluationProps) => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageEvaluationPermission = userPermissions.includes('gerer_evaluations');
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    const isStudent = currentUser.role === roles.etudiant || currentUser.role === roles.delegue;
    const isTeacher = currentUser.role === roles.enseignant;
    const isAdmin = currentUser.role === roles.admin || currentUser.role === roles.superAdmin;

    const getStatutBadge = (statut: string) => {
        const badges = {
            'BROUILLON': 'bg-gray-500',
            'PROGRAMMEE': 'bg-blue-500',
            'EN_COURS': 'bg-yellow-500',
            'CORRECTION': 'bg-orange-500',
            'DELIBERATION': 'bg-purple-500',
            'PUBLIEE': 'bg-green-500',
            'VERROUILEE': 'bg-red-500'
        };
        return badges[statut as keyof typeof badges] || 'bg-gray-500';
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'CONTROLE_CONTINU': t('label.controle_continu'),
            'EXAMEN_PARTIEL': t('label.examen_partiel'),
            'EXAMEN_FINAL': t('label.examen_final'),
            'SESSION_RATTRAPAGE': t('label.session_rattrapage'),
            'AUTRE': t('label.autre')
        };
        return types[type] || type;
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    };

    const getMenuPages = (item: EvaluationType) => {
        const pages = [];

        // Admin uniquement
        if (isAdmin) {
            pages.push({
                name: t('sub_menu.coefficients'),
                handleClick: () => {
                    dispatch(setEvaluationSelected(item));
                    navigate('/evaluations/coefficients');
                }
            });

            pages.push({
                name: t('sub_menu.gestion_anonymats'),
                handleClick: () => {
                    dispatch(setEvaluationSelected(item));
                    navigate('/evaluations/anonymats');
                }
            });
        }

        // Admin ou Enseignant
        if (isAdmin || isTeacher) {
            pages.push({
                name: t('sub_menu.gestion_notes'),
                handleClick: () => {
                    dispatch(setEvaluationSelected(item));
                    navigate('/evaluations/saisie-notes');
                }
            });
        }


        if (isAdmin) {
            pages.push({
                name: t('sub_menu.coefficient_discipline'),
                handleClick: () => {
                    dispatch(setEvaluationSelected(item));
                    navigate('/evaluations/coefficient-discipline');
                }
            });
        }

        if (isAdmin) {
            pages.push({
                name: t('sub_menu.gestion_discipline'),
                handleClick: () => {
                    dispatch(setEvaluationSelected(item));
                    navigate('/evaluations/discipline');
                }
            });
        }

        // Tout le monde (Admin, Enseignant, Étudiant)
        pages.push({
            name: t('sub_menu.resultats_evaluations'),
            handleClick: () => {
                dispatch(setEvaluationSelected(item));
                navigate('/evaluations/resultats');
            }
        });

        return pages;
    };

    return (
        <tbody>
            {data.map((item, index) => (
                <tr key={item._id || index} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    {/* Index */}
                    <td className="border-b border-[#eee] py-3 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                        <h5>{index + 1}</h5>
                    </td>

                    {/* Libellé */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <h5>{lang === 'fr' ? item.libelleFr : item.libelleEn}</h5>
                    </td>

                    {/* Type */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark hidden md:table-cell">
                        <h5>{getTypeLabel(item.type)}</h5>
                    </td>

                    {/* Date épreuve */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <h5>{formatDate(item.dateEpreuve)}</h5>
                    </td>

                    {/* Statut */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium text-white ${getStatutBadge(item.statut)}`}>
                            {t(`label.${item.statut.toLowerCase()}`)}
                        </span>
                    </td>

                    {/* Anonymats */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden lg:table-cell">
                        <div className="flex justify-center">
                            {item.anonymatsGeneres ? (
                                <FaCheckCircle className="text-green-500 text-xl" />
                            ) : (
                                <FaTimesCircle className="text-red-500 text-xl" />
                            )}
                        </div>
                    </td>

                    {/* Actions */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                        <div className="flex justify-center items-center gap-2">
                            <ButtonCrudTable
                                onClickEdit={
                                    hasManageEvaluationPermission 
                                        ? () => {
                                            onEdit(item);
                                            dispatch(setShowModal());
                                        }
                                        : undefined
                                }
                                onClickDelete={
                                    hasManageEvaluationPermission && item.statut === 'BROUILLON'
                                        ? () => {
                                            onEdit(item);
                                            dispatch(setShowModalDelete());
                                        }
                                        : undefined
                                }
                            />
                            <SelectButton listPage={getMenuPages(item)} />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;