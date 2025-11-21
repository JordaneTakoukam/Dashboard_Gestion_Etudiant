import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteCycle } from '../../../api/settings/api_cycle';
import { deleteSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';
import { useState } from 'react';



function ModalDelete({ cycle }: { cycle: CycleProps | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (cycle?._id != undefined) {
            setIsLoading(true);
            await apiDeleteCycle(cycle._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    try { createToast(e.message[lang as keyof typeof e.message], '', 0); }
                    catch (e) { throw e; }
                    if (cycle._id) {
                        dispatch(deleteSettingItem({ tableName: 'cycles', itemId: cycle._id }));
                    }

                    closeModal();
                } else {
                    try { createToast(e.message[lang as keyof typeof e.message], '', 2); }
                    catch (e) { throw e; }
                }
            }).catch((e) => {
                try { createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2); }
                catch (e) { throw e; }
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
                isLoading={isLoading}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.cycle')} : {cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



