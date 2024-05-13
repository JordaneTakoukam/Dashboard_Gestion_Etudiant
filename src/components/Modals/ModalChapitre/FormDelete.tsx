import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteChapitre } from '../../../api/api_chapitre';
import createToast from '../../../hooks/toastify';
import { deleteChapitre } from '../../../_redux/features/chapitre_slice';
import { retirerChapitre, updateChapitres } from '../../../_redux/features/matiere_slice';



function ModalDelete({ chapitre, matiere }: { chapitre : ChapitreType|null, matiere:MatiereType | null|undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();

    const handleDelete = async () => {
        if(chapitre && chapitre._id){
            await apiDeleteChapitre(chapitre._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(chapitre._id){
                        dispatch(retirerChapitre({chapitreId:chapitre._id}))
                    }
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
    
            })
        }
        
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
                <h1>{t('form_delete.suppression')+t('form_delete.chapitre')} : {chapitre? lang === 'fr' ? chapitre.libelleFr: chapitre.libelleEn:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



