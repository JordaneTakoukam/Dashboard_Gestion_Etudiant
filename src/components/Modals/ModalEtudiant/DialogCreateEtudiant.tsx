import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCreate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';



function ModalCreateEtudiant() {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.create);
    const closeModal = () => { dispatch(setShowModalCreate()); };


    const handleCreateEtudiant = () => {
        console.log("student add");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title="Enregistrer un nouvel étudiant"
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>Contenu</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateEtudiant



