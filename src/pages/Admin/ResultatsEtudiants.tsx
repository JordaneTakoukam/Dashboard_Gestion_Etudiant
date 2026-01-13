//src/pages/Admin/Evaluations/ResultatsEtudiants.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    calculerMoyennes,
    getMesNotes,
    apiDelibererEvaluation,
    apiPublierResultats,
    apiVerrouillerNotes
} from "../../api/api_note";
import createToast from "../../hooks/toastify";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaLock, FaUnlock, FaEye } from "react-icons/fa";
import { config } from "../../config";
import { updateEvaluationStatut } from "../../_redux/features/evaluation_slice";

const ResultatsEtudiants = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    
    const [moyennes, setMoyennes] = useState<MoyenneEtudiantType[]>([]);
    const [mesNotes, setMesNotes] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showStats, setShowStats] = useState<boolean>(true);

    const isEtudiant = currentUser.role === roles.etudiant;
    const isAdmin = currentUser.role === roles.admin || currentUser.role === roles.superAdmin;

    // Charger les résultats
    useEffect(() => {
        if (selectedEvaluation?._id) {
            if (isEtudiant) {
                fetchMesNotes();
            } else {
                fetchMoyennes();
            }
        }
    }, [selectedEvaluation]);

    const fetchMoyennes = async () => {
        if (!selectedEvaluation?._id) return;

        setIsLoading(true);
        try {
            const result = await calculerMoyennes(selectedEvaluation._id);
            
            setMoyennes(result);
        } catch (error: any) {
            if (error.response?.status === 403) {
                createToast(t('error.evaluation_non_publiee'), "", 1);
            } else {
                createToast(t('message.erreur'), "", 2);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMesNotes = async () => {
        if (!selectedEvaluation?._id) return;

        setIsLoading(true);
        try {
            const result = await getMesNotes(selectedEvaluation._id);
            setMesNotes(result);
        } catch (error: any) {
            if (error.response?.status === 403) {
                createToast(t('error.resultats_non_publies'), "", 1);
            } else {
                createToast(t('message.erreur'), "", 2);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeliberer = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.deliberer_evaluation'))) {
            return;
        }

        setIsProcessing(true);
        try {
            const response = await apiDelibererEvaluation(selectedEvaluation._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                dispatch(updateEvaluationStatut({
                    id: selectedEvaluation._id,
                    statut: 'DELIBERATION'
                }));
                fetchMoyennes();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePublier = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.publier_resultats'))) {
            return;
        }

        setIsProcessing(true);
        try {
            const response = await apiPublierResultats(selectedEvaluation._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                dispatch(updateEvaluationStatut({
                    id: selectedEvaluation._id,
                    statut: 'PUBLIEE'
                }));
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerrouiller = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.verrouiller_notes'))) {
            return;
        }

        setIsProcessing(true);
        try {
            const response = await apiVerrouillerNotes(selectedEvaluation._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                dispatch(updateEvaluationStatut({
                    id: selectedEvaluation._id,
                    statut: 'VERROUILEE'
                }));
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsProcessing(false);
        }
    };

    // Statistiques
    const calculerStatistiques = () => {
        const notesValides = moyennes.filter(m => m.moyenne !== null).map(m => m.moyenne!);
        if (notesValides.length === 0) return null;

        const moyenne = notesValides.reduce((a, b) => a + b, 0) / notesValides.length;
        const max = Math.max(...notesValides);
        const min = Math.min(...notesValides);
        const admis = notesValides.filter(n => n >= 10).length;
        const tauxReussite = (admis / notesValides.length) * 100;

        return { moyenne, max, min, admis, total: notesValides.length, tauxReussite };
    };

    const stats = calculerStatistiques();

    const filteredMoyennes = moyennes.filter(m =>
        m.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.etudiant.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.resultats_evaluations')} />
                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <p>{t('select_par_defaut.selectionnez') + t('select_par_defaut.evaluation')}</p>
                </div>
            </>
        );
    }

    // Vue étudiant
    if (isEtudiant) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.mes_resultats')} />

                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h3 className="font-medium text-lg mb-4">
                        {lang === 'fr' ? selectedEvaluation.libelleFr : selectedEvaluation.libelleEn}
                    </h3>

                    {isLoading ? (
                        <Loading />
                    ) : mesNotes ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Moyenne générale */}
                            <div className="bg-primary bg-opacity-10 rounded-lg p-6 mb-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {t('label.moyenne_generale')}
                                </p>
                                <p className={`text-5xl font-bold ${mesNotes.moyenne >= 10 ? 'text-success' : 'text-danger'}`}>
                                    {mesNotes.moyenne !== null ? mesNotes.moyenne.toFixed(2) : '-'}
                                    <span className="text-2xl">/{selectedEvaluation.noteMax}</span>
                                </p>
                                {mesNotes.moyenne !== null && (
                                    <p className={`mt-2 font-medium ${mesNotes.moyenne >= 10 ? 'text-success' : 'text-danger'}`}>
                                        {mesNotes.moyenne >= 10 ? t('label.admis') : t('label.non_admis')}
                                    </p>
                                )}
                            </div>

                            {/* Notes par matière */}
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
                                                {t('label.note')}
                                            </th>
                                            <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                                {t('label.appreciation')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mesNotes.notes.map((note: any, index: number) => (
                                            <tr key={index} className="border-b dark:border-strokedark">
                                                <td className="py-4 px-4">
                                                    <p className="font-medium">
                                                        {lang === 'fr' ? note.matiere.libelleFr : note.matiere.libelleEn}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {note.coefficient}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {note.absent ? (
                                                        <span className="text-danger font-medium">
                                                            {t('label.absent')}
                                                        </span>
                                                    ) : note.fraude ? (
                                                        <span className="text-danger font-medium">
                                                            {t('label.fraude')}
                                                        </span>
                                                    ) : (
                                                        <span className={`font-bold text-lg ${
                                                            note.note >= note.noteMax / 2 ? 'text-success' : 'text-danger'
                                                        }`}>
                                                            {note.note.toFixed(2)}/{note.noteMax}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {lang === 'fr' ? note.appreciationFr : note.appreciationEn}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaTimesCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                {selectedEvaluation.statut === 'PUBLIEE' 
                                    ? t('label.resultats_non_disponibles')
                                    : t('label.resultats_pas_encore_publies')}
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    // Vue admin
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.resultats_evaluations')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-medium text-lg mb-2">
                            {lang === 'fr' ? selectedEvaluation.libelleFr : selectedEvaluation.libelleEn}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-2 ${
                                selectedEvaluation.statut === 'PUBLIEE' ? 'text-success' : 'text-warning'
                            }`}>
                                {selectedEvaluation.statut === 'PUBLIEE' ? <FaCheckCircle /> : <FaTimesCircle />}
                                {t(`label.${selectedEvaluation.statut.toLowerCase()}`)}
                            </span>
                            {selectedEvaluation.notesVerrouillees && (
                                <span className="flex items-center gap-2 text-danger">
                                    <FaLock />
                                    {t('label.verrouille')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions admin */}
                {isAdmin && (
                    <div className="flex flex-wrap gap-3 mb-6">
                        {selectedEvaluation.statut === 'CORRECTION' && (
                            <button
                                onClick={handleDeliberer}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                            >
                                {t('boutton.deliberer')}
                            </button>
                        )}
                        {selectedEvaluation.statut === 'DELIBERATION' && (
                            <button
                                onClick={handlePublier}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 flex items-center gap-2"
                            >
                                <FaEye />
                                {t('boutton.publier_resultats')}
                            </button>
                        )}
                        {selectedEvaluation.statut === 'PUBLIEE' && !selectedEvaluation.notesVerrouillees && (
                            <button
                                onClick={handleVerrouiller}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-danger text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 flex items-center gap-2"
                            >
                                <FaLock />
                                {t('boutton.verrouiller_notes')}
                            </button>
                        )}
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-opacity-90"
                        >
                            {showStats ? t('boutton.masquer_stats') : t('boutton.afficher_stats')}
                        </button>
                    </div>
                )}

                {/* Statistiques */}
                {showStats && stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.moyenne')}</p>
                            <p className="text-2xl font-bold text-primary">{stats.moyenne.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.maximum')}</p>
                            <p className="text-2xl font-bold text-success">{stats.max.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.minimum')}</p>
                            <p className="text-2xl font-bold text-danger">{stats.min.toFixed(2)}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.admis')}</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.admis}/{stats.total}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.taux_reussite')}</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.tauxReussite.toFixed(1)}%</p>
                        </div>
                    </div>
                )}

                {/* Recherche */}
                {moyennes.length > 0 && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={t('recherche.rechercher_etudiant')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-96 rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                    </div>
                )}

                {/* Liste des résultats */}
                {isLoading ? (
                    <Loading />
                ) : moyennes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('label.aucun_resultat')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        #
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.matricule')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.nom_prenom')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.moyenne')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.resultat')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMoyennes.map((item, index) => (
                                    <tr key={item.etudiant._id} className="border-b dark:border-strokedark">
                                        <td className="py-4 px-4">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono">
                                                {item.etudiant.matricule}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium">
                                                {item.etudiant.nom} {item.etudiant.prenom}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {item.moyenne !== null ? (
                                                <span className={`text-xl font-bold ${
                                                    item.moyenne >= 10 ? 'text-success' : 'text-danger'
                                                }`}>
                                                    {item.moyenne.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {item.moyenne !== null && (
                                                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                                    item.moyenne >= 10 ? 'bg-success text-white' : 'bg-danger text-white'
                                                }`}>
                                                    {item.moyenne >= 10 ? t('label.admis') : t('label.non_admis')}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default ResultatsEtudiants;