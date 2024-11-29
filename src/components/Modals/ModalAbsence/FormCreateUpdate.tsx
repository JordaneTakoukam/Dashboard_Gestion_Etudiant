import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import { apiCreateAbsence, apiDeleteAbsence, apiJustifierAbsence } from '../../../api/discipline/api_discipline';
import createToast from '../../../hooks/toastify';
import { ajouterAbsenceEnseignant, ajouterAbsenceEnseignantDisciplineUI, modifierAbsenceEnseignant, retirerAbsenceEnseignant } from '../../../_redux/features/absence/discipline_enseignant_slice';
import { nbTotalAbsences } from '../../../fonctions/fonction';
import { ajouterAbsenceEtudiant, ajouterAbsenceEtudiantDisciplineUI, modifierAbsenceEtudiant, retirerAbsenceEtudiant } from '../../../_redux/features/absence/discipline_etudiant_slice';


function ModalCreateUpdateAbsence({ isStudent, user, isSignaled, isHourRemove, isJustify }: { isStudent: boolean, user: CustomEnseignantSelect | CustomEtudiantSelect | CustomUserSelect | null, isSignaled?: boolean, isHourRemove: boolean, isJustify: boolean }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();



    const lang = useSelector((state: RootState) => state.setting.language);
    const anneeAcademique = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante); // converti en string
    const semestreCourant = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant); // converti en string
    const [date, setDate] = useState<string>('');



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
        setErrorDate("");
    };

    const [debutPeriode, setDebutPeriode] = useState("");
    const [motif, setMotif] = useState("");
    const [etat, setEtat] = useState(1);
    const [finPeriode, setFinPeriode] = useState('');
    const [semestre, setSemestre] = useState<number>(semestreCourant);


    const [errorDate, setErrorDate] = useState("");
    const [errorDebutPeriode, setErrorDebutPeriode] = useState("");
    const [errorFinPeriode, setErrorFinPeriode] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    //verifier si l'heure de fin vient avant l'heure de début
    const verifierHeureFinApresDebut = (heureDebut: string, heureFin: string): boolean => {
        const debutMinutes = convertirHeureVersMinutes(heureDebut);
        const finMinutes = convertirHeureVersMinutes(heureFin);

        return finMinutes < debutMinutes;
    };

    // Fonction utilitaire pour convertir l'heure au format HH:MM en minutes
    const convertirHeureVersMinutes = (heure: string): number => {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    };

    useEffect(() => {
        setDate("");
        setDebutPeriode("");
        setFinPeriode("");
        setSemestre(semestre);

        if (isJustify) {
            if (user?.user) {
                setMotif(user.absence?.motif ?? "");
                if (user.absence?.etat == 0) {
                    setModalTitle(t('form_update.etat_absence_non_just') + user?.user.nom + " " + user?.user.prenom);
                    setEtat(1);
                } else {
                    setModalTitle(t('form_update.etat_absence_just') + user?.user.nom + " " + user?.user.prenom);
                    setEtat(0);
                }

            } else {
                setModalTitle("");
            }
        } else if (isHourRemove) {
            if (user?.user) {
                setModalTitle(t('form_delete.absence') + user?.user.nom + " " + user?.user.prenom);
            } else {
                setModalTitle(t('form_delete.absence'));
            }
        } else {
            if (user?.user) {
                setModalTitle(t('form_update.absence') + user?.user.nom + " " + user?.user.prenom);
            } else {
                setModalTitle(t('form_update.absence'));
            }
        }
        if (isSignaled) {
            setModalTitle(t('form_update.signaler'));
        }


        if (isFirstRender) {
            setErrorDate("");
            setErrorDebutPeriode("");
            setErrorFinPeriode("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [isHourRemove, isJustify, isSignaled, user, isFirstRender, t]);

    const closeModal = () => {
        setErrorDate("");
        setErrorDebutPeriode("");
        setErrorFinPeriode("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre((parseInt(event.target.value)));
        setErrorSemestre("");
    };


    const handleCreateUpdate = async () => {
        if (isHourRemove) {
            // supprimer
            if (user?.user && user.absence) {

                await apiDeleteAbsence(
                    {
                        userId: user?.user?._id,
                        absenceId: user.absence?._id,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        if (user?.user && user.absence) {
                            if (isStudent) {
                                dispatch(retirerAbsenceEtudiant({
                                    absenceId: user.absence?._id,
                                }));
                            } else {
                                dispatch(retirerAbsenceEnseignant({
                                    absenceId: user.absence?._id,
                                }));
                            }
                        }
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        } else if (isJustify) {
            if (user?.user && user.absence?._id) {

                await apiJustifierAbsence(
                    {
                        _id: user.absence?._id,
                        userId: user?.user?._id,
                        semestre: semestre,
                        annee: anneeAcademique,
                        dateAbsence: date,
                        heureDebut: debutPeriode,
                        heureFin: finPeriode,
                        etat: etat,
                        motif: etat == 1 ? motif : ""
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        if (isStudent) {
                            dispatch(modifierAbsenceEtudiant({ ...e.data }));

                        } else {
                            dispatch(modifierAbsenceEnseignant({ ...e.data }));
                        }
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        } else {
            if (!date || !debutPeriode || !finPeriode || !semestre) {
                if (!semestre) {
                    setErrorSemestre(t('error.semestre'));
                }
                if (!date) {
                    setErrorDate(t('error.date'));
                }
                if (!debutPeriode) {
                    setErrorDebutPeriode(t('error.heure_debut'));
                }
                if (!finPeriode) {
                    setErrorFinPeriode(t('error.heure_fin'));
                }

                return;
            }

            if (verifierHeureFinApresDebut(debutPeriode, finPeriode)) {
                setErrorFinPeriode(t('error.debut_sup_fin_periode'));
                return;
            }

            if (user?.user) {
                await apiCreateAbsence(
                    {
                        userId: user?.user?._id,
                        semestre: semestre,
                        annee: anneeAcademique,
                        dateAbsence: date,
                        heureDebut: debutPeriode,
                        heureFin: finPeriode,
                        etat: 0,
                        motif: ""
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        if (isStudent) {
                            dispatch(ajouterAbsenceEtudiant({ ...e.data }));
                            dispatch(ajouterAbsenceEtudiantDisciplineUI({ ...e.data}));

                        } else {
                            dispatch(ajouterAbsenceEnseignant({ ...e.data }));
                            dispatch(ajouterAbsenceEnseignantDisciplineUI({ ...e.data}));
                        }
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }

    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={isHourRemove || (isJustify ? true : false)}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >

                {
                    !isHourRemove && !isJustify ?
                        <div>
                            <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                            <select
                                value={semestre}
                                onChange={handleSemestreChange}
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            >
                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option>
                                {semestres.map((semestre, index) => (
                                    <option key={index} value={semestre}>{semestre}</option>
                                ))}

                            </select>
                            {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}

                            <label>{t('label.date')}</label><label className="text-red-500"> *</label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="date"
                                value={date}
                                onChange={handleChange}
                            />
                            {errorDate && <p className="text-red-500" >{errorDate}</p>}
                            <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="time"
                                value={debutPeriode}
                                onChange={(e) => { setDebutPeriode(e.target.value); setErrorDebutPeriode("") }}
                            />
                            {errorDebutPeriode && <p className="text-red-500" >{errorDebutPeriode}</p>}
                            <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="time"
                                value={finPeriode}
                                onChange={(e) => { setFinPeriode(e.target.value); setErrorFinPeriode("") }}
                            />
                            {errorFinPeriode && <p className="text-red-500" >{errorFinPeriode}</p>}

                        </div>
                        : !isJustify && isHourRemove ? <div>
                            {
                                user?.absence && <div>
                                    <p className='pb-3'>{t('gestion_absence.semestre')} : {user?.absence?.semestre.toString()}</p>

                                    <p className=' pb-3'>{t('gestion_absence.date')} : {lang === 'fr' ? new Date(user?.absence?.dateAbsence).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date(user?.absence?.dateAbsence).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

                                    <p className=' pb-3'>{t('gestion_absence.nombre_heure_absence')} : <span className='text-meta-1 font-medium'>{nbTotalAbsences([user.absence])} {[user.absence].length > 1 ? t('menu.heure_d_absence') : t('menu.heures_d_absences')} </span></p>



                                </div>
                            }


                        </div>
                            : <div>
                                {
                                    user?.absence && <div>
                                        <p className='pb-3'>{t('gestion_absence.semestre')} : {user?.absence?.semestre.toString()}</p>

                                        <p className=' pb-3'>{t('gestion_absence.date')} : {lang === 'fr' ? new Date(user?.absence?.dateAbsence).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date(user?.absence?.dateAbsence).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

                                        <p className=' pb-3'>{t('label.heure_debut')} : {user.absence.heureDebut}</p>

                                        <p className=' pb-3'>{t('label.heure_fin')} : {user.absence.heureFin}</p>

                                        <p className=' pb-3'>{t('gestion_absence.nombre_heure_absence')} : <span className='text-meta-1 font-medium'>{nbTotalAbsences([user.absence])} {[user.absence].length > 1 ? t('menu.heure_d_absence') : t('menu.heures_d_absences')} </span></p>
                                        <textarea
                                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            value={motif}

                                            maxLength={100} // Limite à 100 caractères
                                            placeholder={t('label.motif')}
                                            onChange={(e) => { setMotif(e.target.value); }}
                                        />
                                    </div>
                                }
                            </div>
                }

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdateAbsence;
