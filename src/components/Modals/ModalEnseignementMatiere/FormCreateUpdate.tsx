import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import {  modifierEnseignement } from '../../../_redux/features/matiere_slice';
import { apiUpdateMatiere } from '../../../api/api_matiere';



function ModalCreateUpdate({ enseignement, matiere }: { enseignement: string | null, matiere:MatiereType|null|undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
   
    
    useEffect(() => {
        if (enseignement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.type_ens'));
            const typeEns = typesEnseignement.find(typeEns => typeEns._id === enseignement);
            setTypeEnseignement(typeEns);
        
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.type_ens'));
            setTypeEnseignement(undefined);
        }
        if (isFirstRender) {
            setErrorTypeEnseignement("");
            setIsFirstRender(false);
            
        }
    }, [enseignement,  isFirstRender, t]);

    const closeModal = () => {
        setErrorTypeEnseignement("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    
    

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!typeEnseignement ) {
            if (!typeEnseignement) {
                setErrorTypeEnseignement(t('error.type_ens'));
            }
            

            return;
        }
        if (matiere) {
            var saveEnseignement:string= typeEnseignement._id || "";
            
           
        
            var newEnseignements:string[] = [];
            for (let i = 0; matiere.typesEnseignement && i < matiere.typesEnseignement.length; i++) {
                const enseignement = matiere.typesEnseignement[i];
                newEnseignements.push(enseignement)
            }
            const index = newEnseignements.findIndex((obj) => obj=== enseignement);
            if (index !== -1) {
                newEnseignements[index] = saveEnseignement;
            }else{
                newEnseignements.push(saveEnseignement);
            }
            setIsLoading(true);
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
                    console.log(e.data)
                    // if(!enseignement){
                    //     dispatch(ajouterEnseignement({...e.data}))
                    // }else{
                    dispatch(modifierEnseignement({...e.data}))
                    // }
                    
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false)
            })
        }
    };

    const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLibelle = e.target.value;
        const selectedTypeEnseignement = typesEnseignement.find(typeEnseignement => lang==='fr'?typeEnseignement.libelleFr === selectedLibelle:typeEnseignement.libelleEn === selectedLibelle);
        if (selectedTypeEnseignement) {
            setTypeEnseignement(selectedTypeEnseignement);
            setErrorTypeEnseignement("");
        }
    };



    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
               <select
                    value={typeEnseignement ? (lang === 'fr' ? typeEnseignement?.libelleFr ?? "" : typeEnseignement?.libelleEn ?? "") : ""}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                    
                    {/* Afficher l'option sélectionnée si elle existe */}
                    {typeEnseignement && enseignement && (
                        <option key={typeEnseignement._id} value={lang === 'fr' ? typeEnseignement?.libelleFr ?? "" : typeEnseignement?.libelleEn ?? ""}>
                            {lang === 'fr' ? typeEnseignement.libelleFr : typeEnseignement.libelleEn}
                        </option>
                    )}
                    
                    {/* Afficher les autres options non sélectionnées */}
                    {typesEnseignement
                        .filter(type => 
                            matiere && 
                            matiere.typesEnseignement && 
                            !matiere.typesEnseignement.some(ens => ens === type._id) &&
                            type._id !== enseignement // Exclure l'option déjà sélectionnée pour éviter les doublons
                        )
                        .map(typeEns => (
                            <option key={typeEns._id} value={lang === 'fr' ? typeEns?.libelleFr ?? "" : typeEns?.libelleEn ?? ""}>
                                {lang === 'fr' ? typeEns.libelleFr : typeEns.libelleEn}
                            </option>
                        ))
                    }
                </select>
                
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
                
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
