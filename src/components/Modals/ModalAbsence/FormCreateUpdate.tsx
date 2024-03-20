import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { Enseignant } from '../../../pages/Admin/ListeEnseignants';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';
import { useTranslation } from 'react-i18next';


function ModalCreateUpdate({ user, isSignaled, isHourRemove }: { user : Etudiant | Enseignant | null, isSignaled?:boolean, isHourRemove:boolean }) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [date, setDate] = useState("");
    const [debutPeriode, setDebutPeriode] = useState("");
    const [finPeriode, setFinPeriode] = useState("");
    const [semestre, setSemestre]=useState(0);
    

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
        setSemestre(0);
        if (isHourRemove) {
            setModalTitle(t('form_delete.absence')+user?.nom+" "+user?.prenom);            
        } else{
            setModalTitle(t('form_update.absence')+user?.nom+" "+user?.prenom);
        }
        if(isSignaled){
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
        setSemestre(parseInt(event.target.value));
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

        if(verifierHeureFinApresDebut(debutPeriode, finPeriode)){
            setErrorFinPeriode(t('error.debut_sup_fin_periode'));
            return;
        }
        
        closeModal();
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.semestre')}</option>
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
                    onChange={(e) => {setDate(e.target.value); setErrorDate("")}}
                />
                {errorDate && <p className="text-red-500" >{errorDate}</p>}
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={debutPeriode}
                    onChange={(e) => {setDebutPeriode(e.target.value); setErrorDebutPeriode("")}}
                />
                {errorDebutPeriode && <p className="text-red-500" >{errorDebutPeriode}</p>}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={finPeriode}
                    onChange={(e) => {setFinPeriode(e.target.value); setErrorFinPeriode("")}}
                />
                {errorFinPeriode && <p className="text-red-500" >{errorFinPeriode}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
