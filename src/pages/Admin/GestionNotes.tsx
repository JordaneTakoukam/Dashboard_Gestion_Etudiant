// src/pages/Admin/Evaluations/GestionNotes.tsx - Version améliorée

import { useEffect, useState, useRef, useCallback } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getNotesByEvaluationMatiere } from "../../api/api_note";
import {
    getAnonymatsDisponibles,
    rechercherAnonymats,
} from "../../api/api_anonymat";
import createToast from "../../hooks/toastify";
import { setNoteLoading, setNotes } from "../../_redux/features/note_slice";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { saisieRapideNote } from "../../api/api_note";

const GestionNotes = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const { data: { notes } } = useSelector((state: RootState) => state.noteSlice);
    const pageIsLoading = useSelector((state: RootState) => state.noteSlice.pageIsLoading);

    // États principaux
    const [selectedMatiere, setSelectedMatiere] = useState<string>("");
    const [numeroAnonymat, setNumeroAnonymat] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [appreciationFr, setAppreciationFr] = useState<string>("");
    const [appreciationEn, setAppreciationEn] = useState<string>("");
    const [absent, setAbsent] = useState<boolean>(false);
    const [fraude, setFraude] = useState<boolean>(false);
    const [copieBlanche, setCopieBlanche] = useState<boolean>(false);
    const [anonymatValide, setAnonymatValide] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    // NOUVEAUX ÉTATS pour les améliorations
    const [anonymatsDisponibles, setAnonymatsDisponibles] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
    const [loadingAnonymats, setLoadingAnonymats] = useState<boolean>(false);

    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [currentClasse, setCurrentClasse] = useState<string>("");

    // Refs pour la navigation au clavier
    const anonymatInputRef = useRef<HTMLInputElement>(null);
    const noteInputRef = useRef<HTMLInputElement>(null);
    const appreciationFrRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Timer pour le debounce de la vérification automatique
    const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if(selectedEvaluation){
            const currentNiveau = niveaux.find(niveau => niveau._id === selectedEvaluation?.niveau);
            const currentCycle = cycles.find(cycle=>cycle._id===currentNiveau?.cycle);
            const currentSection = sections.find(sec=>sec._id===currentCycle?.section);
            const sectionLib = lang === "fr"?currentSection?.libelleFr:currentSection?.libelleEn;
            const cycleLib = lang === "fr"?currentCycle?.libelleFr:currentCycle?.libelleEn;
            const niveauLib = lang === "fr"?currentNiveau?.libelleFr:currentNiveau?.libelleEn;
            setCurrentClasse(sectionLib!+cycleLib!+niveauLib);
        }
    }, [selectedEvaluation]);

    // Charger les notes quand une matière est sélectionnée
    useEffect(() => {
        if (selectedEvaluation && selectedMatiere) {
            fetchNotes();
            fetchAnonymatsDisponibles();
        }
    }, [selectedEvaluation, selectedMatiere]);

    const fetchNotes = async () => {
        if (!selectedEvaluation?._id || !selectedMatiere) return;

        dispatch(setNoteLoading(true));
        try {
            const result = await getNotesByEvaluationMatiere(
                selectedEvaluation._id,
                selectedMatiere
            );
            dispatch(setNotes(result));
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setNoteLoading(false));
        }
    };

    // NOUVEAU - Charger la liste des anonymats disponibles
    const fetchAnonymatsDisponibles = async () => {
        if (!selectedEvaluation?._id || !selectedMatiere) return;

        setLoadingAnonymats(true);
        try {
            const result = await getAnonymatsDisponibles(
                selectedEvaluation._id,
                selectedMatiere
            );
            setAnonymatsDisponibles(result.anonymats || []);
        } catch (error) {
            console.error("Erreur lors du chargement des anonymats:", error);
        } finally {
            setLoadingAnonymats(false);
        }
    };

    // NOUVEAU - Vérification automatique avec debounce
    const handleAnonymatChange = useCallback((value: string) => {
        setNumeroAnonymat(value);
        setAnonymatValide(null);
        
        // Nettoyer le timer précédent
        if (verificationTimerRef.current) {
            clearTimeout(verificationTimerRef.current);
        }

        // Si le champ est vide, masquer les suggestions
        if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Rechercher dans les suggestions (autocomplétion locale d'abord)
        const matches = anonymatsDisponibles.filter(a => 
            a.numeroAnonymat.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matches);
        setShowSuggestions(matches.length > 0);
        setSelectedSuggestionIndex(-1);

        // Si on a une correspondance exacte, vérifier automatiquement
        const exactMatch = matches.find(a => 
            a.numeroAnonymat.toLowerCase() === value.toLowerCase()
        );

        if (exactMatch) {
            setAnonymatValide(true);
            setShowSuggestions(false);
        } else if (value.length >= 5) {
            // Vérification automatique après 500ms de pause
            verificationTimerRef.current = setTimeout(() => {
                verifierAnonymatAuto(value);
            }, 500);
        }
    }, [anonymatsDisponibles]);

    // NOUVEAU - Vérification automatique
    const verifierAnonymatAuto = async (numAnonymat: string) => {
        if (!numAnonymat || !selectedEvaluation?._id) return;

        setIsVerifying(true);
        try {
            const result = await rechercherAnonymats(
                selectedEvaluation._id,
                numAnonymat,
                selectedMatiere
            );
            
            if (result.anonymats && result.anonymats.length > 0) {
                const match = result.anonymats.find(
                    (a: any) => a.numeroAnonymat.toLowerCase() === numAnonymat.toLowerCase()
                );
                
                if (match) {
                    setAnonymatValide(true);
                    createToast(t('label.anonymat_valide'), "", 0);
                } else {
                    setAnonymatValide(false);
                    setSuggestions(result.anonymats);
                    setShowSuggestions(true);
                }
            } else {
                setAnonymatValide(false);
                createToast(t('label.anonymat_invalide'), "", 2);
            }
        } catch (error) {
            setAnonymatValide(false);
        } finally {
            setIsVerifying(false);
        }
    };

    // NOUVEAU - Gestion de la navigation au clavier
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) {
            // Navigation entre les champs
            if (e.key === 'Enter' && anonymatValide) {
                e.preventDefault();
                if (absent) {
                    handleSaisirNote();
                } else {
                    noteInputRef.current?.focus();
                }
            }
            return;
        }

        // Navigation dans les suggestions
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                    selectSuggestion(suggestions[selectedSuggestionIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
                break;
        }
    };

    // NOUVEAU - Sélectionner une suggestion
    const selectSuggestion = (anonymat: any) => {
        setNumeroAnonymat(anonymat.numeroAnonymat);
        setAnonymatValide(true);
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedSuggestionIndex(-1);
        
        // Focus sur le champ de note si pas absent
        setTimeout(() => {
            if (!absent) {
                noteInputRef.current?.focus();
            }
        }, 100);
    };

    // AMÉLIORÉ - Saisie rapide avec validation intégrée
    const handleSaisirNote = async () => {
        if (!selectedEvaluation?._id || !selectedMatiere || !numeroAnonymat) {
            createToast(t('error.champs_requis'), "", 2);
            return;
        }

        if (!absent && !note) {
            createToast(t('error.note_requise'), "", 2);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await saisieRapideNote({
                evaluation: selectedEvaluation._id,
                matiere: selectedMatiere,
                anonymat: numeroAnonymat,
                note: absent ? 0 : parseFloat(note),
                appreciationFr,
                appreciationEn,
                absent,
                fraude,
                copieBlanche,
                saisiePar: currentUser._id,
                modifiePar: currentUser._id
            });

            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                resetForm();
                fetchNotes();
                fetchAnonymatsDisponibles();
                
                // Focus automatique sur le champ anonymat pour saisie continue
                setTimeout(() => {
                    anonymatInputRef.current?.focus();
                }, 100);
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message?.[lang] || t('message.erreur');
            createToast(errorMsg, '', 2);
        } finally {
            setIsSubmitting(false);
        }
    };

    // AMÉLIORÉ - Navigation au clavier pour le champ note
    const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (appreciationFr || appreciationEn) {
                appreciationFrRef.current?.focus();
            } else {
                handleSaisirNote();
            }
        }
    };

    const resetForm = () => {
        setNumeroAnonymat("");
        setNote("");
        setAppreciationFr("");
        setAppreciationEn("");
        setAbsent(false);
        setFraude(false);
        setCopieBlanche(false);
        setAnonymatValide(null);
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
    };

    // Nettoyage du timer au démontage
    useEffect(() => {
        return () => {
            if (verificationTimerRef.current) {
                clearTimeout(verificationTimerRef.current);
            }
        };
    }, []);

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.gestion_notes')} />
                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p>{t('select_par_defaut.selectionnez')+t('select_par_defaut.evaluation')}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.gestion_notes')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
                <h3 className="font-medium text-lg mb-2">
                    {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                </h3>

                {/* Sélection matière */}
                <div className="mb-5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        {t('label.matiere')} <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedMatiere}
                        onChange={(e) => setSelectedMatiere(e.target.value)}
                        className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.matiere')}</option>
                        {selectedEvaluation.matieres.map(m => (
                            <option key={m.matiere!._id} value={m.matiere!._id}>
                                {lang==="fr"?m.matiere!.libelleFr:m.matiere!.libelleEn}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedMatiere && (
                    <>
                        {/* Statistiques rapides */}
                        <div className="mb-5 flex gap-4 text-sm">
                            <div className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded">
                                <span className="font-medium">{t('label.total_anonymats')}: </span>
                                <span className="font-bold">{anonymatsDisponibles.length + notes.length}</span>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900 px-4 py-2 rounded">
                                <span className="font-medium">{t('label.notes_saisies')}: </span>
                                <span className="font-bold">{notes.length}</span>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900 px-4 py-2 rounded">
                                <span className="font-medium">{t('label.restants')}: </span>
                                <span className="font-bold">{anonymatsDisponibles.length}</span>
                            </div>
                        </div>

                        {/* Formulaire de saisie rapide */}
                        <div className="border-t pt-5">
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                                {t('label.saisie_note')}
                                {/* <span className="text-xs text-gray-500">
                                    ({t('label.navigation_clavier')}: Enter ↵ {t('label.pour_continuer')})
                                </span> */}
                            </h4>

                            {/* Numéro d'anonymat avec autocomplétion */}
                            <div className="mb-4 relative">
                                <label className="mb-2 block text-sm font-medium">
                                    {t('label.numero_anonymat')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        ref={anonymatInputRef}
                                        type="text"
                                        value={numeroAnonymat}
                                        onChange={(e) => handleAnonymatChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="AN2024-123456"
                                        disabled={isSubmitting}
                                        autoFocus
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4 pr-10 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                    {/* Indicateur de vérification */}
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {isVerifying && <FaSpinner className="animate-spin text-blue-500" />}
                                        {!isVerifying && anonymatValide === true && (
                                            <FaCheckCircle className="text-green-500" />
                                        )}
                                        {!isVerifying && anonymatValide === false && (
                                            <FaTimesCircle className="text-red-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Suggestions d'autocomplétion */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div
                                        ref={suggestionsRef}
                                        className="absolute z-10 w-full mt-1 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={suggestion._id}
                                                onClick={() => selectSuggestion(suggestion)}
                                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4 ${
                                                    index === selectedSuggestionIndex ? 'bg-blue-50 dark:bg-blue-900' : ''
                                                }`}
                                            >
                                                <span className="font-medium">{suggestion.numeroAnonymat}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({suggestion.statut})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Message de validation */}
                                {anonymatValide !== null && !showSuggestions && (
                                    <div className="mt-2 flex items-center gap-2">
                                        {anonymatValide ? (
                                            <>
                                                <FaCheckCircle className="text-green-500" />
                                                <span className="text-green-500 text-sm">{t('label.anonymat_valide')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle className="text-red-500" />
                                                <span className="text-red-500 text-sm">{t('label.anonymat_invalide')}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Note */}
                            <div className="mb-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <label className="text-sm font-medium">
                                        {t('label.note')} / {selectedEvaluation.noteMax}
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={absent}
                                            onChange={(e) => setAbsent(e.target.checked)}
                                            disabled={isSubmitting}
                                        />
                                        <span className="text-sm">{t('label.absent')}</span>
                                    </label>
                                </div>
                                <input
                                    ref={noteInputRef}
                                    type="number"
                                    min="0"
                                    max={selectedEvaluation.noteMax}
                                    step="0.25"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    onKeyDown={handleNoteKeyDown}
                                    disabled={absent || isSubmitting}
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Appréciations */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        {t('label.appreciation_fr')}
                                    </label>
                                    <textarea
                                        ref={appreciationFrRef}
                                        value={appreciationFr}
                                        onChange={(e) => setAppreciationFr(e.target.value)}
                                        rows={3}
                                        disabled={isSubmitting}
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        {t('label.appreciation_en')}
                                    </label>
                                    <textarea
                                        value={appreciationEn}
                                        onChange={(e) => setAppreciationEn(e.target.value)}
                                        rows={3}
                                        disabled={isSubmitting}
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Options supplémentaires */}
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={fraude}
                                        onChange={(e) => setFraude(e.target.checked)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-sm">{t('label.fraude')}</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={copieBlanche}
                                        onChange={(e) => setCopieBlanche(e.target.checked)}
                                        disabled={isSubmitting}
                                    />
                                    <span className="text-sm">{t('label.copie_blanche')}</span>
                                </label>
                            </div>

                            {/* Boutons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaisirNote}
                                    disabled={isSubmitting || !anonymatValide}
                                    className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting && <FaSpinner className="animate-spin" />}
                                    {isSubmitting ? "" : t('boutton.enregistrer')} 
                                </button>
                                <button
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {t('boutton.reinitialiser')}
                                </button>
                            </div>
                        </div>

                        {/* Liste des notes saisies */}
                        <div className="border-t mt-5 pt-5">
                            <h4 className="font-medium mb-4">{t('label.notes_saisies')}</h4>
                            {pageIsLoading ? (
                                <Loading />
                            ) : notes.length === 0 ? (
                                <p className="text-gray-500">{t('label.aucune_note_saisie')}</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-2 dark:bg-meta-4">
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    {t('label.anonymat')}
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    {t('label.note')}
                                                </th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                                    {t('label.appreciation')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notes.map((n, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="py-3 px-4">
                                                        {n.anonymat.numeroAnonymat}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {n.absent ? t('label.absent') : `${n.note}/${n.noteMax}`}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {lang === 'fr' ? n.appreciationFr : n.appreciationEn}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GestionNotes;