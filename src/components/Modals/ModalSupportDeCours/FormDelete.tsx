import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { deleteSupportDeCours } from '../../../_redux/features/support_cours_slice';
import { apiDeleteSupportDeCours } from '../../../api/api_support_cours';



function ModalDeleteSupportDeCours({ supportDeCours }: { supportDeCours : SupportDeCoursType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (supportDeCours?._id != undefined) {
            await apiDeleteSupportDeCours(supportDeCours._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (supportDeCours._id) {
                        dispatch(deleteSupportDeCours({ id: supportDeCours._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e: { response: { data: { message: { [x: string]: string; }; }; }; }) => {
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
                <h1>{t('form_delete.suppression')+t('form_delete.support_de_cours')} : {supportDeCours?lang==='fr'?supportDeCours.titre_fr:supportDeCours.titre_en:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteSupportDeCours



