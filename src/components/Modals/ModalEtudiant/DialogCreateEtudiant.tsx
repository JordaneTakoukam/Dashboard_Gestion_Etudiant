import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCreate, setShowModalUpdate } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';


function ModalCreateEtudiant()  {
    const dispatch = useDispatch();
    const etudiant = undefined; //initialisé la valeur de etudiant avec {} pour voir comment fonctionne la modification
    const isModalOpen = !etudiant?useSelector((state: RootState) => state.setting.showModal.create):useSelector((state: RootState) => state.setting.showModal.update);
    // const closeModal = () => { dispatch(setShowModalCreate()); };
    const closeModal = () => { !etudiant?dispatch(setShowModalCreate()):dispatch(setShowModalUpdate()); };
    

    const handleCreateEtudiant = () => {
        
        console.log("student add");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title = {!etudiant?"Enregistrer un nouvel étudiant":"Mettre à jour les informations étudiant"}
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



