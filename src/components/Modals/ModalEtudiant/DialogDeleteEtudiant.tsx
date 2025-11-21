import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteEtudiant } from '../../../api/other_users/api_etudiant';
import createToast from '../../../hooks/toastify';
import { deleteEtudiant } from '../../../_redux/features/etudiant_slice';
import { useState } from 'react';



function ModalDeleteEtudiant({ etudiant }: { etudiant : EtudiantType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleDelete = async () => {
        if (etudiant?._id != undefined) {
            setIsLoading(true);
            await apiDeleteEtudiant(etudiant._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (etudiant._id) {
                        dispatch(deleteEtudiant({ id: etudiant._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

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
                <h1>{t('form_delete.suppression')+t('form_delete.etudiant')} : {etudiant?etudiant.nom:""} {etudiant?etudiant.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEtudiant



