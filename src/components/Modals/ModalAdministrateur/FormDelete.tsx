import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteAdministrateur } from '../../../api/other_users/api_administrateur';
import createToast from '../../../hooks/toastify';
import { deleteAdmin } from '../../../_redux/features/admin_slice';



function ModalDeleteAdministrateur({ administrateur }: { administrateur: AdminType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDeleteAdministrateur = async () => {
        if (administrateur?._id != null) {
            await apiDeleteAdministrateur(administrateur._id)
                .then((reponse: ReponseApiPros) => {
                    if (reponse.success) {
                        createToast(reponse.message[lang as keyof typeof reponse.message], '', 0);

                        if (administrateur._id) {
                            dispatch(deleteAdmin({ id: administrateur._id }));
                        }
                        closeModal();
                    } else {
                        createToast(reponse.message[lang as keyof typeof reponse.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
        } else {
            createToast('Incorrect id', '', 2);

        }
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDeleteAdministrateur}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.administrateur')} : {administrateur ? administrateur.nom : ""} {administrateur ? administrateur.prenom : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteAdministrateur



