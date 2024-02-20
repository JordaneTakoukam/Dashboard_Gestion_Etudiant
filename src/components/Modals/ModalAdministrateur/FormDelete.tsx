import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Administrateur } from '../../../pages/Admin/ListeAdministrateurs';



function ModalDeleteAdministrateur({ administrateur }: { administrateur : Administrateur|null}) {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleCreateAdministrateur = () => {
        console.log("delete ok");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title="Supprimer un administrateur"
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateAdministrateur}
            >
                <h1>Supprimez l'administrateur : {administrateur?administrateur.nom:""} {administrateur?administrateur.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteAdministrateur



