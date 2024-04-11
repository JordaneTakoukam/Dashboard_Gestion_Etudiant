import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import {apiUpdateChapitre } from '../../../api/api_chapitre';
import createToast from '../../../hooks/toastify';



function ModalDelete({ objectif, chapitre }: {objectif:ObjectifType | null, chapitre : ChapitreType|null|undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();

    const handleDelete = async () => {
        if(objectif && objectif._id){
    
            if (objectif._id) {
                if(chapitre && chapitre._id){
                    var newObjectifs:ObjectifType[] = [];
                    for (let i = 0; chapitre.objectifs && i < chapitre.objectifs.length; i++) {
                        
                        const obj = chapitre.objectifs[i];
                        if(obj._id !== objectif._id){
                            newObjectifs.push(obj)
                        }
                        
                    }

                    await apiUpdateChapitre(
                        {
                            _id:chapitre._id, 
                            code:chapitre.code, 
                            libelleFr:chapitre.libelleFr, 
                            libelleEn:chapitre.libelleEn, 
                            matiere:chapitre.matiere,
                            typesEnseignement:chapitre.typesEnseignement,
                            objectifs:newObjectifs,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            closeModal();
    
                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);
    
                        }
                    }).catch((e) => {
                        console.log(e);
                        createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                    })
                }
                }
            }
    
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
                <h1>{t('form_delete.suppression')+t('form_delete.objectif')} : {objectif? lang === 'fr' ? objectif.libelleFr: objectif.libelleEn:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



