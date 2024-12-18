import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiCreateDevoir, apiUpdateDevoir } from '../../../api/api_devoir';
import createToast from '../../../hooks/toastify';
import { createDevoir, setPage, updateDevoir } from '../../../_redux/features/devoir_slice';
import { formatDateTimeForInput, formatYear } from '../../../fonctions/fonction';


function ModalCreateUpdate({ devoir }: { devoir: DevoirType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentYear: number = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentUser = useSelector((state: RootState) => state.user); // fr ou en
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [deadline, setDeadline] = useState("");
    const [ordreAleatoire, setOrdreAleatoire] = useState(false);
    const [tentativesMax, setTentativesMax] = useState(1);
    const [noteSur, setNoteSur] = useState(20);
    const [noteApresSoumission, setNoteApresSoumission] = useState(false);
    const [correctionApresSoumission, setCorrectionApresSoumission] = useState(false);
    const [noteApresDeadline, setNoteApresDeadline] = useState(true); 
    const [correctionApresDeadline, setCorrectionApresDeadline] = useState(true); 
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [questions, setQuestions] = useState<QuestionType[] | undefined>([]);

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorDeadline, setErrorDeadline] = useState("");
    const [errorOrdreAleatoire, setErrorOrdreAleatoire] = useState("");
    const [errorTentativesMax, setErrorTentativesMax] = useState("");
    const [errorNoteSur, setErrorNoteSur] = useState("");
    const [errorNoteApresSoumission, setErrorNoteApresSoumission] = useState("");
    const [errorCorrectionApresSoumission, setErrorCorrectionApresSoumission] = useState("");
    const [errorNoteApresDeadline, setErrorNoteApresDeadline] = useState(""); 
    const [errorCorrectionApresDeadline, setErrorCorrectionApresDeadline] = useState(""); 
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
    


    useEffect(() => {
        
        if (devoir) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.devoir'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + devoir.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            setTitreFr(devoir.titre_fr)
            setTitreEn(devoir.titre_en)
            setDescriptionFr(devoir?.description_fr || "")
            setDescriptionEn(devoir?.description_en || "")
            setDeadline(formatDateTimeForInput(devoir.deadline))
            setOrdreAleatoire(devoir.ordreAleatoire)
            setTentativesMax(devoir.tentativesMax)
            setNoteSur(devoir.noteSur);
            setNoteApresSoumission(devoir.feedbackConfig.afficherNoteApresSoumission)
            setCorrectionApresSoumission(devoir.feedbackConfig.afficherCorrectionApresSoumission)
            setNoteApresDeadline(devoir.feedbackConfig.afficherNoteApresDeadline)
            setCorrectionApresDeadline(devoir.feedbackConfig.afficherCorrectionApresDeadline)
            setSection(currentSection)
            setCycle(currentCycle)
            setNiveau(currentNiveau)
            setQuestions(devoir.questions)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.devoir'));
            setTitreFr("")
            setTitreEn("")
            setDescriptionFr("")
            setDescriptionEn("")
            setDeadline("")
            setOrdreAleatoire(false)
            setTentativesMax(1)
            setNoteSur(20)
            setNoteApresSoumission(false)
            setCorrectionApresSoumission(false)
            setNoteApresDeadline(true)
            setCorrectionApresDeadline(true)
            setSection(undefined)
            setCycle(undefined)
            setNiveau(undefined)
            setQuestions([])
        }


        if (isFirstRender) {
            
            setErrorTitreFr("");
            setErrorTitreEn("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorDeadline("");
            setErrorOrdreAleatoire("");
            setErrorTentativesMax("");
            setErrorNoteSur("");
            setErrorNoteApresSoumission("");
            setErrorCorrectionApresSoumission("");
            setErrorNoteApresDeadline("");
            setErrorCorrectionApresDeadline("");
            setIsFirstRender(false);
        }
    }, [devoir, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorDeadline("");
        setErrorOrdreAleatoire("");
        setErrorTentativesMax("");
        setErrorNoteSur("");
        setErrorNoteApresSoumission("");
        setErrorCorrectionApresSoumission("");
        setErrorNoteApresDeadline("");
        setErrorCorrectionApresDeadline("");
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
    


    const handleCreateUpdate = async () => {
        if (!titreFr || !titreEn || !section || !cycle || !niveau || !deadline || !noteSur
            || ordreAleatoire == undefined || !tentativesMax || noteApresSoumission == undefined
            || correctionApresSoumission == undefined || noteApresDeadline == undefined || correctionApresDeadline == undefined) {
        
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }
            if (!titreEn) {
                setErrorTitreEn(t('error.titre_en'));
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

            if(!noteSur){
                setErrorNoteSur(t('error.note_sur'));
            }

            if(!deadline){
                setErrorDeadline(t('error.deadline'));
            }
            
            if(ordreAleatoire == undefined){
                setErrorOrdreAleatoire(t('error.ordre_aleatoire'));
            } 
            
            if(!tentativesMax){
                setErrorTentativesMax(t('error.tentatives_max'));
            } 
            
            if(noteApresSoumission == undefined){
                setErrorNoteApresDeadline(t('error.note_apres_soumission'));
            }
            
            if(correctionApresSoumission == undefined){
                setErrorCorrectionApresSoumission(t('error.correction_apres_soumission'));
            }
            
            if(noteApresDeadline == undefined){
                setErrorNoteApresDeadline(t('error.note_apres_deadline'));
            }
            
            if(correctionApresDeadline == undefined){
                setErrorCorrectionApresDeadline(t('error.correction_apres_deadline'));
            }
            return;
        }
        console.log(tentativesMax);
        console.log(noteSur);
        if (!devoir) {
            if (niveau && niveau._id) {
                await apiCreateDevoir(
                    {
                        titre_fr:titreFr,
                        titre_en:titreEn,
                        niveau:niveau._id, 
                        noteSur,
                        utilisateur:currentUser,
                        description_fr:descriptionFr, 
                        description_en:descriptionEn, 
                        tentativesMax, 
                        feedbackConfig:{
                            afficherNoteApresSoumission:noteApresSoumission,
                            afficherCorrectionApresSoumission:correctionApresSoumission,
                            afficherNoteApresDeadline:noteApresDeadline,
                            afficherCorrectionApresDeadline:correctionApresDeadline
                        }, 
                        deadline, 
                        ordreAleatoire,
                        questions,
                        annee:currentYear
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createDevoir({
                            
                            devoir: {
                                _id: e.data._id,
                                titre_fr:e.data.titre_fr,
                                titre_en:e.data.titre_en,
                                niveau:e.data.niveau, 
                                noteSur:e.data.noteSur,
                                utilisateur:e.data.utilisateur,
                                description_fr:e.data.description_fr, 
                                description_en:e.data.description_en, 
                                tentativesMax:e.data.tentativesMax, 
                                feedbackConfig:e.data.feedbackConfig,
                                deadline:e.data.deadline, 
                                ordreAleatoire:e.data.ordreAleatoire,
                                questions:e.data.question,
                                annee:e.data.annee
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
                })
            }
        }else{
            if (niveau && niveau._id) {
                await apiUpdateDevoir(
                    {
                        titre_fr:titreFr,
                        titre_en:titreEn,
                        niveau:niveau._id,
                        noteSur, 
                        utilisateur:currentUser,
                        description_fr:descriptionFr, 
                        description_en:descriptionEn, 
                        tentativesMax, 
                        feedbackConfig:{
                            afficherNoteApresSoumission:noteApresSoumission,
                            afficherCorrectionApresSoumission:correctionApresSoumission,
                            afficherNoteApresDeadline:noteApresDeadline,
                            afficherCorrectionApresDeadline:correctionApresDeadline
                        }, 
                        deadline, 
                        ordreAleatoire,
                        questions,
                        annee:currentYear,
                        _id:devoir._id,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(
                            updateDevoir({
                                id: e.data._id,
                                devoirData: {
                                    _id: e.data._id,
                                    titre_fr:e.data.titre_fr,
                                    titre_en:e.data.titre_en,
                                    niveau:e.data.niveau, 
                                    noteSur:e.data.noteSur,
                                    utilisateur:e.data.utilisateur,
                                    description_fr:e.data.description_fr, 
                                    description_en:e.data.description_en, 
                                    tentativesMax:e.data.tentativesMax, 
                                    feedbackConfig:e.data.feedbackConfig,
                                    deadline:e.data.deadline, 
                                    ordreAleatoire:e.data.ordreAleatoire,
                                    questions:e.data.question,
                                    annee:e.data.annee

                                }
                            }));
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
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
            >
                
                <label>{t('label.annee')}</label>{/* <label className="text-red-500"> *</label> */}
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(currentYear)}
                    readOnly
                    
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.titre_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreFr}
                    onChange={(e) => { setTitreFr(e.target.value); setErrorTitreFr("") }}
                />
                {errorTitreFr && <p className="text-red-500">{errorTitreFr}</p>}
                <label>{t('label.titre_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={titreEn}
                    onChange={(e) => { setTitreEn(e.target.value); setErrorTitreEn("") }}
                />
                {errorTitreEn && <p className="text-red-500">{errorTitreEn}</p>}
                <label>{t('label.descrip_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionFr}
                    onChange={(e) => { setDescriptionFr(e.target.value); }}
                />
                <label>{t('label.descrip_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value); }}
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
                <label>{t('label.note_sur')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={noteSur}
                    onChange={(e) => { setNoteSur(parseInt(e.target.value)); setErrorNoteSur("")}}
                />
                {errorNoteSur && <p className="text-red-500">{errorNoteSur}</p>}
                <label>{t('label.deadline')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => {setDeadline(e.target.value); setErrorDeadline("")}}
                />
                {errorDeadline && <p className="text-red-500">{errorDeadline}</p>}
                <label>{t('label.tentatives_max')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={tentativesMax}
                    onChange={(e) => { setTentativesMax(parseInt(e.target.value)); setErrorTentativesMax("")}}
                />
                {errorTentativesMax && <p className="text-red-500">{errorTentativesMax}</p>}
                <label>{t('label.ordre_aleatoire')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.oui')}
                        name="ordreAleatoire"
                        value={t('label.oui')}
                        checked={ordreAleatoire}
                        onChange={() => { setOrdreAleatoire(true); setErrorOrdreAleatoire("") }}
                    />
                    <label htmlFor={t('label.oui')} className='radio-intern-space'>{t('label.oui')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.non')}
                        name="ordreAleatoire"
                        value={t('label.non')}
                        checked={!ordreAleatoire}
                        onChange={() => { setOrdreAleatoire(false); setErrorOrdreAleatoire("") }}
                    />
                    <label htmlFor={t('label.non')}>{t('label.non')}</label>
                </div>
                {errorOrdreAleatoire && <p className="text-red-500">{errorOrdreAleatoire}</p>}
                <label>{t('label.note_apres_soumission')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.oui')}
                        name="noteApresSoumission"
                        value={t('label.oui')}
                        checked={noteApresSoumission}
                        onChange={() => { setNoteApresSoumission(true); setErrorNoteApresSoumission("") }}
                    />
                    <label htmlFor={t('label.oui')} className='radio-intern-space'>{t('label.oui')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.non')}
                        name="noteApresSoumission"
                        value={t('label.non')}
                        checked={!noteApresSoumission}
                        onChange={() => { setNoteApresSoumission(false); setErrorNoteApresSoumission("") }}
                    />
                    <label htmlFor={t('label.non')}>{t('label.non')}</label>
                </div>
                {errorNoteApresSoumission && <p className="text-red-500">{errorNoteApresSoumission}</p>}
                <label>{t('label.correction_apres_soumission')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.oui')}
                        name="correctionApresSoumission"
                        value={t('label.oui')}
                        checked={correctionApresSoumission}
                        onChange={() => { setCorrectionApresSoumission(true); setErrorCorrectionApresSoumission("") }}
                    />
                    <label htmlFor={t('label.oui')} className='radio-intern-space'>{t('label.oui')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.non')}
                        name="correctionApresSoumission"
                        value={t('label.non')}
                        checked={!correctionApresSoumission}
                        onChange={() => { setCorrectionApresSoumission(false); setErrorCorrectionApresSoumission("") }}
                    />
                    <label htmlFor={t('label.non')}>{t('label.non')}</label>
                </div>
                {errorCorrectionApresSoumission && <p className="text-red-500">{errorCorrectionApresSoumission}</p>}
                <label>{t('label.note_apres_deadline')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.oui')}
                        name="noteApresDeadline"
                        value={t('label.oui')}
                        checked={noteApresDeadline}
                        onChange={() => { setNoteApresDeadline(true); setErrorNoteApresDeadline("") }}
                    />
                    <label htmlFor={t('label.oui')} className='radio-intern-space'>{t('label.oui')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.non')}
                        name="noteApresDeadline"
                        value={t('label.non')}
                        checked={!noteApresDeadline}
                        onChange={() => { setNoteApresDeadline(false); setErrorNoteApresDeadline("") }}
                    />
                    <label htmlFor={t('label.non')}>{t('label.non')}</label>
                </div>
                {errorNoteApresDeadline && <p className="text-red-500">{errorNoteApresDeadline}</p>}
                <label>{t('label.correction_apres_deadline')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.oui')}
                        name="correctionApresDeadline"
                        value={t('label.oui')}
                        checked={correctionApresDeadline}
                        onChange={() => { setCorrectionApresDeadline(true); setErrorCorrectionApresDeadline("") }}
                    />
                    <label htmlFor={t('label.oui')} className='radio-intern-space'>{t('label.oui')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.non')}
                        name="correctionApresDeadline"
                        value={t('label.non')}
                        checked={!correctionApresDeadline}
                        onChange={() => { setCorrectionApresDeadline(false); setErrorCorrectionApresDeadline("") }}
                    />
                    <label htmlFor={t('label.non')}>{t('label.non')}</label>
                </div>
                {errorCorrectionApresDeadline && <p className="text-red-500">{errorCorrectionApresDeadline}</p>}
                
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
