//src/components/Modals/ModalEvaluation/FormCreateUpdate.tsx

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    apiCreateEvaluation,
    apiUpdateEvaluation
} from '../../../api/api_evaluation';
import {
    getCoefficientsByNiveau,
    getLatestCoefficientByMatiere
} from '../../../api/api_coefficient';
import {
    getSemestresByNiveau,
} from '../../../api/api_semestre_evaluation';
import createToast from '../../../hooks/toastify';
import {
    createEvaluation,
    updateEvaluation
} from '../../../_redux/features/evaluation_slice';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { getMatieresByNiveau } from '../../../api/api_matiere';

function FormCreateUpdate({ evaluation }: { evaluation: EvaluationType | null }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [type, setType] = useState<string>("CONTROLE_CONTINU");
    const [statut, setStatut] = useState<string>("BROUILLON");
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [annee, setAnnee] = useState<number>(currentYear);
    const [semestre, setSemestre] = useState<number>(currentSemestre);
    const [semestresAutorises, setSemestresAutorises] = useState<number[]>([1, 2]);
    const [dateEpreuve, setDateEpreuve] = useState("");
    const [dateLimiteSaisie, setDateLimiteSaisie] = useState("");
    const [noteMax, setNoteMax] = useState<number>(20);
    const [noteMin, setNoteMin] = useState<number>(0);
    const [matieres, setMatieres] = useState<EvaluationMatiereType[]>([]);
    const [matieresDisponibles, setMatieresDisponibles] = useState<MatiereType[]>([]);

    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorMatieres, setErrorMatieres] = useState("");


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");

    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);

    

    // Récupérer les semestres autorisés quand le niveau change
    useEffect(() => {
        if (niveau?._id) {
            getSemestresByNiveau(niveau._id)
                .then(info => {
                    setSemestresAutorises(info.semestresAutorises);
                    if (!info.semestresAutorises.includes(semestre)) {
                        setSemestre(info.semestresAutorises[0]);
                    }
                })
                .catch(() => setSemestresAutorises([1, 2]));

            // Récupérer les matières avec coefficients
            getCoefficientsByNiveau(niveau._id, annee, semestre)
                .then(result => {
                    // Simuler la récupération des matières - à adapter selon votre API
                    setMatieresDisponibles([]);
                })
                .catch(console.error);
        }
    }, [niveau, annee, semestre]);

    useEffect(() => {
        if (niveau?._id) {
            getMatieresByNiveau({ niveauId: niveau._id, annee: currentYear, semestre: currentSemestre, langue:lang }).then(result => {
                if(result){
                    setMatieresDisponibles(result.matieres)
                }else{
                    setMatieres([])
                }
            })
            
        }
    }, [niveau, annee, semestre]);

    useEffect(() => {
        if (evaluation) {
            console.log(evaluation)
            const currentNiveau = niveaux.find(n => n._id === evaluation.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            setModalTitle(t('form_update.enregistrer') + ' ' + t('form_update.evaluation'));
            setLibelleFr(evaluation.libelleFr);
            setLibelleEn(evaluation.libelleEn);
            setDescriptionFr(evaluation.descriptionFr || "");
            setDescriptionEn(evaluation.descriptionEn || "");
            setType(evaluation.type);
            setStatut(evaluation.statut);
            setSection(currentSection)
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            setAnnee(evaluation.annee);
            setSemestre(evaluation.semestre);
            setDateEpreuve(evaluation.dateEpreuve ? new Date(evaluation.dateEpreuve).toISOString().split('T')[0] : "");
            setDateLimiteSaisie(evaluation.dateLimiteSaisie ? new Date(evaluation.dateLimiteSaisie).toISOString().split('T')[0] : "");
            setNoteMax(evaluation.noteMax);
            setNoteMin(evaluation.noteMin);
            
            // Ne pas définir les matières ici directement
            // On va les "hydrater" dans un autre useEffect quand matieresDisponibles sera chargé
        } else {
            setModalTitle(t('form_save.enregistrer') + ' ' + t('form_save.evaluation'));
            resetForm();
        }
    }, [evaluation, t, niveaux]);

    // Nouveau useEffect pour hydrater les matières lors de l'édition
    useEffect(() => {
        if (evaluation && matieresDisponibles.length > 0) {
            // Hydrater les matières avec les objets complets
            const matieresHydratees = evaluation.matieres.map(evalMat => {
                // Si evalMat.matiere est déjà un objet complet avec _id
                const matiereId = typeof evalMat.matiere === 'string' 
                    ? evalMat.matiere 
                    : evalMat.matiere?._id;
                
                // Trouver la matière complète dans matieresDisponibles
                const matiereComplete = matieresDisponibles.find(m => m._id === matiereId);
                
                return {
                    matiere: matiereComplete,
                    coefficient: evalMat.coefficient
                };
            });
            
            setMatieres(matieresHydratees);
            console.log('Matières hydratées:', matieresHydratees);
        }
    }, [evaluation, matieresDisponibles]);

    const resetForm = () => {
        setLibelleFr("");
        setLibelleEn("");
        setDescriptionFr("");
        setDescriptionEn("");
        setType("CONTROLE_CONTINU");
        setStatut("BROUILLON");
        setNiveau(undefined);
        setCycle(undefined);
        setSection(undefined);
        setAnnee(currentYear);
        setSemestre(currentSemestre);
        setDateEpreuve("");
        setDateLimiteSaisie("");
        setNoteMax(20);
        setNoteMin(0);
        setMatieres([]);
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorMatieres("");
    };

    const closeModal = () => {
        resetForm();
        dispatch(setShowModal());
    };

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

    const handleAddMatiere = () => {
        setMatieres([...matieres, { matiere: undefined, coefficient: 1 }]);
    };

    const handleRemoveMatiere = (index: number) => {
        const newMatieres = matieres.filter((_, i) => i !== index);
        setMatieres(newMatieres);
    };

   const handleMatiereChange = async (index: number, field: 'matiere' | 'coefficient', value: any) => {
        const newMatieres = [...matieres];
        
        if (field === 'matiere') {
            // Trouver la matière complète à partir de l'ID
            const matiereSelectionnee = matieresDisponibles.find(m => m._id === value);
            newMatieres[index] = { ...newMatieres[index], matiere: matiereSelectionnee };
            
            // Récupérer automatiquement le dernier coefficient enregistré
            if (matiereSelectionnee && niveau?._id) {
                try {
                    const result = await getLatestCoefficientByMatiere(matiereSelectionnee._id!, niveau._id);
                    if (result.success && result.data) {
                        // Mettre à jour le coefficient avec la valeur récupérée
                        newMatieres[index].coefficient = result.data.coefficient;
                        console.log(`Coefficient récupéré pour ${matiereSelectionnee.libelleFr}: ${result.data.coefficient}`);
                    } else {
                        // Si aucun coefficient n'est trouvé, utiliser 1 par défaut
                        newMatieres[index].coefficient = 1;
                        console.log(`Aucun coefficient trouvé pour ${matiereSelectionnee.libelleFr}, utilisation du coefficient par défaut: 1`);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération du coefficient:', error);
                    // En cas d'erreur, garder le coefficient par défaut
                    newMatieres[index].coefficient = 1;
                }
            }
        } else {
            newMatieres[index] = { ...newMatieres[index], [field]: value };
        }
        
        setMatieres(newMatieres);
        setErrorMatieres("");
    };

    const handleCreateUpdate = async () => {
        if (!libelleFr || !libelleEn || !section || !cycle || !niveau || matieres.length === 0) {
            if (!libelleFr) setErrorLibelleFr(t('error.libelle_fr'));
            if (!libelleEn) setErrorLibelleEn(t('error.libelle_en'));
            if (!section) setErrorSection(t('error.section'));
            if (!cycle) setErrorCycle(t('error.cycle'));
            if (!niveau) setErrorNiveau(t('error.niveau'));

            if (matieres.length === 0) setErrorMatieres(t('error.matieres_requises'));
            return;
        }

        // Vérifier que toutes les matières ont un coefficient
        const hasInvalidMatiere = matieres.some(m => !m.matiere || m.coefficient <= 0);
        if (hasInvalidMatiere) {
            setErrorMatieres(t('error.matieres_invalides'));
            return;
        }

        const matieresData = matieres.map(m => ({
            matiere: m.matiere!._id,
            coefficient: m.coefficient
        }));
        setIsLoading(true);


        const evaluationData = {
            libelleFr,
            libelleEn,
            descriptionFr,
            descriptionEn,
            type: type as any,
            statut:statut as any,
            niveau: niveau._id!,
            annee,
            semestre,
            matieres:matieresData,
            dateEpreuve: dateEpreuve ? new Date(dateEpreuve) : undefined,
            dateLimiteSaisie: dateLimiteSaisie ? new Date(dateLimiteSaisie) : undefined,
            noteMax,
            noteMin,
            creePar:currentUser._id
        };

        try {
            if (!evaluation) {
                const response = await apiCreateEvaluation(evaluationData);
                if (response.success) {
                    createToast(response.message[lang as keyof typeof response.message], '', 0);
                    dispatch(createEvaluation({ evaluation: response.data }));
                    closeModal();
                } else {
                    createToast(response.message[lang as keyof typeof response.message], '', 2);
                }
            } else {
                const response = await apiUpdateEvaluation({ ...evaluationData, _id: evaluation._id! });
                if (response.success) {
                    createToast(response.message[lang as keyof typeof response.message], '', 0);
                    dispatch(updateEvaluation({ id: evaluation._id!, evaluationData: response.data }));
                    closeModal();
                } else {
                    createToast(response.message[lang as keyof typeof response.message], '', 2);
                }
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsLoading(false);
        }
    };

    const typesEvaluation = [
        { value: 'CONTROLE_CONTINU', label: t('label.controle_continu') },
        { value: 'EXAMEN_PARTIEL', label: t('label.examen_partiel') },
        { value: 'EXAMEN_FINAL', label: t('label.examen_final') },
        { value: 'SESSION_RATTRAPAGE', label: t('label.session_rattrapage') },
        { value: 'AUTRE', label: t('label.autre') }
    ];

    const statutsEvaluation = [
        { value: 'BROUILLON', label: t('label.brouillon') },
        { value: 'PROGRAMMEE', label: t('label.programmee') },
        { value: 'EN_COURS', label: t('label.en_cours') },
        { value: 'CORRECTION', label: t('label.correction') },
        { value: 'DELIBERATION', label: t('label.deliberation') },
        { value: 'PUBLIEE', label: t('label.publiee') },
        { value: 'VERROUILEE', label: t('label.verrouillee') }
    ];


    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            closeModal={closeModal}
            handleConfirm={handleCreateUpdate}
            isLoading={isLoading}
        >
            <div className="max-h-[60vh] overflow-y-auto px-2">
                <label>{t('label.libelle_fr')}</label>
                <label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mb-3"
                    type="text"
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr(""); }}
                />
                {errorLibelleFr && <p className="text-red-500 mb-2">{errorLibelleFr}</p>}

                <label>{t('label.libelle_en')}</label>
                <label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mb-3"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn(""); }}
                />
                {errorLibelleEn && <p className="text-red-500 mb-2">{errorLibelleEn}</p>}

                <label>{t('label.type_evaluation')}</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mb-3"
                >
                    {typesEvaluation.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>

                <label>{t('label.statut')}</label>
                <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mb-3"
                >
                    {statutsEvaluation.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? (lang==='fr'?section.libelleFr:section.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang==='fr'?section.libelleFr:section.libelleEn}>{lang==='fr'?section.libelleFr:section.libelleEn}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? (lang==='fr'?cycle.libelleFr:cycle.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                    {filteredCycle && filteredCycle.map(cycle => (
                        <option key={cycle._id} value={lang==='fr'?cycle.libelleFr:cycle.libelleEn}>{lang==='fr'?cycle.libelleFr:cycle.libelleEn}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? (lang==='fr'?niveau.libelleFr:niveau.libelleEn): t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                    {filteredNiveau && filteredNiveau.map(niveau => (
                        <option key={niveau._id} value={lang==='fr'?niveau.libelleFr:niveau.libelleEn}>{lang==='fr'?niveau.libelleFr:niveau.libelleEn}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <label>{t('label.annee')}</label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number"
                            value={annee}
                            onChange={(e) => setAnnee(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>{t('label.semestre')}</label>
                        <select
                            value={semestre}
                            onChange={(e) => setSemestre(parseInt(e.target.value))}
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        >
                            {semestresAutorises.map(s => (
                                <option key={s} value={s}>{t('label.semestre')} {s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label>{t('label.matieres')}</label>
                <label className="text-red-500"> *</label>
                {matieres.map((mat, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                        <select
                            value={mat.matiere?._id || ""}
                            onChange={(e) => handleMatiereChange(index, 'matiere', e.target.value)}
                            className="flex-1 rounded border border-stroke bg-gray py-2 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.matiere')}</option>
                            {matieresDisponibles.map(matD => (
                                <option key={matD._id} value={matD._id}>
                                    {lang === 'fr' ? matD.libelleFr : matD.libelleEn}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={mat.coefficient}
                            onChange={(e) => handleMatiereChange(index, 'coefficient', parseFloat(e.target.value))}
                            className="w-20 rounded border border-stroke bg-gray py-2 pl-4 pr-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            placeholder="Coef"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveMatiere(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddMatiere}
                    className="flex items-center gap-2 text-primary hover:underline mb-3"
                >
                    <FaPlus /> {t('boutton.ajouter_matiere')}
                </button>
                {errorMatieres && <p className="text-red-500 mb-2">{errorMatieres}</p>}

                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <label>{t('label.date_epreuve')}</label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="date"
                            value={dateEpreuve}
                            onChange={(e) => setDateEpreuve(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>{t('label.date_limite_saisie')}</label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="date"
                            value={dateLimiteSaisie}
                            onChange={(e) => setDateLimiteSaisie(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </CustomDialogModal>
    );
}

export default FormCreateUpdate;