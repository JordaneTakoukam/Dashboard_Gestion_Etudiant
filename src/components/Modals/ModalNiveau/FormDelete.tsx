import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { deleteSettingItem } from '../../../_redux/features/data_setting_slice';
import { ReponseApiPros } from '../../../api/interface_reponse';
import { apiDeleteNiveau } from '../../../api/settings/api_niveau';
import createToast from '../../../hooks/toastify';



function ModalDelete({ niveau }: { niveau : NiveauProps|null}) {
    const dispatch = useDispatch();
    const {t}=useTranslation();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (niveau?._id != undefined) {
            await apiDeleteNiveau(niveau._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (niveau._id) {
                        dispatch(deleteSettingItem({ tableName: 'niveau', itemId: niveau._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.niveau')} : {niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



