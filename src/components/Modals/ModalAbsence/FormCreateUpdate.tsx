import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { Enseignant } from '../../../pages/Admin/ListeEnseignants';
import { Etudiant } from '../../../pages/Admin/ListeEtudiants';


function ModalCreateUpdate({ user, isSignaled, isHourRemove }: { user : Etudiant | Enseignant | null, isSignaled?:boolean, isHourRemove:boolean }) {

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

    useEffect(() => {
        setDate("");
        setDebutPeriode("");
        setFinPeriode("");
        setSemestre(0);
        if (isHourRemove) {
            setModalTitle("Supprimer une absence : "+user?.nom+" "+user?.prenom);            
        } else{
            setModalTitle("Ajouter une abscence : "+user?.nom+" "+user?.prenom);
        }
        if(isSignaled){
            setModalTitle("Signaler mon abscence");            
        }


        if (isFirstRender) {
            setErrorDate("");
            setErrorDebutPeriode("");
            setErrorFinPeriode("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [isHourRemove, isSignaled, user, isFirstRender]);

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
                setErrorSemestre("Le champ semestre est obligatoire.");
            }
            if (!date) {
                setErrorDate("Le champ date est obligatoire.");
            }
            if (!debutPeriode) {
                setErrorDebutPeriode("Le champ heure de début est obligatoire.");
            }
            if (!finPeriode) {
                setErrorFinPeriode("Le champ heure de fin est obligatoire.");
            }

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
                <label>Semestre</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">Sélectionnez un semestre</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}
                    
                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                
                <label>Date</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={date}
                    onChange={(e) => {setDate(e.target.value); setErrorDate("")}}
                />
                {errorDate && <p className="text-red-500" >{errorDate}</p>}
                <label>Heure de début</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={debutPeriode}
                    onChange={(e) => {setDebutPeriode(e.target.value); setErrorDebutPeriode("")}}
                />
                {errorDebutPeriode && <p className="text-red-500" >{errorDebutPeriode}</p>}
                <label>Heure de fin</label><label className="text-red-500"> *</label>
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
