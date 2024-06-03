import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { retirerEnseignement } from '../../../_redux/features/matiere_slice';
import { apiUpdateMatiere } from '../../../api/api_matiere';
import createToast from '../../../hooks/toastify';



function ModalDelete({ enseignement, matiere }: { enseignement : string|null, matiere:MatiereType|null|undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    
    const handleDelete = async () => {
        
        if(matiere && matiere._id && enseignement){
            var newEnseignements:string[] = [];
            for (let i = 0; matiere.typesEnseignement && i < matiere.typesEnseignement.length; i++) {
                
                const ens = matiere.typesEnseignement[i];
                if(ens !== enseignement){
                    newEnseignements.push(ens)
                }
                
            }

            await apiUpdateMatiere(
                {
                    code:matiere.code,
                    libelleFr:matiere.libelleFr,
                    libelleEn:matiere.libelleEn,
                    prerequisFr:matiere.prerequisFr, 
                    prerequisEn:matiere.prerequisEn, 
                    approchePedFr:matiere.approchePedFr, 
                    approchePedEn:matiere.approchePedEn, 
                    evaluationAcquisFr:matiere.evaluationAcquisFr, 
                    evaluationAcquisEn:matiere.evaluationAcquisEn,
                    typesEnseignement:newEnseignements,
                    chapitres:matiere.chapitres,
                    objectifs:matiere.objectifs,
                    _id:matiere._id,
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(enseignement){
                        dispatch(retirerEnseignement({enseignementId:enseignement}))
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
    useEffect(()=>{
        if(enseignement){
            const typeEns = typesEnseignement.find(typeEns => typeEns._id === enseignement);
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
                <h1>{t('form_delete.suppression')+t('form_delete.type_ens')} : {typeEnseignement?.code}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



