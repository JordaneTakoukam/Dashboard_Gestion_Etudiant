import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Enseignant } from '../../../pages/Admin/ListeEnseignants';



function ModalDeleteEnseignant({ enseignant }: { enseignant : Enseignant|null}) {
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
                title="Supprimer un enseignant"
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateEnseignant}
            >
                <h1>Supprimez l'enseignant : {enseignant?enseignant.nom:""} {enseignant?enseignant.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEnseignant



