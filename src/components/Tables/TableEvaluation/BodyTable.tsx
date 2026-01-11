//src/components/Tables/TableEvaluation/BodyTable.tsx

import { useDispatch, useSelector } from "react-redux";
import ButtonCrudTable from "../common/ButtonActionTable";
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setEvaluationSelected } from "../../../_redux/features/evaluation_slice";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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
            'CONTROLE_CONTINU': t('evaluation.type.controle_continu'),
            'EXAMEN_PARTIEL': t('evaluation.type.examen_partiel'),
            'EXAMEN_FINAL': t('evaluation.type.examen_final'),
            'SESSION_RATTRAPAGE': t('evaluation.type.session_rattrapage'),
            'AUTRE': t('evaluation.type.autre')
        };
        return types[type] || type;
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
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
                            {t(`evaluation.statut.${item.statut.toLowerCase()}`)}
                        </span>
                    </td>

                    {/* Anonymats */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden lg:table-cell">
                        {item.anonymatsGeneres ? (
                            <FaCheckCircle className="text-green-500 text-xl" />
                        ) : (
                            <FaTimesCircle className="text-red-500 text-xl" />
                        )}
                    </td>

                    {/* Actions */}
                    <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark flex justify-center items-center">
                        <ButtonCrudTable
                            onClickEdit={
                                hasManageEvaluationPermission && item.statut === 'BROUILLON'
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
                            // onClickView={() => {
                            //     dispatch(setEvaluationSelected(item));
                            //     navigate('/evaluations/details');
                            // }}
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default BodyTable;