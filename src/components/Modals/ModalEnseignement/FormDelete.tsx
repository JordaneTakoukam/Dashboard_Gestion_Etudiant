import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { retirerEnseignement } from '../../../_redux/features/periode_enseignement_slice';
import { apiUpdatePeriodeEnseignement } from '../../../api/api_periode_enseignement';
import createToast from '../../../hooks/toastify';
import { useState } from 'react';



function ModalDelete({ enseignement, periodeEnseignement }: { enseignement : MatiereEnseignement|null, periodeEnseignement:PeriodeEnseignementType | null | undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const handleDelete = async () => {
        
        if (periodeEnseignement) {
            setIsLoading(true)
            var newEnseignements: MatiereEnseignement[] = [];
            for (let i = 0;periodeEnseignement.enseignements &&  i < ( periodeEnseignement.enseignements ? periodeEnseignement.enseignements.length : 0); i++) {
                const ens = periodeEnseignement.enseignements[i];
                if(ens._id !== enseignement?._id){
                    newEnseignements.push(ens);
                }
                
            }
        
            await apiUpdatePeriodeEnseignement(
                {
                    semestre : periodeEnseignement.semestre,
                    annee : periodeEnseignement.annee,
                    periodeFr : periodeEnseignement.periodeFr,
                    periodeEn : periodeEnseignement.periodeEn,
                    dateDebut : periodeEnseignement.dateDebut,
                    dateFin : periodeEnseignement.dateFin,
                    niveau:periodeEnseignement.niveau,
                    enseignements:newEnseignements,
                    _id:periodeEnseignement._id
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(enseignement && enseignement._id){
                        dispatch(retirerEnseignement({enseignementId:enseignement._id}))
                    }
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    // dispatch(
                    //     updatePeriodeEnseignement({
                    //         id: e.data._id,
                    //         periodeData: {
                    //             _id: e.data._id,
                    //             annee: e.data.annee,
                    //             semestre: e.data.semestre,
                    //             niveau: e.data.niveau,
                    //             periodeFr: e.data.periodeFr,
                    //             periodeEn: e.data.periodeEn,
                    //             dateDebut: e.data.dateDebut,
                    //             dateFin: e.data.dateFin,
                    //             enseignements: newEnseignements
                    //         }
                    //     }));
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
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
                isLoading={isLoading}
            >
                <div></div>
                {/* <h1>{t('form_delete.suppression')+t('form_delete.enseignement')} : {enseignement?(typesEnseignement.find(type=>type._id===enseignement)?.code)+" "+enseignement.matiere.code:""}</h1> */}
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



