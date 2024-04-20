import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import {apiUpdateChapitre } from '../../../api/api_chapitre';
import createToast from '../../../hooks/toastify';
import { updateMatiere } from '../../../_redux/features/matiere_slice';



function ModalDelete({ objectif, chapitre, matiere }: {objectif:ObjectifType | null, chapitre : ChapitreType|null|undefined,  matiere:MatiereType | undefined | null}) {
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
                            const chap= {
                                _id: e.data._id,
                                code: e.data.code, 
                                libelleFr: e.data.libelleFr, 
                                libelleEn: e.data.libelleEn, 
                                typesEnseignement:chapitre.typesEnseignement, 
                                matiere:e.data.matiere, 
                                objectifs:e.data.objectifs,
                            }
    
                            const newChapitres:ChapitreType[] = [];
                            if(matiere){
                                for (let i = 0; matiere.chapitres && i < matiere.chapitres.length; i++) {
                                    const chap = matiere.chapitres[i];
                                    // if(chapitre._id!==chap._id){
                                    newChapitres.push(chap)
                                    // }
                                }
                                const index = newChapitres.findIndex(e => e._id === chapitre._id);
                                if (index !== -1) {
                                    newChapitres[index]=chap;
                                }
                            }
                            
                            if(matiere && matiere._id){    
                                dispatch(updateMatiere({
                                    id: matiere._id,
                                    matiereData: {
                                        _id: matiere._id,
                                        code:matiere.code,
                                        libelleFr:matiere.libelleFr,
                                        libelleEn:matiere.libelleEn,
                                        niveau:matiere.niveau, 
                                        prerequisFr:matiere.prerequisFr, 
                                        prerequisEn:matiere.prerequisEn, 
                                        approchePedFr:matiere.approchePedFr, 
                                        approchePedEn:matiere.approchePedEn, 
                                        evaluationAcquisFr:matiere.evaluationAcquisFr, 
                                        evaluationAcquisEn:matiere.evaluationAcquisEn,
                                        typesEnseignement:matiere.typesEnseignement,
                                        chapitres:newChapitres,
        
                                    }
                                }));
                            }
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



