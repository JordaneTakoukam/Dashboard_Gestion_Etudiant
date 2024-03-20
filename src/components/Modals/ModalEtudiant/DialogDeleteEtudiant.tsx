import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';
import { useTranslation } from 'react-i18next';



function ModalDeleteEtudiant({ etudiant }: { etudiant : Etudiant|null}) {
    const {t}=useTranslation();
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
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleCreateEtudiant}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.etudiant')} : {etudiant?etudiant.nom:""} {etudiant?etudiant.prenom:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDeleteEtudiant



