import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { Niveau } from '../../../pages/Admin/Niveaux';
import { Section, sections } from '../../../pages/Admin/Sections';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { useTranslation } from 'react-i18next';


function ModalCreateUpdate({ niveau }: { niveau : Niveau | null }) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [section, setSection] = useState<Section>();
    const [cycle, setCycle] = useState<Cycle>();
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (niveau) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.niveau'));
            setCode(niveau.code);
            setLibelle(niveau.libelle);
            setSection(niveau.cycle.section);
            setCycle(niveau.cycle);
            
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.niveau'));
            setCode("");
            setLibelle("");
            setSection(undefined);
            setCycle(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorSection("");
            setErrorCycle("");
            setIsFirstRender(false);
        }
    }, [niveau, isFirstRender, t]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelle("");
        setErrorSection("");
        setErrorCycle("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        const selectedSection = sections.find(section => section.libelle === selectedSectionLibelle);
        if (selectedSection) {
            setSection(selectedSection);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        const selectedCycle = cycles.find(cycle => cycle.libelle === selectedCycleLibelle);
        if (selectedCycle) {
            setCycle(selectedCycle);
            setErrorCycle("");
        }
    };
    
    
    

    const handleCreateUpdate = () => {
        if (!code || !libelle || !section || !cycle) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelle) {
                setErrorLibelle(t('error.libelle'));
            }
            if (!section) {
                setErrorSection(t('error.section'));
            }
            if (!cycle) {
                setErrorCycle(t('error.cycle'));
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
                    onChange={(e) => {setLibelle(e.target.value); setErrorLibelle("")}}
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? section.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section.id} value={section.libelle}>{section.libelle}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? cycle.libelle : t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.cycle')}</option>
                    {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.libelle}>{cycle.libelle}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
