//src/components/Modals/ModalEvaluation/FormCreateUpdate.tsx

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    apiCreateEvaluation,
    apiUpdateEvaluation,
    getSemestresByNiveau,
    getCoefficientsByNiveau
} from '../../../api/api_evaluation';
import createToast from '../../../hooks/toastify';
import {
    createEvaluation,
    updateEvaluation
} from '../../../_redux/features/evaluation_slice';
import { FaPlus, FaTrash } from 'react-icons/fa';

function FormCreateUpdate({ evaluation }: { evaluation: EvaluationType | null }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;

    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [type, setType] = useState<string>("CONTROLE_CONTINU");
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
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorMatieres, setErrorMatieres] = useState("");

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");

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
        if (evaluation) {
            setModalTitle(t('form_update.enregistrer') + ' ' + t('form_update.evaluation'));
            setLibelleFr(evaluation.libelleFr);
            setLibelleEn(evaluation.libelleEn);
            setDescriptionFr(evaluation.descriptionFr || "");
            setDescriptionEn(evaluation.descriptionEn || "");
            setType(evaluation.type);
            const niv = niveaux.find(n => n._id === evaluation.niveau);
            setNiveau(niv);
            setAnnee(evaluation.annee);
            setSemestre(evaluation.semestre);
            setDateEpreuve(evaluation.dateEpreuve ? new Date(evaluation.dateEpreuve).toISOString().split('T')[0] : "");
            setDateLimiteSaisie(evaluation.dateLimiteSaisie ? new Date(evaluation.dateLimiteSaisie).toISOString().split('T')[0] : "");
            setNoteMax(evaluation.noteMax);
            setNoteMin(evaluation.noteMin);
            setMatieres(evaluation.matieres);
        } else {
            setModalTitle(t('form_save.enregistrer') + ' ' + t('form_save.evaluation'));
            resetForm();
        }
    }, [evaluation, t, niveaux]);

    const resetForm = () => {
        setLibelleFr("");
        setLibelleEn("");
        setDescriptionFr("");
        setDescriptionEn("");
        setType("CONTROLE_CONTINU");
        setNiveau(undefined);
        setAnnee(currentYear);
        setSemestre(currentSemestre);
        setDateEpreuve("");
        setDateLimiteSaisie("");
        setNoteMax(20);
        setNoteMin(0);
        setMatieres([]);
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorNiveau("");
        setErrorMatieres("");
    };

    const closeModal = () => {
        resetForm();
        dispatch(setShowModal());
    };

    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauId = e.target.value;
        const selectedNiveau = niveaux.find(n => n._id === selectedNiveauId);
        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };

    const handleAddMatiere = () => {
        setMatieres([...matieres, { matiere: "", coefficient: 1 }]);
    };

    const handleRemoveMatiere = (index: number) => {
        const newMatieres = matieres.filter((_, i) => i !== index);
        setMatieres(newMatieres);
    };

    const handleMatiereChange = (index: number, field: 'matiere' | 'coefficient', value: any) => {
        const newMatieres = [...matieres];
        newMatieres[index] = { ...newMatieres[index], [field]: value };
        setMatieres(newMatieres);
        setErrorMatieres("");
    };

    const handleCreateUpdate = async () => {
        if (!libelleFr || !libelleEn || !niveau || matieres.length === 0) {
            if (!libelleFr) setErrorLibelleFr(t('error._fr'));
            if (!libelleEn) setErrorLibelleEn(t('error._en'));
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

        setIsLoading(true);

        const evaluationData = {
            libelleFr,
            libelleEn,
            descriptionFr,
            descriptionEn,
            type: type as any,
            niveau: niveau._id!,
            annee,
            semestre,
            matieres,
            dateEpreuve: dateEpreuve ? new Date(dateEpreuve) : undefined,
            dateLimiteSaisie: dateLimiteSaisie ? new Date(dateLimiteSaisie) : undefined,
            noteMax,
            noteMin
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
        { value: 'CONTROLE_CONTINU', label: t('evaluation.type.controle_continu') },
        { value: 'EXAMEN_PARTIEL', label: t('evaluation.type.examen_partiel') },
        { value: 'EXAMEN_FINAL', label: t('evaluation.type.examen_final') },
        { value: 'SESSION_RATTRAPAGE', label: t('evaluation.type.session_rattrapage') },
        { value: 'AUTRE', label: t('evaluation.type.autre') }
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

                <label>{t('label.niveau')}</label>
                <label className="text-red-500"> *</label>
                <select
                    value={niveau?._id || ""}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary mb-3"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + ' ' + t('select_par_defaut.niveau')}</option>
                    {niveaux.map(n => (
                        <option key={n._id} value={n._id}>
                            {lang === 'fr' ? n.libelleFr : n.libelleEn}
                        </option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500 mb-2">{errorNiveau}</p>}

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
                            value={mat.matiere}
                            onChange={(e) => handleMatiereChange(index, 'matiere', e.target.value)}
                            className="flex-1 rounded border border-stroke bg-gray py-2 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        >
                            <option value="">{t('select_par_defaut.selectionnez') + ' matière'}</option>
                            {/* À compléter avec les matières disponibles */}
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
                    <FaPlus /> {t('button.ajouter_matiere')}
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