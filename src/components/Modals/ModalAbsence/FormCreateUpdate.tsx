import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';


function ModalCreateUpdateAbsence({ user, isSignaled, isHourRemove }: { user: CustomEnseignantSelect | null, isSignaled?: boolean, isHourRemove: boolean }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const semestreCourant = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant); // converti en string
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${day}/${month}/${year}`;

    const [date, setDate] = useState<string>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
        setErrorDate("");
    };

    const [debutPeriode, setDebutPeriode] = useState("");
    const [finPeriode, setFinPeriode] = useState('');
    const [semestre, setSemestre] = useState<string>(
        isHourRemove ? (user?.absence?.semestre ?? '') : semestreCourant.toString()
    );


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
        setSemestre('1');
        if (isHourRemove) {
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
    }, [isHourRemove, isSignaled, user, isFirstRender, t]);

    const closeModal = () => {
        setErrorDate("");
        setErrorDebutPeriode("");
        setErrorFinPeriode("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre((event.target.value));
        setErrorSemestre("");
    };


    const handleCreateUpdate = () => {
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

        if (!isHourRemove) {
            // ajouter
        }
        else {
            // supprimer
        }

        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={isHourRemove ? true : false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >

                {
                    !isHourRemove ?
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
                        : <div>
                            {
                                user?.absence && <div>
                                    <p>{t('gestion_absence.annee_academique')} : {user?.absence?.annee}</p>
                                    <p>{t('gestion_absence.semestre')} : {user?.absence?.semestre}</p>
                                    <p>{t('gestion_absence.jour')} : {user?.absence?.dateAbsence}</p>
                                    <p>{t('')} : {user?.absence?.dateAbsence}</p>

                                </div>
                            }


                        </div>
                }

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdateAbsence;
