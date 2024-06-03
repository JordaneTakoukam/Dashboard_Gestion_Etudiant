import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { setEnseignantsLoading, setEnseignant, setErrorPageEnseignant } from '../../../_redux/features/enseignant_slice';
import { apiGetEnseignantsByNomPrenom } from '../../../api/other_users/api_enseignant';
import createToast from '../../../hooks/toastify';
import { ajouterEnseignement, modifierEnseignement } from '../../../_redux/features/matiere_slice';
import { apiUpdateMatiere } from '../../../api/api_matiere';



function ModalCreateUpdate({ enseignement, matiere }: { enseignement: string | null, matiere:MatiereType|null|undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    
    
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [errorEnseignantPrincipal, setErrorEnseignantPrincipal] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    // const { data: { enseignants } } = useSelector((state: RootState) => state.enseignantSlice);
    // useEffect(() => {
    //     const fetchEnseignants = async () => {
    //         dispatch(setEnseignantsLoading(true)); // Définissez le loading à true avant le chargement
    //         try {
    //             // Initialisation de currentCycleId et currentNiveauId
               
    //             const emptyEnseignants : EnseignantListGetType={
    //                 enseignants: [],
    //                 currentPage: 0,
    //                 totalItems: 0,
    //                 totalPages: 0,
    //                 pageSize: 0
    //             }
    //             const fetchedEnseignants = await apiGetEnseignantsByNomPrenom();
    //             if (fetchedEnseignants) { // Vérifiez si fetchedEnseignants n'est pas faux, vide ou indéfini
    //                 dispatch(setEnseignant(fetchedEnseignants));
    //                 console.log(enseignants);
    //             } else {
    //                 dispatch(setEnseignant(emptyEnseignants));
    //             }
    //         } catch (error) {
    //             dispatch(setErrorPageEnseignant(t('message.erreur')));
    //             createToast(t('message.erreur'), "", 2)
    //         } finally {
    //             dispatch(setEnseignantsLoading(false)); // Définissez le loading à false après le chargement
    //         }
    //     };

    //     fetchEnseignants();
    // }, [dispatch, t]);
    
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
            // setErrorEnseignantPrincipal("");
            setIsFirstRender(false);
            
        }
    }, [enseignement,  isFirstRender, t]);

    const closeModal = () => {
        setErrorTypeEnseignement("");
        setErrorEnseignantPrincipal("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    
    

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!typeEnseignement ) {
            if (!typeEnseignement) {
                setErrorTypeEnseignement(t('error.type_ens'));
            }
            // if (!enseignantPrincipal) {
            //     setErrorEnseignantPrincipal(t('error.enseignant'));
            // }

            return;
        }
        if (matiere) {
            var saveEnseignement:string= typeEnseignement._id || "";
            
            // if(enseignement){
            //     saveEnseignement=enseignement;
            // }

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
            })
        }
    };

    const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const selectedTypeEnseignement = typesEnseignement.find(typeEnseignement => typeEnseignement.code === selectedCode);
        if (selectedTypeEnseignement) {
            setTypeEnseignement(selectedTypeEnseignement);
            setErrorTypeEnseignement("");
        }
    };

    // const handleEnseignantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedId = e.target.value;
    //     const selectedEnseignant = enseignants.find(enseignant => enseignant._id === selectedId);
    //     if (selectedEnseignant) {
    //         // setEnseignantPrincipal(selectedEnseignant);
    //         setErrorEnseignantPrincipal("");
    //     }
    // };

    // const handleEnseignantSupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedId = e.target.value;
    //     const selectedEnseignant = enseignants.find(enseignant => enseignant._id === selectedId);
    //     if (selectedEnseignant) {
    //         // setEnseignantSuppleant(selectedEnseignant);
    //     }
    // };



    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
                {!enseignement && <select
                    value={typeEnseignement ? lang==='fr'?typeEnseignement?.libelleFr??"":typeEnseignement?.libelleEn??"" : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                    {typesEnseignement.filter(type => matiere && matiere.typesEnseignement && !matiere.typesEnseignement.some(enseignement => enseignement === type._id))
                                    .map(typeEnseignement => (
                                        <option key={typeEnseignement._id} value={typeEnseignement.code}>{lang==='fr'?typeEnseignement.libelleFr:typeEnseignement.libelleEn}</option>
                    ))}
                </select>}
                {enseignement && <select
                    value={typeEnseignement ? typeEnseignement.code : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                    {enseignement && ( // Vérifie si une matière est déjà sélectionnée dans l'enseignement
                        <option key={enseignement} value={typeEnseignement?.code??""}>
                            {lang==='fr'?typeEnseignement?.libelleFr??"":typeEnseignement?.libelleEn??""}
                        </option>
                    )}
                    {typesEnseignement.filter(type => matiere && matiere.typesEnseignement && !matiere.typesEnseignement.some(enseignement => enseignement === type._id))
                                    .map(typeEnseignement => (
                                        <option key={typeEnseignement._id} value={typeEnseignement.code}>{lang==='fr'?typeEnseignement.libelleFr:typeEnseignement.libelleEn}</option>
                    ))}
                </select>}
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
                {/* <label>{t('label.enseignant')}</label><label className="text-red-500"> *</label>
                <select
                    value={enseignantPrincipal ? enseignantPrincipal._id : t('select_par_defaut.selectionnez') + t('select_par_defaut.enseignant')}
                    onChange={handleEnseignantChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.enseignant')}</option>
                    {enseignants.map(enseignant => (
                        <option key={enseignant._id} value={enseignant._id}>{enseignant.nom+" "+enseignant.prenom}</option>
                    ))}
                </select>
                {errorEnseignantPrincipal && <p className="text-red-500">{errorEnseignantPrincipal}</p>}
                <label>{t('label.enseignant_sup')}</label>
                <select
                    value={enseignantSuppleant ? enseignantSuppleant._id : t('select_par_defaut.selectionnez') + t('select_par_defaut.enseignant')}
                    onChange={handleEnseignantSupChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.enseignant')}</option>
                    {enseignants.map(enseignant => (
                        <option key={enseignant._id} value={enseignant._id}>{enseignant.nom+" "+enseignant.prenom}</option>
                    ))}
                </select> */}
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
