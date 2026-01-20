// src/pages/Admin/GestionNotesDiscipline.tsx

import { useEffect, useState, useRef, useCallback } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    getEtudiantsForDiscipline,
    getNotesDisciplineByEvaluation,
    saisieRapideNoteDiscipline
} from "../../api/api_discipline";
import createToast from "../../hooks/toastify";
import {
    setDisciplineLoading,
    setDisciplines
} from "../../_redux/features/discipline_slice";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaPlus, FaMinus } from "react-icons/fa";

const GestionNotesDiscipline = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const { data: { disciplines } } = useSelector((state: RootState) => state.disciplineSlice);
    const pageIsLoading = useSelector((state: RootState) => state.disciplineSlice.pageIsLoading);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    // États principaux
    const [etudiants, setEtudiants] = useState<EtudiantAvecStatutDisciplineType[]>([]);
    const [selectedEtudiant, setSelectedEtudiant] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [appreciationFr, setAppreciationFr] = useState<string>("");
    const [appreciationEn, setAppreciationEn] = useState<string>("");
    const [manquements, setManquements] = useState<ManquementType[]>([]);
    const [bonus, setBonus] = useState<BonusType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loadingEtudiants, setLoadingEtudiants] = useState<boolean>(false);
    const [currentClasse, setCurrentClasse] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredEtudiants, setFilteredEtudiants] = useState<EtudiantAvecStatutDisciplineType[]>([]);

    // Refs
    const noteInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedEvaluation) {
            const currentNiveau = niveaux.find(niveau => niveau._id === selectedEvaluation?.niveau);
            const currentCycle = cycles.find(cycle => cycle._id === currentNiveau?.cycle);
            const currentSection = sections.find(sec => sec._id === currentCycle?.section);
            const sectionLib = lang === "fr" ? currentSection?.libelleFr : currentSection?.libelleEn;
            const cycleLib = lang === "fr" ? currentCycle?.libelleFr : currentCycle?.libelleEn;
            const niveauLib = lang === "fr" ? currentNiveau?.libelleFr : currentNiveau?.libelleEn;
            setCurrentClasse(sectionLib! + cycleLib! + niveauLib);
            
            fetchEtudiants();
            fetchNotesDiscipline();
        }
    }, [selectedEvaluation]);

    // Filtrer les étudiants selon la recherche
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredEtudiants(etudiants);
        } else {
            const filtered = etudiants.filter(e =>
                e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.matricule.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEtudiants(filtered);
        }
    }, [searchTerm, etudiants]);

    const fetchEtudiants = async () => {
        if (!selectedEvaluation?._id) return;

        setLoadingEtudiants(true);
        try {
            const result = await getEtudiantsForDiscipline(selectedEvaluation._id);
            setEtudiants(result.etudiants);
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            setLoadingEtudiants(false);
        }
    };

    const fetchNotesDiscipline = async () => {
        if (!selectedEvaluation?._id) return;

        dispatch(setDisciplineLoading(true));
        try {
            const result = await getNotesDisciplineByEvaluation(selectedEvaluation._id);
            dispatch(setDisciplines(result));
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setDisciplineLoading(false));
        }
    };

    const handleSaisirNote = async () => {
        if (!selectedEvaluation?._id || !selectedEtudiant || !note) {
            createToast(t('error.champs_requis'), "", 2);
            return;
        }

        const noteValue = parseFloat(note);
        if (noteValue < 0 || noteValue > selectedEvaluation.noteMax) {
            createToast(t('error.note_invalide'), "", 2);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await saisieRapideNoteDiscipline({
                evaluation: selectedEvaluation._id,
                etudiant: selectedEtudiant,
                note: noteValue,
                appreciationFr,
                appreciationEn,
                manquements,
                bonus,
                saisiePar: currentUser._id,
                modifiePar: currentUser._id
            });

            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                resetForm();
                fetchEtudiants();
                fetchNotesDiscipline();
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

    const resetForm = () => {
        setSelectedEtudiant("");
        setNote("");
        setAppreciationFr("");
        setAppreciationEn("");
        setManquements([]);
        setBonus([]);
    };

    const handleAddManquement = () => {
        setManquements([...manquements, {
            type: 'RETARD',
            description: '',
            date: new Date(),
            pointsRetires: 0
        }]);
    };

    const handleRemoveManquement = (index: number) => {
        setManquements(manquements.filter((_, i) => i !== index));
    };

    const handleUpdateManquement = (index: number, field: string, value: any) => {
        const updated = [...manquements];
        updated[index] = { ...updated[index], [field]: value };
        setManquements(updated);
    };

    const handleAddBonus = () => {
        setBonus([...bonus, {
            motif: '',
            description: '',
            date: new Date(),
            pointsAjoutes: 0
        }]);
    };

    const handleRemoveBonus = (index: number) => {
        setBonus(bonus.filter((_, i) => i !== index));
    };

    const handleUpdateBonus = (index: number, field: string, value: any) => {
        const updated = [...bonus];
        updated[index] = { ...updated[index], [field]: value };
        setBonus(updated);
    };

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.gestion_discipline')} />
                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p>{t('select_par_defaut.selectionnez') + t('select_par_defaut.evaluation')}</p>
                </div>
            </>
        );
    }

    const etudiantSelectionne = etudiants.find(e => e._id === selectedEtudiant);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.gestion_discipline')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
                <h3 className="font-medium text-lg mb-2">
                    {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                </h3>

                {/* Statistiques rapides */}
                <div className="mb-5 flex gap-4 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded">
                        <span className="font-medium">{t('label.total_etudiants')}: </span>
                        <span className="font-bold">{etudiants.length}</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 px-4 py-2 rounded">
                        <span className="font-medium">{t('label.notes_saisies')}: </span>
                        <span className="font-bold">{etudiants.filter(e => e.aNoteDisc).length}</span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900 px-4 py-2 rounded">
                        <span className="font-medium">{t('label.restants')}: </span>
                        <span className="font-bold">{etudiants.filter(e => !e.aNoteDisc).length}</span>
                    </div>
                </div>

                {/* Formulaire de saisie */}
                <div className="border-t pt-5">
                    <h4 className="font-medium mb-4">{t('label.saisie_note_discipline')}</h4>

                    {/* Recherche et sélection étudiant */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.etudiant')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('label.rechercher_etudiant')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded border border-stroke bg-gray py-3 px-4 mb-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                        <select
                            value={selectedEtudiant}
                            onChange={(e) => setSelectedEtudiant(e.target.value)}
                            disabled={isSubmitting || loadingEtudiants}
                            className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.etudiant')}</option>
                            {filteredEtudiants.map(e => (
                                <option key={e._id} value={e._id}>
                                    {e.matricule} - {e.nom} {e.prenom} {e.aNoteDisc ? '✓' : ''}
                                </option>
                            ))}
                        </select>
                        {etudiantSelectionne?.aNoteDisc && (
                            <p className="text-warning text-sm mt-1">
                                ⚠️ {t('label.note_deja_saisie')}
                            </p>
                        )}
                    </div>

                    {/* Note */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.note')} / {selectedEvaluation.noteMax} <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={noteInputRef}
                            type="number"
                            min="0"
                            max={selectedEvaluation.noteMax}
                            step="0.25"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={isSubmitting}
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
                                className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200"
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
                                className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:bg-gray-200"
                            />
                        </div>
                    </div>

                    {/* Manquements */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">{t('label.manquements')}</label>
                            <button
                                onClick={handleAddManquement}
                                disabled={isSubmitting}
                                className="px-3 py-1 bg-warning text-white rounded hover:bg-opacity-90 flex items-center gap-2 text-sm"
                            >
                                <FaPlus /> {t('boutton.ajouter_manquement')}
                            </button>
                        </div>
                        {manquements.map((m, index) => (
                            <div key={index} className="border border-stroke dark:border-strokedark rounded p-3 mb-2">
                                <div className="grid grid-cols-4 gap-2">
                                    <select
                                        value={m.type}
                                        onChange={(e) => handleUpdateManquement(index, 'type', e.target.value)}
                                        className="rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                    >
                                        <option value="RETARD">{t('label.retard')}</option>
                                        <option value="ABSENCE_INJUSTIFIEE">{t('label.absence_injustifiee')}</option>
                                        <option value="TENUE_INCORRECTE">{t('label.tenue_incorrecte')}</option>
                                        <option value="COMPORTEMENT_INAPPROPRIE">{t('label.comportement_inapproprie')}</option>
                                        <option value="NON_RESPECT_REGLEMENT">{t('label.non_respect_reglement')}</option>
                                        <option value="PERTURBATION_COURS">{t('label.perturbation_cours')}</option>
                                        <option value="FRAUDE">{t('label.fraude')}</option>
                                        <option value="AUTRE">{t('label.autre')}</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder={t('label.description')}
                                        value={m.description}
                                        onChange={(e) => handleUpdateManquement(index, 'description', e.target.value)}
                                        className="col-span-2 rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('label.points_retires')}
                                            value={m.pointsRetires}
                                            onChange={(e) => handleUpdateManquement(index, 'pointsRetires', parseFloat(e.target.value))}
                                            className="w-full rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                        />
                                        <button
                                            onClick={() => handleRemoveManquement(index)}
                                            className="px-2 py-1 bg-danger text-white rounded hover:bg-opacity-90"
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bonus */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">{t('label.bonus')}</label>
                            <button
                                onClick={handleAddBonus}
                                disabled={isSubmitting}
                                className="px-3 py-1 bg-success text-white rounded hover:bg-opacity-90 flex items-center gap-2 text-sm"
                            >
                                <FaPlus /> {t('boutton.ajouter_bonus')}
                            </button>
                        </div>
                        {bonus.map((b, index) => (
                            <div key={index} className="border border-stroke dark:border-strokedark rounded p-3 mb-2">
                                <div className="grid grid-cols-4 gap-2">
                                    <input
                                        type="text"
                                        placeholder={t('label.motif')}
                                        value={b.motif}
                                        onChange={(e) => handleUpdateBonus(index, 'motif', e.target.value)}
                                        className="rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('label.description')}
                                        value={b.description}
                                        onChange={(e) => handleUpdateBonus(index, 'description', e.target.value)}
                                        className="col-span-2 rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('label.points_ajoutes')}
                                            value={b.pointsAjoutes}
                                            onChange={(e) => handleUpdateBonus(index, 'pointsAjoutes', parseFloat(e.target.value))}
                                            className="w-full rounded border border-stroke bg-gray py-2 px-3 text-sm dark:border-strokedark dark:bg-meta-4"
                                        />
                                        <button
                                            onClick={() => handleRemoveBonus(index)}
                                            className="px-2 py-1 bg-danger text-white rounded hover:bg-opacity-90"
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaisirNote}
                            disabled={isSubmitting || !selectedEtudiant}
                            className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && <FaSpinner className="animate-spin" />}
                            {isSubmitting ? t('boutton.enregistrement') : t('boutton.enregistrer')}
                        </button>
                        <button
                            onClick={resetForm}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                        >
                            {t('boutton.reinitialiser')}
                        </button>
                    </div>
                </div>

                {/* Liste des notes saisies */}
                <div className="border-t mt-5 pt-5">
                    <h4 className="font-medium mb-4">{t('label.notes_discipline_saisies')}</h4>
                    {pageIsLoading ? (
                        <Loading />
                    ) : disciplines.length === 0 ? (
                        <p className="text-gray-500">{t('label.aucune_note_discipline')}</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                                            {t('label.matricule')}
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                                            {t('label.nom_prenom')}
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
                                    {disciplines.map((d, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-3 px-4">{d.etudiant.matricule}</td>
                                            <td className="py-3 px-4">{d.etudiant.nom} {d.etudiant.prenom}</td>
                                            <td className="py-3 px-4">{d.note}/{d.noteMax}</td>
                                            <td className="py-3 px-4">
                                                {lang === 'fr' ? d.appreciationFr : d.appreciationEn}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GestionNotesDiscipline;