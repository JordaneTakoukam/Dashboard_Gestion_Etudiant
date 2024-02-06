import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { SalleCours } from '../../../pages/Admin/SallesDeCours';


function ModalCreateUpdate({ salleCours }: { salleCours : SalleCours | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [nom, setNom] = useState("");
    const [nbPlace, setNbPlace] = useState(0);
    

    const [errorCode, setErrorCode] = useState("");
    const [errorNom, setErrorNom] = useState("");
    const [errorNbPlace, setErrorNbPlace] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (salleCours) {
            setModalTitle("Mettre à jour les informations de la salle de cours");
            setCode(salleCours.code);
            setNom(salleCours.nom);
            setNbPlace(salleCours.nbPlace);
            
        } else {
            setModalTitle("Enregistrer une nouvelle salle de cours");
            setCode("");
            setNom("");
            setNbPlace(0);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorNom("");
            setErrorNbPlace("");
            setIsFirstRender(false);
        }
    }, [salleCours, isFirstRender]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorNom("");
        setErrorNbPlace("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    
    
    

    const handleCreateUpdate = () => {
        if (!code || !nom || !nbPlace) {
            if (!code) {
                setErrorCode("Le champ code est obligatoire.");
            }
            if (!nom) {
                setErrorNom("Le champ nom est obligatoire.");
            }
            if(!nbPlace){
                setErrorNbPlace("Le champ nombre de place est obligatoire.")
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
                
                <label>Code</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>Nom</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) =>{setNom(e.target.value); setErrorNom("");} }
                />
                {errorNom && <p className="text-red-500">{errorNom}</p>}
                <label>Nombre de place</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={nbPlace}
                    onChange={(e) =>{setNbPlace(parseInt(e.target.value)); setErrorNbPlace("");} }
                />
                {errorNbPlace && <p className="text-red-500">{errorNbPlace}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
