import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Administrateur } from '../../../pages/Admin/ListeAdministrateurs';
import { useTranslation } from 'react-i18next';



function ModalDeleteAdministrateur({ administrateur }: { administrateur : Administrateur|null}) {
    const {t}=useTranslation();
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
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateAdministrateur}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.administrateur')} : {administrateur?administrateur.nom:""} {administrateur?administrateur.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteAdministrateur



