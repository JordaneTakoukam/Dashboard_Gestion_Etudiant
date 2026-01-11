//src/components/Modals/ModalEvaluation/FormDelete.tsx

import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiDeleteEvaluation } from '../../../api/api_evaluation';
import createToast from '../../../hooks/toastify';
import { deleteEvaluation } from '../../../_redux/features/evaluation_slice';

function FormDelete({ evaluation }: { evaluation: EvaluationType | null }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);

    const closeModal = () => {
        dispatch(setShowModalDelete());
    };

    const handleDelete = async () => {
        if (!evaluation || !evaluation._id) return;

        setIsLoading(true);
        try {
            const response = await apiDeleteEvaluation(evaluation._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                dispatch(deleteEvaluation({ id: evaluation._id }));
                closeModal();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CustomDialogModal
            title={t('form_delete.supprimer') + ' ' + t('form_delete.evaluation')}
            isModalOpen={isModalOpen}
            isDelete={true}
            closeModal={closeModal}
            handleConfirm={handleDelete}
            isLoading={isLoading}
        >
            <p>{t('form_delete.confirmation_message')}</p>
            {evaluation && (
                <p className="font-bold mt-2">
                    {lang === 'fr' ? evaluation.libelleFr : evaluation.libelleEn}
                </p>
            )}
        </CustomDialogModal>
    );
}

export default FormDelete;