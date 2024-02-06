import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Evenement } from '../../../pages/CommonPage/CalendrierAcademique';



function ModalDelete({ evenement }: { evenement : Evenement|null}) {
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleDelete = () => {
        console.log("delete ok");
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title="Supprimer un évènement"
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>Supprimez l'évènement : {evenement?evenement.libelle:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



