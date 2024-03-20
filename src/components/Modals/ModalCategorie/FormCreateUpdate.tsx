import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Categorie } from '../../../pages/Admin/Categories';
import { useTranslation } from 'react-i18next';


function ModalCreateUpdate({ categorie }: { categorie : Categorie | null }) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (categorie) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.categorie'));
            setCode(categorie.code);
            setLibelle(categorie.libelle);
            
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.categorie'));
            setCode("");
            setLibelle("");
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setIsFirstRender(false);
        }
    }, [categorie, isFirstRender, t]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelle("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelle) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelle) {
                setErrorLibelle(t('error.libelle'));
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
                
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {errorCode && <p className="text-red-500" >{errorCode}</p>}
                <label>{t('label.libelle')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) =>{setLibelle(e.target.value); setErrorLibelle("");} }
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
