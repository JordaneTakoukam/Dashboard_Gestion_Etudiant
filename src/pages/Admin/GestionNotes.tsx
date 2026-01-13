//src/pages/Admin/Evaluations/GestionNotes.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    apiSaisirNote,
    getNotesByEvaluationMatiere,
} from "../../api/api_note";
import {
    apiVerifierAnonymat,
    getNumerosAnonymatsByEvaluation
} from "../../api/api_anonymat";
import createToast from "../../hooks/toastify";
import { setNoteLoading, setNotes } from "../../_redux/features/note_slice";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const GestionNotes = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const { data: { notes } } = useSelector((state: RootState) => state.noteSlice);
    const pageIsLoading = useSelector((state: RootState) => state.noteSlice.pageIsLoading);

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
    const currentUser: UserState = useSelector((state: RootState) => state.user);

    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [currentClasse, setCurrentClasse] = useState<string>("")

    useEffect(() => {
        if(selectedEvaluation){
            const currentNiveau = niveaux.find(niveau => niveau._id === selectedEvaluation?.niveau)
            const currentCycle = cycles.find(cycle=>cycle._id===currentNiveau?.cycle)
            const currentSection = sections.find(sec=>sec._id===currentCycle?.section)
            const sectionLib = lang === "fr"?currentSection?.libelleFr:currentSection?.libelleEn;
            const cycleLib = lang === "fr"?currentCycle?.libelleFr:currentCycle?.libelleEn;
            const niveauLib = lang === "fr"?currentNiveau?.libelleFr:currentNiveau?.libelleEn;
            setCurrentClasse(sectionLib!+cycleLib!+niveauLib)
        }
        
    }, [selectedEvaluation]);

    // Charger les notes quand une matière est sélectionnée
    useEffect(() => {
        if (selectedEvaluation && selectedMatiere) {
            fetchNotes();
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

    // Vérifier l'anonymat lors de la saisie
    const handleVerifierAnonymat = async () => {
        if (!numeroAnonymat || !selectedEvaluation?._id) return;

        setIsVerifying(true);
        try {
            const result = await apiVerifierAnonymat(numeroAnonymat, selectedEvaluation._id);
            setAnonymatValide(result.valide);
            if (!result.valide) {
                createToast(result.message, "", 2);
            } else {
                createToast(t('label.anonymat_valide'), "", 0);
            }
        } catch (error) {
            setAnonymatValide(false);
            createToast(t('label.anonymat_invalide'), "", 2);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSaisirNote = async () => {
        if (!selectedEvaluation?._id || !selectedMatiere || !numeroAnonymat) {
            createToast(t('error.champs_requis'), "", 2);
            return;
        }

        if (!absent && !note) {
            createToast(t('error.note_requise'), "", 2);
            return;
        }

        if (!anonymatValide) {
            createToast(t('label.verifier_anonymat_dabord'), "", 2);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiSaisirNote({
                evaluation: selectedEvaluation._id,
                matiere: selectedMatiere,
                anonymat:numeroAnonymat,
                note: absent ? 0 : parseFloat(note),
                appreciationFr,
                appreciationEn,
                absent,
                fraude,
                copieBlanche,
                saisiePar:currentUser._id,
                modifiePar:currentUser._id
            });

            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                // Réinitialiser le formulaire
                resetForm();
                // Recharger les notes
                fetchNotes();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsSubmitting(false);
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
    };

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
                        {/* Formulaire de saisie */}
                        <div className="border-t pt-5">
                            <h4 className="font-medium mb-4">{t('label.saisie_note')}</h4>

                            {/* Numéro d'anonymat */}
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium">
                                    {t('label.numero_anonymat')} <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={numeroAnonymat}
                                        onChange={(e) => {
                                            setNumeroAnonymat(e.target.value);
                                            setAnonymatValide(null);
                                        }}
                                        placeholder="AN2024-123456"
                                        disabled={isVerifying}
                                        className="flex-1 rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        onClick={handleVerifierAnonymat}
                                        disabled={isVerifying || !numeroAnonymat}
                                        className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isVerifying && <FaSpinner className="animate-spin" />}
                                        {isVerifying ? "" : t('boutton.verifier')}
                                    </button>
                                </div>
                                {anonymatValide !== null && (
                                    <div className="mt-2 flex items-center gap-2">
                                        {anonymatValide ? (
                                            <>
                                                <FaCheckCircle className="text-green-500" />
                                                <span className="text-green-500">{t('label.anonymat_valide')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle className="text-red-500" />
                                                <span className="text-red-500">{t('label.anonymat_invalide')}</span>
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
                                    type="number"
                                    min="0"
                                    max={selectedEvaluation.noteMax}
                                    step="0.25"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
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