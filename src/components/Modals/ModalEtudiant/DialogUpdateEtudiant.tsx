import { useDispatch, useSelector } from 'react-redux';
import { setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';



function ModalUpdateEtudiant() {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.update);
    const closeModal = () => { dispatch(setShowModalUpdate()); };


    const handleCreateEtudiant = () => {
        console.log("student update");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title="Mettre à jour les informations étudiant"
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>Contenu</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalUpdateEtudiant



