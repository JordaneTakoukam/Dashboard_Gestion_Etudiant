import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { deleteDevoir } from '../../../_redux/features/devoir_slice';
import { apiDeleteDevoir } from '../../../api/api_devoir';
import createToast from '../../../hooks/toastify';



function ModalDelete({ devoir }: { devoir : DevoirType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleDelete = async () => {
        if (devoir?._id != undefined) {
            await apiDeleteDevoir(devoir._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (devoir._id) {
                        dispatch(deleteDevoir({ id: devoir._id }));
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
                <h1>{t('form_delete.suppression')+t('form_delete.devoir')} : {devoir ? (lang === 'fr' ? devoir.titre_fr : devoir.titre_en) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



