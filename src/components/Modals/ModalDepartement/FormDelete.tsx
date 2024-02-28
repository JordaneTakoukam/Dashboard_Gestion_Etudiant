import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { Departement } from '../../../pages/Admin/Departements';
import { useTranslation } from 'react-i18next';



function ModalDelete({ departement }: { departement : Departement|null}) {
    const dispatch = useDispatch();
    const {t}=useTranslation();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleDelete = () => {
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
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.departement')} : {departement?departement.libelle:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



