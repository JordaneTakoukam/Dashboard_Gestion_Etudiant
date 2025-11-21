import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteEnseignant } from '../../../api/other_users/api_enseignant';
import createToast from '../../../hooks/toastify';
import { deleteEnseignant } from '../../../_redux/features/enseignant_slice';
import { useState } from 'react';



function ModalDeleteEnseignant({ enseignant }: { enseignant : EnseignantType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (enseignant?._id != undefined) {
            setIsLoading(true)
            await apiDeleteEnseignant(enseignant._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (enseignant._id) {
                        dispatch(deleteEnseignant({ id: enseignant._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

            }).finally(() => {
                setIsLoading(false)
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
                <h1>{t('form_delete.suppression')+t('form_delete.enseignant')} : {enseignant?enseignant.nom:""} {enseignant?enseignant.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEnseignant



