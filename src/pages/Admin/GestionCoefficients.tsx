//src/pages/Admin/Evaluations/GestionCoefficients.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    apiSetCoefficient,
    getCoefficientsByNiveau
} from "../../api/api_coefficient";
import createToast from "../../hooks/toastify";
import {
    setCoefficientLoading,
    setCoefficients,
    createCoefficient,
    updateCoefficient
} from "../../_redux/features/coefficient_slice";
import Loading from "../../components/ui/loading";
import { FaSave, FaEdit, FaCheckCircle } from "react-icons/fa";
import { getMatieresByNiveau } from "../../api/api_matiere";

const GestionCoefficients = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const { data: { coefficients } } = useSelector((state: RootState) => state.coefficientSlice);
    const pageIsLoading = useSelector((state: RootState) => state.coefficientSlice.pageIsLoading);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    
    const [matieresDisponibles, setMatieresDisponibles] = useState<MatiereType[]>([]);
    const [coefficientsEdited, setCoefficientsEdited] = useState<{ [key: string]: number }>({});
    const [editingMatiere, setEditingMatiere] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedAnnee, setSelectedAnnee] = useState<number>(currentYear);
    const [selectedSemestre, setSelectedSemestre] = useState<number>(currentSemestre);
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
    
    // Charger les matières et coefficients du niveau
    useEffect(() => {
        if (selectedEvaluation?.niveau) {
            fetchMatieresEtCoefficients();
        }
    }, [selectedEvaluation, selectedAnnee, selectedSemestre]);

    const fetchMatieresEtCoefficients = async () => {
        if (!selectedEvaluation?.niveau) return;

        dispatch(setCoefficientLoading(true));
        try {
            // Charger les matières du niveau
            const matieres = await getMatieresByNiveau({
                niveauId: selectedEvaluation.niveau,
                annee: selectedAnnee,
                semestre: selectedSemestre,
                langue: lang
            });
            
            if (matieres) {
                setMatieresDisponibles(matieres.matieres);
            }

            // Charger les coefficients existants
            const coefs = await getCoefficientsByNiveau(
                selectedEvaluation.niveau,
                selectedAnnee,
                selectedSemestre
            );
            dispatch(setCoefficients(coefs));
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setCoefficientLoading(false));
        }
    };

    const getCoefficientValue = (matiereId: string): number => {
        // Vérifier d'abord les modifications en cours
        if (coefficientsEdited[matiereId] !== undefined) {
            return coefficientsEdited[matiereId];
        }
        
        // Sinon chercher dans les coefficients sauvegardés
        const coef = coefficients.find(c => c.matiere._id === matiereId);
        return coef?.coefficient || 1;
    };

    const handleCoefficientChange = (matiereId: string, value: number) => {
        setCoefficientsEdited({
            ...coefficientsEdited,
            [matiereId]: value
        });
    };

    const handleSaveCoefficient = async (matiereId: string) => {
        if (!selectedEvaluation?.niveau) return;

        const coefficient = coefficientsEdited[matiereId];
        if (coefficient === undefined || coefficient <= 0) {
            createToast(t('error.coefficient_invalide'), "", 2);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiSetCoefficient({
                matiere: matiereId,
                niveau: selectedEvaluation.niveau,
                annee: selectedAnnee,
                semestre: selectedSemestre,
                coefficient,
                modifiePar:currentUser._id
            });

            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                
                // Mettre à jour le store
                const existingCoef = coefficients.find(c => c.matiere._id === matiereId);
                if (existingCoef?._id) {
                    dispatch(updateCoefficient({
                        id: existingCoef._id,
                        coefficientData: { coefficient }
                    }));
                } else {
                    dispatch(createCoefficient({
                        coefficient: response.data
                    }));
                }
                
                // Retirer de l'édition
                const newEdited = { ...coefficientsEdited };
                delete newEdited[matiereId];
                setCoefficientsEdited(newEdited);
                setEditingMatiere(null);
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveAllCoefficients = async () => {
        const matiereIds = Object.keys(coefficientsEdited);
        if (matiereIds.length === 0) {
            createToast(t('error.aucune_modification'), "", 1);
            return;
        }

        setIsSubmitting(true);
        try {
            for (const matiereId of matiereIds) {
                await handleSaveCoefficient(matiereId);
            }
            createToast(t('message.coefficients_enregistres'), '', 0);
        } catch (error) {
            createToast(t('message.erreur'), '', 2);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.coefficients')} />
                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p>{t('select_par_defaut.selectionnez') + t('select_par_defaut.evaluation')}</p>
                </div>
            </>
        );
    }

    const niveau = niveaux.find(n => n._id === selectedEvaluation.niveau);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.coefficients')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* En-tête */}
                <div className="mb-6">
                    {/* <h3 className="font-medium text-lg mb-2">
                        {t('label.gestion_coefficients')}
                    </h3> */}
                    <h3 className="font-medium text-lg mb-2">
                        {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                    </h3>
                </div>

                {/* Filtres Année/Semestre */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-meta-4 rounded">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.annee')}
                        </label>
                        <input
                            type="number"
                            value={selectedAnnee}
                            onChange={(e) => setSelectedAnnee(parseInt(e.target.value))}
                            className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('label.semestre')}
                        </label>
                        <select
                            value={selectedSemestre}
                            onChange={(e) => setSelectedSemestre(parseInt(e.target.value))}
                            className="w-full rounded border border-stroke bg-white py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
                        >
                            <option value={1}>{t('label.semestre')} 1</option>
                            <option value={2}>{t('label.semestre')} 2</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSaveAllCoefficients}
                            disabled={isSubmitting || Object.keys(coefficientsEdited).length === 0}
                            className="w-full px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                            <FaSave />
                            {t('boutton.tout_enregistrer')}
                        </button>
                    </div>
                </div>

                {/* Table des coefficients */}
                {pageIsLoading ? (
                    <Loading />
                ) : matieresDisponibles.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        {t('label.aucune_matiere')}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.matiere')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.coefficient')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.statut')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {matieresDisponibles.map((matiere, index) => {
                                    const isEditing = editingMatiere === matiere._id;
                                    const hasChanges = coefficientsEdited[matiere._id!] !== undefined;
                                    const currentCoef = getCoefficientValue(matiere._id!);

                                    return (
                                        <tr key={matiere._id} className="border-b dark:border-strokedark">
                                            <td className="py-4 px-4">
                                                <p className="font-medium">
                                                    {lang === 'fr' ? matiere.libelleFr : matiere.libelleEn}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {matiere.code}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        min="0.5"
                                                        max="10"
                                                        step="0.5"
                                                        value={currentCoef}
                                                        onChange={(e) => handleCoefficientChange(matiere._id!, parseFloat(e.target.value))}
                                                        className="w-24 rounded border border-stroke bg-gray py-2 px-3 text-center text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className={`font-medium ${hasChanges ? 'text-primary' : ''}`}>
                                                        {currentCoef}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {hasChanges ? (
                                                    <span className="inline-flex rounded-full bg-warning px-3 py-1 text-xs font-medium text-white">
                                                        {t('label.modifie')}
                                                    </span>
                                                ) : (
                                                    <FaCheckCircle className="text-success text-xl mx-auto" />
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {isEditing ? (
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleSaveCoefficient(matiere._id!)}
                                                            disabled={isSubmitting}
                                                            className="px-4 py-2 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                                                        >
                                                            <FaSave />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMatiere(null);
                                                                const newEdited = { ...coefficientsEdited };
                                                                delete newEdited[matiere._id!];
                                                                setCoefficientsEdited(newEdited);
                                                            }}
                                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                                                        >
                                                            {t('boutton.annuler')}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setEditingMatiere(matiere._id!)}
                                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 flex items-center gap-2 mx-auto"
                                                    >
                                                        <FaEdit />
                                                        {t('boutton.modifier')}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Aide */}
                {/* <div className="mt-6 p-4 bg-blue-50 dark:bg-meta-4 rounded">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>{t('label.note')}:</strong> {t('help.coefficients_info')}
                    </p>
                </div> */}
            </div>
        </>
    );
};

export default GestionCoefficients;