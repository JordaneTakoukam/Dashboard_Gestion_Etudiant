//src/pages/Admin/Evaluations/AffichageResultats.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    getResultatsDetailles,
    getMesResultatsDetailles,
    apiDelibererEvaluation,
    apiPublierResultats,
    apiVerrouillerNotes,
    exporterResultatsExcel,
    exporterResultatsPDF
} from "../../api/api_note";
import createToast from "../../hooks/toastify";
import {
    setResultatLoading,
    setResultatsDetailles,
    setMesResultatsDetailles,
    clearResultats
} from "../../_redux/features/resultat_slice";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaDownload, FaChartBar, FaSpinner, FaFilePdf } from "react-icons/fa";
import { config } from "../../config";
import { updateEvaluationStatut } from "../../_redux/features/evaluation_slice";

const AffichageResultats = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    
    const { data: { resultatsDetailles, mesResultatsDetailles } } = useSelector((state: RootState) => state.resultatSlice);
    const pageIsLoading = useSelector((state: RootState) => state.resultatSlice.pageIsLoading);
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isDeliberating, setIsDeliberating] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isLocking, setIsLocking] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showStats, setShowStats] = useState<boolean>(true);

    const isEtudiant = currentUser.role === roles.etudiant;
    const isAdmin = currentUser.role === roles.admin || currentUser.role === roles.superAdmin;
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const [currentClasse, setCurrentClasse] = useState<string>("")

    // Charger les résultats
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
        if (selectedEvaluation?._id) {
            if (isEtudiant) {
                fetchMesResultatsDetailles();
            } else {
                fetchResultatsDetailles();
            }
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearResultats());
        };
    }, [selectedEvaluation]);

    const fetchResultatsDetailles = async () => {
        if (!selectedEvaluation?._id) return;

        dispatch(setResultatLoading(true));
        try {
            const result = await getResultatsDetailles(selectedEvaluation._id);
            dispatch(setResultatsDetailles({ resultats: result }));
        } catch (error: any) {
            if (error.response?.status === 403) {
                createToast(t('error.evaluation_non_publiee'), "", 1);
            } else {
                createToast(t('message.erreur'), "", 2);
            }
        } finally {
            dispatch(setResultatLoading(false));
        }
    };

    const fetchMesResultatsDetailles = async () => {
        if (!selectedEvaluation?._id) return;

        dispatch(setResultatLoading(true));
        try {
            const result = await getMesResultatsDetailles(selectedEvaluation._id, currentUser._id);
            dispatch(setMesResultatsDetailles({ resultats: result }));
        } catch (error: any) {
            if (error.response?.status === 403) {
                createToast(t('error.resultats_non_publies'), "", 1);
            } else {
                createToast(t('message.erreur'), "", 2);
            }
        } finally {
            dispatch(setResultatLoading(false));
        }
    };

    const handleDeliberer = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.deliberer_evaluation'))) {
            return;
        }

        setIsProcessing(true);
        setIsDeliberating(true);
        try {
            const response = await apiDelibererEvaluation(selectedEvaluation._id, currentUser._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                dispatch(updateEvaluationStatut({
                    id: selectedEvaluation._id,
                    statut: 'DELIBERATION'
                }));
                fetchResultatsDetailles();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsProcessing(false);
            setIsDeliberating(false);
        }
    };

    const handlePublier = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.publier_resultats'))) {
            return;
        }

        setIsProcessing(true);
        setIsPublishing(true);
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
            setIsPublishing(false);
        }
    };

    const handleVerrouiller = async () => {
        if (!selectedEvaluation?._id) return;

        if (!window.confirm(t('confirm.verrouiller_notes'))) {
            return;
        }

        setIsProcessing(true);
        setIsLocking(true);
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
            setIsLocking(false);
        }
    };

    const handleExportExcel = async () => {
        if (!selectedEvaluation?._id) return;

        setIsExporting(true);
        try {
            const blob = await exporterResultatsExcel(selectedEvaluation._id, currentClasse);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Resultats_${lang === 'fr' ? selectedEvaluation.libelleFr : selectedEvaluation.libelleEn}_${new Date().getTime()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            createToast(t('message.export_reussi'), '', 0);
        } catch (error) {
            createToast(t('message.erreur_export'), '', 2);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        if (!selectedEvaluation?._id) return;

        setIsExportingPDF(true);
        try {
            const blob = await exporterResultatsPDF(selectedEvaluation._id, currentClasse);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Resultats_${lang === 'fr' ? selectedEvaluation.libelleFr : selectedEvaluation.libelleEn}_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            createToast(t('message.export_reussi'), '', 0);
        } catch (error) {
            console.error('Erreur export PDF:', error);
            createToast(t('message.erreur_export'), '', 2);
        } finally {
            setIsExportingPDF(false);
        }
    };

    const filteredResultats = resultatsDetailles?.resultats.filter(r =>
        r.etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.etudiant.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.resultats')} />
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

                    {pageIsLoading ? (
                        <Loading />
                    ) : mesResultatsDetailles ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Moyenne générale */}
                            <div className="bg-primary bg-opacity-10 rounded-lg p-6 mb-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {t('label.moyenne_generale')}
                                </p>
                                <p className={`text-5xl font-bold ${mesResultatsDetailles.moyenne && mesResultatsDetailles.moyenne >= 10 ? 'text-success' : 'text-danger'}`}>
                                    {mesResultatsDetailles.moyenne !== null ? mesResultatsDetailles.moyenne.toFixed(2) : '-'}
                                    <span className="text-2xl">/{mesResultatsDetailles.evaluation.noteMax}</span>
                                </p>
                                {mesResultatsDetailles.moyenne !== null && (
                                    <>
                                        <p className={`mt-2 font-medium ${mesResultatsDetailles.admis ? 'text-success' : 'text-danger'}`}>
                                            {mesResultatsDetailles.admis ? t('label.admis') : t('label.non_admis')}
                                        </p>
                                        {mesResultatsDetailles.rang && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {t('label.rang')}: {mesResultatsDetailles.rang} / {mesResultatsDetailles.totalEtudiants}
                                            </p>
                                        )}
                                    </>
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
                                        {mesResultatsDetailles.notes.map((note, index) => (
                                            <tr key={index} className="border-b dark:border-strokedark">
                                                <td className="py-4 px-4">
                                                    <p className="font-medium">
                                                        {lang === 'fr' ? note.matiere.libelleFr : note.matiere.libelleEn}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{note.matiere.code}</p>
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
                                                            note.noteRamenee20 >= 10 ? 'text-success' : 'text-danger'
                                                        }`}>
                                                            {note.noteRamenee20.toFixed(2)}/20
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
                                        {/* Affichage de la note de discipline pour l'étudiant */}
                                        {mesResultatsDetailles.noteDiscipline && (
                                            <tr className="border-b dark:border-strokedark bg-blue-50 dark:bg-meta-4">
                                                <td className="py-4 px-4">
                                                    <p className="font-medium">
                                                        {t('label.discipline')}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    {mesResultatsDetailles.noteDiscipline.coefficient}
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`font-bold text-lg ${
                                                        mesResultatsDetailles.noteDiscipline.noteRamenee20 >= 10 ? 'text-success' : 'text-danger'
                                                    }`}>
                                                        {mesResultatsDetailles.noteDiscipline.noteRamenee20.toFixed(2)}/20
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {lang === 'fr' ? mesResultatsDetailles.noteDiscipline.appreciationFr : mesResultatsDetailles.noteDiscipline.appreciationEn}
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
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
    const stats = resultatsDetailles?.statistiques;

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.resultats_evaluations')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-medium text-lg mb-2">
                            {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
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
                                className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isDeliberating && <FaSpinner className="animate-spin" />}
                                {isDeliberating ? "" : t('boutton.deliberer')}
                            </button>
                        )}
                        {selectedEvaluation.statut === 'DELIBERATION' && (
                            <button
                                onClick={handlePublier}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isPublishing ? <FaSpinner className="animate-spin" /> : <FaEye />}
                                {isPublishing ? "" : t('boutton.publier_resultats')}
                            </button>
                        )}
                        {selectedEvaluation.statut === 'PUBLIEE' && !selectedEvaluation.notesVerrouillees && (
                            <button
                                onClick={handleVerrouiller}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-danger text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLocking ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                {isLocking ? "" : t('boutton.verrouiller_notes')}
                            </button>
                        )}
                        {resultatsDetailles && (
                            <>
                                <button
                                    onClick={handleExportExcel}
                                    disabled={isExporting}
                                    className="px-6 py-3 bg-warning text-white rounded hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                                    {isExporting ? "" : t('boutton.exporter_excel')}
                                </button>
                                
                                <button
                                    onClick={handleExportPDF}
                                    disabled={isExportingPDF}
                                    className="px-6 py-3 bg-[#DC2626] text-[#FFFFFF] rounded hover:bg-opacity-90 disabled:bg-[#9CA3AF] disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isExportingPDF ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
                                    {isExportingPDF ? "" : t('boutton.exporter_pdf')}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-opacity-90 flex items-center gap-2"
                        >
                            <FaChartBar />
                            {showStats ? t('boutton.masquer_stats') : t('boutton.afficher_stats')}
                        </button>
                    </div>
                )}

                {/* Statistiques */}
                {showStats && stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.moyenne')}</p>
                            <p className="text-2xl font-bold text-primary">{stats.moyenneClasse?.toFixed(2) || '-'}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.maximum')}</p>
                            <p className="text-2xl font-bold text-success">{stats.moyenneMax?.toFixed(2) || '-'}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.minimum')}</p>
                            <p className="text-2xl font-bold text-danger">{stats.moyenneMin?.toFixed(2) || '-'}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.admis')}</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.nombreAdmis}/{stats.nombreMoyennesCalculees}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-meta-4 rounded p-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('label.taux_reussite')}</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.tauxReussite?.toFixed(1) || '-'}%</p>
                        </div>
                    </div>
                )}

                {/* Liste des résultats */}
                {pageIsLoading ? (
                    <Loading />
                ) : !resultatsDetailles || resultatsDetailles.resultats.length === 0 ? (
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
                                        {t('label.matricule')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.nom')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.prenom')}
                                    </th>
                                    {resultatsDetailles.evaluation.matieres.map((matiere) => (
                                        <th key={matiere._id} className="py-4 px-2 font-medium text-black dark:text-white text-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs">{lang==="fr"?matiere.libelleFr:matiere.libelleEn}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    (Coef {matiere.coefficient})
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                    {/* Colonne discipline */}
                                    {resultatsDetailles.evaluation.coefficientDiscipline && resultatsDetailles.evaluation.coefficientDiscipline > 0 && (
                                        <th className="py-4 px-2 font-medium text-black dark:text-white text-center bg-blue-50 dark:bg-blue-900">
                                            <div className="flex flex-col">
                                                <span className="text-xs">{t('label.discipline')}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    (Coef {resultatsDetailles.evaluation.coefficientDiscipline})
                                                </span>
                                            </div>
                                        </th>
                                    )}
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center bg-gray-100 dark:bg-gray-800">
                                        {t('label.total_note_coef')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center bg-gray-100 dark:bg-gray-800">
                                        {t('label.total_coef')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                        {t('label.moyenne')}
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                        {t('label.rang')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResultats.map((item) => (
                                    <tr key={item.etudiant._id} className="border-b dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm">
                                                {item.etudiant.matricule || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-medium">
                                                {item.etudiant.nom}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-medium">
                                                {item.etudiant.prenom}
                                            </span>
                                        </td>
                                        {/* Notes des matières */}
                                        {resultatsDetailles.evaluation.matieres.map((matiere) => {
                                            const note = item.notesMatieres?.find(n => n.matiere._id === matiere._id);
                                            return (
                                                <td key={matiere._id} className="py-4 px-2 text-center">
                                                    {note ? (
                                                        note.absent ? (
                                                            <span className="text-danger font-medium">ABS</span>
                                                        ) : note.fraude ? (
                                                            <span className="text-danger font-medium">FRD</span>
                                                        ) : (
                                                            <span className={`font-semibold ${
                                                                note.noteRamenee20 >= 10 ? 'text-success' : 'text-danger'
                                                            }`}>
                                                                {note.noteRamenee20.toFixed(2)}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {/* Note de discipline */}
                                        {resultatsDetailles.evaluation.coefficientDiscipline && resultatsDetailles.evaluation.coefficientDiscipline > 0 && (
                                            <td className="py-4 px-2 text-center bg-blue-50 dark:bg-blue-900">
                                                {item.noteDiscipline ? (
                                                    <span className={`font-semibold ${
                                                        item.noteDiscipline.noteRamenee20 >= 10 ? 'text-success' : 'text-danger'
                                                    }`}>
                                                        {item.noteDiscipline.noteRamenee20.toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        )}
                                        <td className="py-4 px-4 text-center bg-gray-50 dark:bg-gray-800">
                                            <span className="font-bold">
                                                {item.totalPoints > 0 ? item.totalPoints.toFixed(2) : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center bg-gray-50 dark:bg-gray-800">
                                            <span className="font-bold">
                                                {item.totalCoefficients > 0 ? item.totalCoefficients : '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {item.moyenne !== null ? (
                                                <span className={`text-xl font-bold px-3 py-1 rounded ${
                                                    item.moyenne >= 10 
                                                        ? 'bg-success text-white' 
                                                        : 'bg-danger text-white'
                                                }`}>
                                                    {item.moyenne.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`font-bold text-lg ${
                                                item.rang === 1 ? 'text-yellow-500' :
                                                item.rang === 2 ? 'text-gray-400' :
                                                item.rang === 3 ? 'text-orange-600' :
                                                'text-primary'
                                            }`}>
                                                {item.rang || '-'}
                                            </span>
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

export default AffichageResultats;