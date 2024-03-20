import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Rubrique } from '../../../pages/Admin/Rubriques';



function ModalDelete({ rubrique }: { rubrique : Rubrique|null}) {
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
                title="Supprimer une rubrique"
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>Supprimez la rubrique : {rubrique?rubrique.libelle:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



