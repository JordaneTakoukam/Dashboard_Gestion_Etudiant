import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';



function ModalDeleteEnseignant({ enseignant }: { enseignant: EnseignantType | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleCreateEnseignant = () => {
        console.log("delete ok");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateEnseignant}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.enseignant')} : {enseignant ? enseignant.nom : ""} {enseignant ? enseignant.prenom : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEnseignant



