// src/pages/Admin/Evaluations/GestionCoefficientsDiscipline.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    apiSetCoefficientDiscipline,
    getCoefficientDiscipline,
    getLatestCoefficientDiscipline
} from "../../api/api_coefficient_discipline";
import createToast from "../../hooks/toastify";
import {
    setCoefficientDisciplineLoading,
    setCoefficientsDiscipline,
    updateCoefficientDiscipline
} from "../../_redux/features/coefficient_discipline_slice";
import Loading from "../../components/ui/loading";
import { FaSave, FaEdit, FaCheckCircle, FaSpinner, FaInfoCircle } from "react-icons/fa";

const GestionCoefficientsDiscipline = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const pageIsLoading = useSelector((state: RootState) => state.coefficientDisciplineSlice.pageIsLoading);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];

    const [coefficient, setCoefficient] = useState<number>(1);
    const [coefficientEdited, setCoefficientEdited] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedAnnee, setSelectedAnnee] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemestre);
    const [currentClasse, setCurrentClasse] = useState<string>("");
    const [coefficientExists, setCoefficientExists] = useState<boolean>(false);
    const [coefficientId, setCoefficientId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedEvaluation) {
            const currentNiveau = niveaux.find(niveau => niveau._id === selectedEvaluation?.niveau);
            const currentCycle = cycles.find(cycle => cycle._id === currentNiveau?.cycle);
            const currentSection = sections.find(sec => sec._id === currentCycle?.section);
            const sectionLib = lang === "fr" ? currentSection?.libelleFr : currentSection?.libelleEn;
            const cycleLib = lang === "fr" ? currentCycle?.libelleFr : currentCycle?.libelleEn;
            const niveauLib = lang === "fr" ? currentNiveau?.libelleFr : currentNiveau?.libelleEn;
            setCurrentClasse(sectionLib! + cycleLib! + niveauLib);
            
            // Utiliser les valeurs de l'évaluation sélectionnée
            setSelectedAnnee(selectedEvaluation.annee);
            setSelectedSemestre(selectedEvaluation.semestre);
        }
    }, [selectedEvaluation]);

    // Charger le coefficient quand l'évaluation, l'année ou le semestre changent
    useEffect(() => {
        if (selectedEvaluation?.niveau) {
            fetchCoefficient();
        }
    }, [selectedEvaluation, selectedAnnee, selectedSemestre]);

    const fetchCoefficient = async () => {
        if (!selectedEvaluation?.niveau) return;

        dispatch(setCoefficientDisciplineLoading(true));
        try {
            const coef = await getCoefficientDiscipline(
                selectedEvaluation.niveau,
                selectedAnnee,
                selectedSemestre
            );
            
            if (coef && coef._id) {
                setCoefficient(coef.coefficient);
                setCoefficientId(coef._id);
                setCoefficientExists(true);
            } else {
                // Pas de coefficient trouvé, utiliser la valeur par défaut
                setCoefficient(1);
                setCoefficientId(null);
                setCoefficientExists(false);
            }
        } catch (error) {
            // En cas d'erreur, utiliser la valeur par défaut
            setCoefficient(1);
            setCoefficientId(null);
            setCoefficientExists(false);
        } finally {
            dispatch(setCoefficientDisciplineLoading(false));
        }
    };

    const handleSaveCoefficient = async () => {
        if (!selectedEvaluation?.niveau) return;

        const coeffValue = coefficientEdited ?? coefficient;
        if (coeffValue <= 0 || coeffValue > 5) {
            createToast(t('error.coefficient_invalide'), "", 2);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiSetCoefficientDiscipline({
                niveau: selectedEvaluation.niveau,
                annee: selectedAnnee,
                semestre: selectedSemestre,
                coefficient: coeffValue,
                modifiePar: currentUser._id
            });

            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                
                // Mettre à jour l'état local
                setCoefficient(coeffValue);
                setCoefficientEdited(null);
                setIsEditing(false);
                setCoefficientExists(true);
                
                // Rafraîchir le coefficient
                fetchCoefficient();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setCoefficientEdited(coefficient);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCoefficientEdited(null);
    };

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.coefficient_discipline')} />
                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p>{t('select_par_defaut.selectionnez') + t('select_par_defaut.evaluation')}</p>
                </div>
            </>
        );
    }

    const niveau = niveaux.find(n => n._id === selectedEvaluation.niveau);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.coefficient_discipline')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* En-tête */}
                <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">
                        {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {t('label.coefficient_discipline_description')}
                    </p>
                </div>

                {/* Filtres Année/Semestre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-meta-4 rounded">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.annee')}
                        </label>
                        <input
                            type="number"
                            value={selectedAnnee}
                            onChange={(e) => setSelectedAnnee(parseInt(e.target.value))}
                            disabled={isEditing}
                            className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white disabled:bg-gray-200"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.semestre')}
                        </label>
                        <select
                            value={selectedSemestre}
                            onChange={(e) => setSelectedSemestre(parseInt(e.target.value))}
                            disabled={isEditing}
                            className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white disabled:bg-gray-200"
                        >
                            <option value={1}>{t('label.semestre')} 1</option>
                            <option value={2}>{t('label.semestre')} 2</option>
                            <option value={3}>{t('label.semestre')} 3</option>
                        </select>
                    </div>
                </div>

                {/* Carte du coefficient */}
                {pageIsLoading ? (
                    <Loading />
                ) : (
                    <div className="border-2 border-primary rounded-lg p-6 bg-blue-50 dark:bg-blue-900">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-xl font-bold text-primary mb-1">
                                    {t('label.coefficient_discipline')}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : ''} - 
                                    {` ${t('label.annee')} ${selectedAnnee} - ${t('label.semestre')} ${selectedSemestre}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {coefficientExists ? (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-success px-3 py-1 text-sm font-medium text-white">
                                        <FaCheckCircle /> {t('label.configure')}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-warning px-3 py-1 text-sm font-medium text-white">
                                        <FaInfoCircle /> {t('label.non_configure')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-medium">
                                    {t('label.valeur_coefficient')}
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="0.5"
                                        max="5"
                                        step="0.5"
                                        value={coefficientEdited ?? coefficient}
                                        onChange={(e) => setCoefficientEdited(parseFloat(e.target.value))}
                                        disabled={isSubmitting}
                                        className="w-48 rounded border-2 border-primary bg-white py-3 px-4 text-2xl font-bold text-center text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white disabled:bg-gray-200"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="text-5xl font-bold text-primary">
                                        {coefficient}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {t('label.plage_coefficient')} 0.5 - 5
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSaveCoefficient}
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaSave />
                                            )}
                                            {isSubmitting ? t('boutton.enregistrement') : t('boutton.enregistrer')}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-[#6B7280] text-white rounded hover:bg-opacity-90 disabled:bg-[#9CA3AF]"
                                        >
                                            {t('boutton.annuler')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleStartEdit}
                                        disabled={isSubmitting}
                                        className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 flex items-center gap-2 disabled:bg-gray-400"
                                    >
                                        <FaEdit />
                                        {t('boutton.modifier')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Informations complémentaires */}
                        <div className="mt-6 p-4 bg-white dark:bg-boxdark rounded border border-stroke dark:border-strokedark">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                                <FaInfoCircle className="text-blue-500" />
                                {t('label.informations')}
                            </h5>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                <li>• {t('label.coefficient_info_1')}</li>
                                <li>• {t('label.coefficient_info_2')}</li>
                                <li>• {t('label.coefficient_info_3')}</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Guide d'utilisation */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded border border-yellow-200 dark:border-yellow-700">
                    <h5 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                        📋 {t('label.guide_utilisation')}
                    </h5>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="mb-2">{t('label.guide_coefficient_discipline')}</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>{t('label.etape_1_coefficient')}</li>
                            <li>{t('label.etape_2_coefficient')}</li>
                            <li>{t('label.etape_3_coefficient')}</li>
                            <li>{t('label.etape_4_coefficient')}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GestionCoefficientsDiscipline;