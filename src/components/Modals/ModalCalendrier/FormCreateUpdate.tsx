import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Evenement } from '../../../pages/CommonPage/CalendrierAcademique';


function ModalCreateUpdate({ evenement }: { evenement : Evenement | null }) {

    const dispatch = useDispatch();
    const [numEvenement, setNumEvenement] = useState(0);
    const [libelle, setLibelle] = useState("");
    const [periode, setPeriode] = useState("");
    const [personnel, setPersonnel] = useState("");
    const [description, setDescription] = useState("");
    

    const [errorNumEvenement, setErrorNumEvenement] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorPeriode, setErrorPeriode] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (evenement) {
            setModalTitle("Mettre à jour les informations de l'évènement");
            setNumEvenement(evenement.numEvenement);
            setLibelle(evenement.libelle);
            setPeriode(evenement.periode);
            setPersonnel(evenement.personnel?evenement.personnel:"");
            setDescription(evenement.description?evenement.description:"");
        } else {
            setModalTitle("Enregistrer un nouvel évènement");
            setNumEvenement(0);
            setLibelle("");
            setPeriode("");
            setPersonnel("");
            setDescription("");
        }


        if (isFirstRender) {
            setErrorNumEvenement("");
            setErrorLibelle("");
            setErrorPeriode("");
            setIsFirstRender(false);
        }
    }, [evenement, isFirstRender]);

    const closeModal = () => { 
        setErrorNumEvenement(""); 
        setErrorLibelle("");
        setErrorPeriode("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    
    
    

    const handleCreateUpdate = () => {
        if (!numEvenement || !libelle || !periode) {
            if (!numEvenement) {
                setErrorNumEvenement("Le champ numéro de l'évènement est obligatoire.");
            }
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }
            if (!periode) {
                setErrorPeriode("Le champ période est obligatoire.");
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
                
                <label>Numéro de l'évèvenement</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={numEvenement}
                    onChange={(e) => {setNumEvenement(parseInt(e.target.value)); setErrorNumEvenement("")}}
                />
                {errorNumEvenement && <p className="text-red-500" >{errorNumEvenement}</p>}
                <label>Libellé</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) =>{setLibelle(e.target.value); setErrorLibelle("");} }
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>Période</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periode}
                    onChange={(e) =>{setPeriode(e.target.value); setErrorPeriode("");} }
                />
                {errorPeriode && <p className="text-red-500">{errorPeriode}</p>}
                <label>Personnel concerné</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={personnel}
                    onChange={(e) =>{setPersonnel(e.target.value)} }
                />
                <label>Description/Observation</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={description}
                    onChange={(e) =>{setDescription(e.target.value)} }
                />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
