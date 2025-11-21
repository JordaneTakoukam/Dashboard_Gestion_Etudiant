import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiCreateMatiere, apiUpdateMatiere } from '../../../api/api_matiere';
import createToast from '../../../hooks/toastify';
import { createMatiere, setPage, updateMatiere } from '../../../_redux/features/matiere_slice';


function ModalCreateUpdate({ matiere }: { matiere: MatiereType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [prerequisFr, setPrerequisFr] = useState("");
    const [prerequisEn, setPrerequisEn] = useState("");
    const [evaluationAcquisFr, setEvaluationAcquisFr] = useState("");
    const [evaluationAcquisEn, setEvaluationAcquisEn] = useState("");
    const [approchePedFr, setApprochePedFr] = useState("");
    const [approchePedEn, setApprochePedEn] = useState("");
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [enseignements, setEnseignements] = useState<string[] | undefined>([]);
    const [chapitres, setChapitres] = useState<ChapitreType[] | undefined>([]);
    const [objectifs, setObjectifs] = useState<ObjectifType[] | undefined>([]);

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorTypeEns, setErrorTypeEns] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);



    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les cycles en fonction de l'ID de la section
            const result: CycleProps[] = cycles.filter(cycle => "" + cycle.section === sectionId);

            setFilteredCycle(result);
            
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner
    const filterNiveauByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            // Filtrer les cycles en fonction de l'ID de la cycle
            const result: NiveauProps[] = niveaux.filter(niveau => "" + niveau.cycle === cycleId);

            setFilteredNiveau(result);
        }
    };

    // const handleAddEnseignement = () => {
    //     const newEnseignement: EnseignementType = {
    //         typeEnseignement: '',
    //         enseignantPrincipal: undefined,
    //         enseignantSuppleant: undefined,
    //     };
    //     setEnseignements([...enseignements, newEnseignement]);
    // };

    // Fonction pour supprimer un champ d'enseignement
    // const handleRemoveEnseignement = (index: number) => {
    //     const updatedEnseignements = [...enseignements];
    //     updatedEnseignements.splice(index, 1);
    //     setEnseignements(updatedEnseignements);
    // };

    // Fonction pour mettre à jour un champ d'enseignement
    // const handleEnseignementChange = (index: number, type: EnseignementType) => {
    //     setEnseignements(prevState => {
    //         const updatedTypes = [...prevState];
    //         updatedTypes[index] = type;
    //         if(updatedTypes && enseignements[0].enseignantPrincipal){
    //             setErrorTypeEns("");
    //         }
    //         return updatedTypes;
    //     });
    // };
    const [enseignants, setEnseignants] = useState<UserState[]>([]);
    

    // useEffect(() => {
    //     const fetchEnseignants = async () => {
    //         // dispatch(setUserLoading(true)); // Définissez le loading à true avant le chargement
    //         try {
                
    //             const fetchedEnseignants = await getUsersWithRole({ role: "enseignant" });
    //             console.log(fetchedEnseignants.users);
    //             if (fetchedEnseignants) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
    //                 setEnseignants(fetchedEnseignants.users);
    //             } else {
    //                 setEnseignants([]);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
                
    //         }
    //     };

    //     fetchEnseignants();
    // }, []);

    useEffect(() => {
        
        if (matiere) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.matiere'));
            // const currentNiveau = niveaux.find(niveau => niveau._id === "" + matiere.niveau);
            // const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            // const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            // currentSection && filterCycleBySection(currentSection._id);
            // currentCycle && filterNiveauByCycle(currentCycle._id);
            setCode(matiere.code);
            setLibelleFr(matiere.libelleFr);
            setLibelleEn(matiere.libelleEn);
            setPrerequisFr(matiere.prerequisFr ? matiere.prerequisFr : "");
            setPrerequisEn(matiere.prerequisEn ? matiere.prerequisEn : "");
            setEvaluationAcquisFr(matiere.evaluationAcquisFr ? matiere.evaluationAcquisFr : "");
            setEvaluationAcquisEn(matiere.evaluationAcquisEn ? matiere.evaluationAcquisEn : "");
            setApprochePedFr(matiere.approchePedFr ? matiere.approchePedFr : "");
            setApprochePedEn(matiere.approchePedEn ? matiere.approchePedEn : "");
            // setSection(currentSection);
            // setCycle(currentCycle);
            // setNiveau(currentNiveau);
            setChapitres(matiere.chapitres);
            setObjectifs(matiere.objectifs);
            setEnseignements(matiere.typesEnseignement);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.matiere'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setPrerequisFr("");
            setPrerequisEn("");
            setEvaluationAcquisFr("");
            setEvaluationAcquisEn("");
            setApprochePedFr("");
            setApprochePedEn("");
            // setSection(undefined);
            // setCycle(undefined);
            // setNiveau(undefined);
            setChapitres([]);
            setObjectifs([]);
            setEnseignements([]);

        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorTypeEns("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setIsFirstRender(false);
        }
    }, [matiere, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorTypeEns("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        var selectedSection = null;

        if (lang === 'fr') {
            selectedSection = sections.find(section => section.libelleFr === selectedSectionLibelle);

        }
        else {
            selectedSection = sections.find(section => section.libelleEn === selectedSectionLibelle);

        }


        if (selectedSection) {
            setSection(selectedSection);
            filterCycleBySection(selectedSection._id);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        var selectedCycle = null;

        if (lang === 'fr') {
            selectedCycle = cycles.find(cycle => cycle.libelleFr === selectedCycleLibelle);

        }
        else {
            selectedCycle = cycles.find(cycle => cycle.libelleEn === selectedCycleLibelle);

        }


        if (selectedCycle) {
            setCycle(selectedCycle);
            filterNiveauByCycle(selectedCycle._id);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        var selectedNiveau = null;

        if (lang === 'fr') {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleFr === selectedNiveauLibelle);

        }
        else {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleEn === selectedNiveauLibelle);

        }


        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };
    const [enseignantsSuggeres, setEnseignantsSuggeres] = useState<UserState[]>([]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const saisieUtilisateur = e.target.value.toLowerCase(); // Convertir la saisie de l'utilisateur en minuscules pour une comparaison insensible à la casse

        // Filtrer les enseignants en fonction de la saisie de l'utilisateur
        const enseignantsFiltres = enseignants.filter(enseignant => {
            // Assurez-vous de retourner le résultat du test d'inclusion
            return enseignant.nom.toLowerCase().includes(saisieUtilisateur.toLowerCase());
        });
        if(enseignantsFiltres.length>0 && enseignements && enseignements[0]){
            setErrorTypeEns("");
        }
        // Mettre à jour les enseignants suggérés avec les résultats filtrés
        setEnseignantsSuggeres(enseignantsFiltres);
    };


    const handleCreateUpdate = async () => {
        // if (!code || !libelleFr || !libelleEn || !section || !cycle || !niveau) {
        if (!libelleFr || !libelleEn ) {
            // if (!code) {
            //     setErrorCode(t('error.code'));
            // }
            if (!libelleFr) {
                setErrorLibelleFr(t('error._fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error._en'));
            }
            // if (!section) {
            //     setErrorSection(t('error.section'));
            // }
            // if (!cycle) {
            //     setErrorCycle(t('error.cycle'));
            // }
            // if (!niveau) {
            //     setErrorNiveau(t('error.niveau'));
            // }
            return;
        }
        if (!matiere) {
            setIsLoading(true)
            // if (niveau && niveau._id) {
            await apiCreateMatiere(
                {
                    code,
                    libelleFr,
                    libelleEn,
                    // niveau:niveau._id, 
                    prerequisFr, 
                    prerequisEn, 
                    approchePedFr, 
                    approchePedEn, 
                    evaluationAcquisFr, 
                    evaluationAcquisEn,
                    typesEnseignement:enseignements,
                    chapitres,
                    objectifs
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(createMatiere({
                        
                        matiere: {
                            _id: e.data._id,
                            code:e.data.code,
                            libelleFr:e.data.libelleFr,
                            libelleEn:e.data.libelleEn,
                            // niveau:e.data.niveau, 
                            prerequisFr:e.data.prerequisFr, 
                            prerequisEn:e.data.prerequisEn, 
                            approchePedFr:e.data.approchePedFr, 
                            approchePedEn:e.data.approchePedEn, 
                            evaluationAcquisFr:e.data.evaluationAcquisFr, 
                            evaluationAcquisEn:e.data.evaluationAcquisEn,
                            typesEnseignement:e.data.typesEnseignement,
                            chapitres:e.data.chapitres,
                            objectifs:e.data.objectifs
                            
                        }
                        
                    }));
                    // dispatch(setPage());
                    closeModal();

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
            })
            // }
        }else{
            // if (niveau && niveau._id) {
            setIsLoading(true)
            await apiUpdateMatiere(
                {
                    code,
                    libelleFr,
                    libelleEn,
                    // niveau:niveau._id, 
                    prerequisFr, 
                    prerequisEn, 
                    approchePedFr, 
                    approchePedEn, 
                    evaluationAcquisFr, 
                    evaluationAcquisEn,
                    typesEnseignement:matiere.typesEnseignement,
                    chapitres:matiere.chapitres,
                    objectifs:matiere.objectifs,
                    _id:matiere._id,
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(
                        updateMatiere({
                            id: e.data._id,
                            matiereData: {
                                _id: e.data._id,
                                code:e.data.code,
                                libelleFr:e.data.libelleFr,
                                libelleEn:e.data.libelleEn,
                                // niveau:e.data.niveau, 
                                prerequisFr:e.data.prerequisFr, 
                                prerequisEn:e.data.prerequisEn, 
                                approchePedFr:e.data.approchePedFr, 
                                approchePedEn:e.data.approchePedEn, 
                                evaluationAcquisFr:e.data.evaluationAcquisFr, 
                                evaluationAcquisEn:e.data.evaluationAcquisEn,
                                typesEnseignement:matiere.typesEnseignement,
                                chapitres:matiere.chapitres,
                                objectifs:matiere.objectifs,

                            }
                        }));
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
            })
            // }
        }

    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >
                
                <label>{t('label.code')}</label>{/* <label className="text-red-500"> *</label> */}
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn("") }}
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
                <label>{t('label.prerequis_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prerequisFr}
                    onChange={(e) => { setPrerequisFr(e.target.value); }}
                />
                <label>{t('label.prerequis_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prerequisEn}
                    onChange={(e) => { setPrerequisEn(e.target.value); }}
                />
                <label>{t('label.approche_ped_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={approchePedFr}
                    onChange={(e) => { setApprochePedFr(e.target.value); }}
                />
                <label>{t('label.approche_ped_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={approchePedEn}
                    onChange={(e) => { setApprochePedEn(e.target.value); }}
                />
                <label>{t('label.evaluation_acquis_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={evaluationAcquisFr}
                    onChange={(e) => { setEvaluationAcquisFr(e.target.value); }}
                />
                <label>{t('label.evaluation_acquis_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={evaluationAcquisEn}
                    onChange={(e) => { setEvaluationAcquisEn(e.target.value); }}
                />
                {/* <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang === 'fr' ? section.libelleFr : section.libelleEn}>{lang === 'fr' ? section.libelleFr : section.libelleEn}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                    {filteredCycle && filteredCycle.map(cycle => (
                        <option key={cycle._id} value={lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}>{lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                    {filteredNiveau && filteredNiveau.map(niveau => (
                        <option key={niveau._id} value={lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}>{lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>} */}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
