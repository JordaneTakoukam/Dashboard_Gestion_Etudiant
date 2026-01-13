//src/pages/Admin/Evaluations/GestionAnonymats.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import {
    apiGenererAnonymats,
    getNumerosAnonymatsByEvaluation,
    getMonAnonymat,
    getAnonymatsByEvaluation
} from "../../api/api_anonymat";
import createToast from "../../hooks/toastify";
import Loading from "../../components/ui/loading";
import { FaCheckCircle, FaTimesCircle, FaDownload, FaPrint } from "react-icons/fa";
import { config } from "../../config";
import { updateEvaluationStatut } from "../../_redux/features/evaluation_slice";

const GestionAnonymats = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const selectedEvaluation = useSelector((state: RootState) => state.evaluationSlice.selectedEvaluation);
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    
    const [anonymats, setAnonymats] = useState<AnonymatType[]>([]);
    const [monAnonymat, setMonAnonymat] = useState<AnonymatType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const isEtudiant = currentUser.role === roles.etudiant;
    const isAdmin = currentUser.role === roles.admin || currentUser.role === roles.superAdmin;
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

    // Charger les anonymats
    useEffect(() => {
        if (selectedEvaluation?._id) {
            if (isEtudiant) {
                fetchMonAnonymat();
            } else {
                fetchAnonymats();
            }
        }
    }, [selectedEvaluation, currentPage]);

    const fetchAnonymats = async () => {
        if (!selectedEvaluation?._id) return;

        setIsLoading(true);
        try {
            const result = await getAnonymatsByEvaluation(
                selectedEvaluation._id,
                currentPage,
                50
            );
            setAnonymats(result.anonymats);
            setTotalPages(result.totalPages);
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMonAnonymat = async () => {
        if (!selectedEvaluation?._id) return;

        setIsLoading(true);
        try {
            const result = await getMonAnonymat(selectedEvaluation._id);
            setMonAnonymat(result);
        } catch (error: any) {
            if (error.response?.status === 404) {
                createToast(t('label.anonymat_non_genere'), "", 1);
            } else {
                createToast(t('message.erreur'), "", 2);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenererAnonymats = async () => {
        if (!selectedEvaluation?._id) return;

        if (selectedEvaluation.anonymatsGeneres) {
            if (!window.confirm(t('confirm.regenerer_anonymats'))) {
                return;
            }
        }

        setIsGenerating(true);
        try {
            const response = await apiGenererAnonymats(selectedEvaluation._id);
            if (response.success) {
                createToast(response.message[lang as keyof typeof response.message], '', 0);
                // Mettre à jour l'évaluation
                dispatch(updateEvaluationStatut({
                    id: selectedEvaluation._id,
                    statut: 'PROGRAMMEE'
                }));
                // Recharger les anonymats
                fetchAnonymats();
            } else {
                createToast(response.message[lang as keyof typeof response.message], '', 2);
            }
        } catch (error: any) {
            createToast(error.response?.data?.message?.[lang] || t('message.erreur'), '', 2);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportAnonymats = () => {
        if (anonymats.length === 0) return;

        const csvContent = [
            ['Numéro Anonymat', 'Statut', 'Date Génération'].join(','),
            ...anonymats.map(a => [
                a.numeroAnonymat,
                a.statut,
                new Date(a.dateGeneration!).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anonymats_${selectedEvaluation?.libelleFr}_${new Date().getTime()}.csv`;
        a.click();
    };

    const handlePrintAnonymat = () => {
        if (!monAnonymat) return;
        
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${t('label.mon_anonymat')}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 40px; }
                            .header { text-align: center; margin-bottom: 40px; }
                            .anonymat-card { border: 2px solid #000; padding: 30px; text-align: center; }
                            .numero { font-size: 32px; font-weight: bold; margin: 20px 0; }
                            .info { margin: 10px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${lang === 'fr' ? selectedEvaluation?.libelleFr : selectedEvaluation?.libelleEn}</h1>
                        </div>
                        <div class="anonymat-card">
                            <h2>${t('label.numero_anonymat')}</h2>
                            <div class="numero">${monAnonymat.numeroAnonymat}</div>
                            <div class="info">${t('label.date_generation')}: ${new Date(monAnonymat.dateGeneration!).toLocaleDateString()}</div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const filteredAnonymats = anonymats.filter(a =>
        a.numeroAnonymat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!selectedEvaluation) {
        return (
            <>
                <Breadcrumb pageName={t('sub_menu.gestion_anonymats')} />
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
                <Breadcrumb pageName={t('sub_menu.mon_anonymat')} />

                <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h3 className="font-medium text-lg mb-2">
                        {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                    </h3>

                    {isLoading ? (
                        <Loading />
                    ) : monAnonymat ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="border-2 border-primary rounded-lg p-8 text-center bg-gray-50 dark:bg-meta-4">
                                <h4 className="text-xl font-semibold mb-6">
                                    {t('label.votre_numero_anonymat')}
                                </h4>
                                <div className="bg-white dark:bg-boxdark p-6 rounded border-2 border-dashed border-primary mb-6">
                                    <p className="text-4xl font-bold text-primary mb-2">
                                        {monAnonymat.numeroAnonymat}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {t('label.date_generation')}: {new Date(monAnonymat.dateGeneration!).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <button
                                    onClick={handlePrintAnonymat}
                                    className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 flex items-center gap-2 mx-auto"
                                >
                                    <FaPrint />
                                    {t('boutton.imprimer')}
                                </button>

                                <div className="mt-6 p-4 bg-yellow-50 dark:bg-meta-4 rounded text-left">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>{t('label.important')}:</strong>
                                    </p>
                                    <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 dark:text-gray-300">
                                        <li>{t('help.anonymat_copie')}</li>
                                        <li>{t('help.anonymat_confidentiel')}</li>
                                        <li>{t('help.anonymat_verification')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaTimesCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('label.anonymat_pas_encore_genere')}
                            </p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    // Vue admin/enseignant
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.gestion_anonymats')} />

            <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-medium text-lg mb-2">
                            {lang === 'fr' ? `${selectedEvaluation.libelleFr} (${currentClasse})` : `${selectedEvaluation.libelleEn} (${currentClasse})`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('label.date_epreuve')}: {selectedEvaluation.dateEpreuve ? new Date(selectedEvaluation.dateEpreuve).toLocaleDateString() : '-'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedEvaluation.anonymatsGeneres ? (
                            <span className="flex items-center gap-2 text-green-500">
                                <FaCheckCircle />
                                {t('label.anonymats_generes')}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-red-500">
                                <FaTimesCircle />
                                {t('label.anonymats_non_generes')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {isAdmin && (
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={handleGenererAnonymats}
                            disabled={isGenerating}
                            className="px-6 py-3 bg-primary text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                        >
                            {isGenerating ? t('boutton.generation') : (selectedEvaluation.anonymatsGeneres ? t('boutton.regenerer_anonymats') : t('boutton.generer_anonymats'))}
                        </button>
                        {/* {anonymats.length > 0 && (
                            <button
                                onClick={handleExportAnonymats}
                                className="px-6 py-3 bg-success text-white rounded hover:bg-opacity-90 flex items-center gap-2"
                            >
                                <FaDownload />
                                {t('boutton.exporter_csv')}
                            </button>
                        )} */}
                    </div>
                )}

                {/* Recherche */}
                {/* {anonymats.length > 0 && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={t('recherche.rechercher')+t('recherche.anonymat')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-96 rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                    </div>
                )} */}

                {/* Liste des anonymats */}
                {isLoading ? (
                    <Loading />
                ) : anonymats.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('label.aucun_anonymat')}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                            #
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                            {t('label.etudiant')}
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white text-left">
                                            {t('label.numero_anonymat')}
                                        </th>
                                        {/* <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                            {t('label.statut')}
                                        </th> */}
                                        <th className="py-4 px-4 font-medium text-black dark:text-white text-center">
                                            {t('label.date_generation')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnonymats.map((anonymat, index) => (
                                        <tr key={anonymat._id} className="border-b dark:border-strokedark">
                                            <td className="py-4 px-4">
                                                {(currentPage - 1) * 50 + index + 1}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-mono font-medium">
                                                    {`${anonymat.etudiant.nom} ${anonymat.etudiant.prenom||""}`}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-mono font-medium">
                                                    {anonymat.numeroAnonymat}
                                                </span>
                                            </td>
                                            {/* <td className="py-4 px-4 text-center">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                    anonymat.statut === 'ACTIF' ? 'bg-success text-white' :
                                                    anonymat.statut === 'UTILISE' ? 'bg-primary text-white' :
                                                    'bg-danger text-white'
                                                }`}>
                                                    {t(`label.${anonymat.statut.toLowerCase()}`)}
                                                </span>
                                            </td> */}
                                            <td className="py-4 px-4 text-center">
                                                {new Date(anonymat.dateGeneration!).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-meta-4 disabled:opacity-50"
                                >
                                    {t('pagination.precedent')}
                                </button>
                                <span className="px-4 py-2">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-meta-4 disabled:opacity-50"
                                >
                                    {t('pagination.suivant')}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Informations */}
                {/* <div className="mt-6 p-4 bg-blue-50 dark:bg-meta-4 rounded">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>{t('label.note')}:</strong> {t('help.anonymats_info')}
                    </p>
                </div> */}
            </div>
        </>
    );
};

export default GestionAnonymats;