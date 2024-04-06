import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsersWithRole } from '../../../api/api_user';


function ModalCreateUpdate({ matiere }: { matiere: MatiereType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [prerequisFr, setPrerequisFr] = useState("");
    const [prerequisEn, setPrerequisEn] = useState("");
    const [evaluationDesAcquisFr, setEvaluationDesAcquisFr] = useState("");
    const [evaluationDesAcquisEn, setEvaluationDesAcquisEn] = useState("");
    const [approchePedagogiqueFr, setApprochePedagogiqueFr] = useState("");
    const [approchePedagogiqueEn, setApprochePedagogiqueEn] = useState("");
    const [section, setSection] = useState<CommonSettingProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();

    const [enseignements, setEnseignements] = useState<Enseignement[]>([{ typeEnseignement: '', enseignantPrincipal: undefined, enseignantSuppleant: undefined }]);

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

    const handleAddEnseignement = () => {
        const newEnseignement: Enseignement = {
            typeEnseignement: '',
            enseignantPrincipal: undefined,
            enseignantSuppleant: undefined,
        };
        setEnseignements([...enseignements, newEnseignement]);
    };

    // Fonction pour supprimer un champ d'enseignement
    const handleRemoveEnseignement = (index: number) => {
        const updatedEnseignements = [...enseignements];
        updatedEnseignements.splice(index, 1);
        setEnseignements(updatedEnseignements);
    };

    // Fonction pour mettre à jour un champ d'enseignement
    const handleEnseignementChange = (index: number, type: Enseignement) => {
        setEnseignements(prevState => {
            const updatedTypes = [...prevState];
            updatedTypes[index] = type;
            if(updatedTypes && enseignements[0].enseignantPrincipal){
                setErrorTypeEns("");
            }
            return updatedTypes;
        });
    };
    const [enseignants, setEnseignants] = useState<UserState[]>([]);
    

    useEffect(() => {
        const fetchEnseignants = async () => {
            // dispatch(setUserLoading(true)); // Définissez le loading à true avant le chargement
            try {
                
                const fetchedEnseignants = await getUsersWithRole({ role: "enseignant" });
                console.log(fetchedEnseignants.users);
                if (fetchedEnseignants) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                    setEnseignants(fetchedEnseignants.users);
                } else {
                    setEnseignants([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                
            }
        };

        fetchEnseignants();
    }, []);

    useEffect(() => {
        
        if (matiere) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.matiere'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + matiere.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentNiveau._id);
            setCode(matiere.code);
            setLibelleFr(matiere.libelleFr);
            setLibelleEn(matiere.libelleEn);
            setPrerequisFr(matiere.prerequisFr ? matiere.prerequisFr : "");
            setPrerequisEn(matiere.prerequisEn ? matiere.prerequisEn : "");
            setEvaluationDesAcquisFr(matiere.evaluationAcquisFr ? matiere.evaluationAcquisFr : "");
            setEvaluationDesAcquisEn(matiere.evaluationAcquisEn ? matiere.evaluationAcquisEn : "");
            setApprochePedagogiqueFr(matiere.approchePedFr ? matiere.approchePedFr : "");
            setApprochePedagogiqueEn(matiere.approchePedEn ? matiere.approchePedEn : "");
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.matiere'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setPrerequisFr("");
            setPrerequisEn("");
            setEvaluationDesAcquisFr("");
            setEvaluationDesAcquisEn("");
            setApprochePedagogiqueFr("");
            setApprochePedagogiqueEn("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
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
        if(enseignantsFiltres.length>0 && enseignements[0].typeEnseignement){
            setErrorTypeEns("");
        }
        // Mettre à jour les enseignants suggérés avec les résultats filtrés
        setEnseignantsSuggeres(enseignantsFiltres);
    };


    const handleCreateUpdate = () => {
        console.log(enseignements);
        if (!code || !libelleFr || !libelleEn || !section || !cycle || !niveau) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error._fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error._en'));
            }
            if (!section) {
                setErrorSection(t('error.section'));
            }
            if (!cycle) {
                setErrorCycle(t('error.cycle'));
            }
            if (!niveau) {
                setErrorNiveau(t('error.niveau'));
            }

            if(enseignements.length>0){
                if(!enseignements[0].typeEnseignement || !enseignements[0].enseignantPrincipal){
                    setErrorTypeEns(t('error.enseignement'))
                }
            }


            return;
        }

        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
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
                    value={approchePedagogiqueFr}
                    onChange={(e) => { setApprochePedagogiqueFr(e.target.value); }}
                />
                <label>{t('label.approche_ped_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={approchePedagogiqueEn}
                    onChange={(e) => { setApprochePedagogiqueEn(e.target.value); }}
                />
                <label>{t('label.evaluation_acquis_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={evaluationDesAcquisFr}
                    onChange={(e) => { setEvaluationDesAcquisFr(e.target.value); }}
                />
                <label>{t('label.evaluation_acquis_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={evaluationDesAcquisEn}
                    onChange={(e) => { setEvaluationDesAcquisEn(e.target.value); }}
                />
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
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
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
                <div>
                    <h3>{t('label.types_ens')}</h3>
                    {enseignements.map((type, index) => (
                        <div key={index} className="enseignement-container">
                            <select
                                value={type.typeEnseignement ? (lang === 'fr' ? type.typeEnseignement : type.typeEnseignement) : 'Sélectionnez un type d\'enseignement'}
                                onChange={(e) => {
                                    const selectedType = typesEnseignement.find(t => t.code === e.target.value);

                                    if (selectedType && selectedType._id) {
                                        handleEnseignementChange(index, {...type, typeEnseignement: selectedType._id});
                                    }
                                }}
                                className="select-field w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            >
                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                                {typesEnseignement.map((t, i) => (
                                    <option key={i} value={t.code}>{t.code}</option>
                                ))}
                            </select>
                            <div className="enseignant-input">
                                <input
                                    type="text"
                                    id={`enseignant-${index}`}
                                    placeholder={t('label.enseignant')}
                                    list={`enseignants-list-${index}`}
                                    className="input-field w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    onChange={handleInputChange}
                                />
                                <datalist id={`enseignants-list-${index}`}>
                                    {enseignantsSuggeres.map((enseignant, index) => (
                                        <option key={index} value={`${enseignant.nom} ${enseignant.prenom}`} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="enseignant-sup-input">
                                <input
                                    type="text"
                                    id={`enseignant-sup-${index}`}
                                    list={`enseignants-sup-list-${index}`}
                                    placeholder={t('label.enseignant_sup')}
                                    className="input-field w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    onChange={handleInputChange}
                                />
                                <datalist id={`enseignants-sup-list-${index}`}>
                                    {enseignantsSuggeres.map((enseignant, index) => (
                                        <option key={index} value={`${enseignant.nom} ${enseignant.prenom}`} />
                                    ))}
                                </datalist>
                            </div>
                            {index !== 0 && (
                                <button type="button" onClick={() => handleRemoveEnseignement(index)}>
                                    {t('boutton.supprimer')}
                                </button>
                            )}
                        </div>
                    ))}
                    {errorTypeEns && <p className="text-red-500">{errorTypeEns}</p>}

                    {enseignements.length < typesEnseignement.length && ( // Afficher le bouton d'ajout si tous les types n'ont pas été ajoutés
                        <button type="button" onClick={handleAddEnseignement}>
                            {t('boutton.ajouter_type')}
                        </button>
                    )}
                </div>

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
