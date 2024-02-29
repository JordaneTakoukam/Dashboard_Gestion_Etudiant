import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Evenement } from '../../../pages/CommonPage/CalendrierAcademique';
import { useTranslation } from 'react-i18next';


function ModalCreateUpdate({ evenement }: { evenement : Evenement | null }) {   
    const {t}=useTranslation();
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
            setModalTitle(t('form_update.enregistrer')+t('form_update.evenement'));
            setNumEvenement(evenement.numEvenement);
            setLibelle(evenement.libelle);
            setPeriode(evenement.periode);
            setPersonnel(evenement.personnel?evenement.personnel:"");
            setDescription(evenement.description?evenement.description:"");
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.evenement'));
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
    }, [evenement, isFirstRender, t]);

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
                setErrorNumEvenement(t('error.num_even'));
            }
            if (!libelle) {
                setErrorLibelle(t('error.libelle'));
            }
            if (!periode) {
                setErrorPeriode(t('error.periode'));
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
                
                <label>{t('label.numero_evenement')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={numEvenement}
                    onChange={(e) => {setNumEvenement(parseInt(e.target.value)); setErrorNumEvenement("")}}
                />
                {errorNumEvenement && <p className="text-red-500" >{errorNumEvenement}</p>}
                <label>{t('label.libelle')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) =>{setLibelle(e.target.value); setErrorLibelle("");} }
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>{t('label.periode')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={periode}
                    onChange={(e) =>{setPeriode(e.target.value); setErrorPeriode("");} }
                />
                {errorPeriode && <p className="text-red-500">{errorPeriode}</p>}
                <label>{t('label.personnel_concerne')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={personnel}
                    onChange={(e) =>{setPersonnel(e.target.value)} }
                />
                <label>{t('label.description')}</label>
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
