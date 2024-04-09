import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';



function ModalDelete({ enseignement }: { enseignement : EnseignementType|null}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    
    const handleDelete = () => {
        console.log("delete ok");
        closeModal();
    }
    useEffect(()=>{
        if(enseignement){
            const typeEns = typesEnseignement.find(typeEns => typeEns._id === enseignement.typeEnseignement);
            setTypeEnseignement(typeEns);
        }
    }, [typesEnseignement, enseignement, t])
    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.enseignement')} : {typeEnseignement?.code}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



