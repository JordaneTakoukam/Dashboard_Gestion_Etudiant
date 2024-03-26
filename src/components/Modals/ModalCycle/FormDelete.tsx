import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteCycle } from '../../../api/settings/api_cycle';
import { ReponseApiPros } from '../../../api/interface_reponse';
import { deleteSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';



function ModalDelete({ cycle }: { cycle: CycleProps | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);

    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (cycle?._id != undefined) {
            await apiDeleteCycle(cycle._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (cycle._id) {
                        dispatch(deleteSettingItem({ tableName: 'cycle', itemId: cycle._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

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
            >
                <h1>{t('form_delete.suppression') + t('form_delete.cycle')} : {cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



