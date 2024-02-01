import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';



function ModalDeleteEtudiant() {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleCreateEtudiant = () => {
        console.log("delete ok");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title="Supprimer un étudiant"
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>Contenu</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEtudiant



