import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import { apiCreateAbsence, apiDeleteAbsence } from '../../../api/discipline/api_discipline';
import createToast from '../../../hooks/toastify';
import { updateUserAbsences } from '../../../_redux/features/user_slice';


function ModalCreateUpdateAbsence({ isStudent, user, isSignaled, isHourRemove }: { isStudent?:boolean,user:UserState| null, isSignaled?: boolean, isHourRemove: boolean }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const lang = useSelector((state: RootState) => state.setting.language);
    const anneeAcademique = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante)??2024; // converti en string
    const semestreCourant = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant)??1; // converti en string
    const [date, setDate] = useState<string>('');



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
        setErrorDate("");
    };

    const [debutPeriode, setDebutPeriode] = useState("");
    const [finPeriode, setFinPeriode] = useState('');
    const [semestre, setSemestre] = useState<string>(semestreCourant.toString());


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
        
        if (user) {
            setModalTitle(t('form_update.absence') + user.nom + " " + user?.prenom||"");
        } else {
            setModalTitle(t('form_update.absence'));
        }
        if (isSignaled) {
            setModalTitle(t('form_update.signaler'));
            setDate("");
            setDebutPeriode("");
            setFinPeriode("");
            setSemestre(semestreCourant.toString());
        }


        if (isFirstRender) {
            setErrorDate("");
            setErrorDebutPeriode("");
            setErrorFinPeriode("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [isFirstRender, t]);

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


    const handleCreateUpdate = async () => {
        if (isHourRemove) {
            
        }
        else {
            setIsLoading(true)
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

            if (user) {
                await apiCreateAbsence(
                    {
                        userId: user?._id,
                        semestre: parseInt(semestre),
                        annee: anneeAcademique,
                        dateAbsence: date,
                        heureDebut: debutPeriode,
                        heureFin: finPeriode,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        
                        const newAbsences:AbsenceType[] = [];
                        for (let i = 0; user.absences && i < user.absences.length; i++) {
                            const abs = user.absences[i];
                            // if(chapitre._id!==chap._id){
                                newAbsences.push(abs)
                            // }
                        }
                        const absence:AbsenceType={
                            _id: e.data._id,
                            semestre: e.data.semestre,
                            annee: e.data.annee,
                            dateAbsence: e.data.dateAbsence,
                            heureDebut: e.data.heureDebut,
                            heureFin: e.data.heureFin,
                            etat: e.data.etat,
                            motif: e.data.motif
                        }
                        newAbsences.push(absence);
                        
                        dispatch(updateUserAbsences(newAbsences))
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    console.log(e);
                    // createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false);
                })
            }
        }

    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={isHourRemove ? true : false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
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
                        : null
                }

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdateAbsence;
