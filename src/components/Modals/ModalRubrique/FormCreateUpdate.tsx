import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Rubrique } from '../../../pages/Admin/Rubriques';


function ModalCreateUpdate({ rubrique }: { rubrique : Rubrique | null }) {

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [ordre, setOrdre] = useState(0);
    const [libelle, setLibelle] = useState("");
    

    const [errorOrdre, setErrorOrdre] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (rubrique) {
            setModalTitle("Mettre à jour les informations de la rubrique");
            setCode(rubrique.code?rubrique.code:"");
            setLibelle(rubrique.libelle);
            setOrdre(rubrique.ordre);
            
        } else {
            setModalTitle("Enregistrer une nouvelle rubrique");
            setOrdre(0);
            setLibelle("");
            setCode("");
        }


        if (isFirstRender) {
            setErrorOrdre("");
            setErrorLibelle("");
            setIsFirstRender(false);
        }
    }, [rubrique, isFirstRender]);

    const closeModal = () => { 
        setErrorOrdre(""); 
        setErrorLibelle("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    
    
    

    const handleCreateUpdate = () => {
        if (!ordre || !libelle) {
            
            if (!libelle) {
                setErrorLibelle("Le champ libellé est obligatoire.");
            }

            if (!ordre) {
                setErrorOrdre("Le champ numéro de la rubrique est obligatoire.");
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
                
                <label>Code</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value);}}
                />
                <label>Libellé</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) =>{setLibelle(e.target.value); setErrorLibelle("");} }
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>Numéro de la rubrique</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={ordre}
                    onChange={(e) => {setOrdre(parseInt(e.target.value)); setErrorOrdre("")}}
                />
                {errorOrdre && <p className="text-red-500" >{errorOrdre}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
