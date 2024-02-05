import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';



function ModalDeleteEtudiant({ etudiant }: { etudiant : Etudiant|null}) {
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
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>Supprimez l'étudiant : {etudiant?etudiant.nom:""} {etudiant?etudiant.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEtudiant



