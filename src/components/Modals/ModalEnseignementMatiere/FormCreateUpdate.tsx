import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';



function ModalCreateUpdate({ enseignement }: { enseignement: EnseignementType | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    const [enseignantPrincipal, setEnseignantPrincipal] = useState<UserState>();
    const [enseignantSuppleant, setEnseignantSuppleant] = useState<UserState>();
    
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [errorEnseignantPrincipal, setErrorEnseignantPrincipal] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    

    useEffect(() => {
        if (enseignement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.enseignement'));
            const typeEns = typesEnseignement.find(typeEns => typeEns._id === enseignement.typeEnseignement);
            setTypeEnseignement(typeEns);
            setEnseignantPrincipal(enseignement.enseignantPrincipal);
            setEnseignantSuppleant(enseignement.enseignantSuppleant);
            
        
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.enseignement'));
            setTypeEnseignement(undefined);
            setEnseignantPrincipal(undefined);
            setEnseignantSuppleant(undefined);
        }
        if (isFirstRender) {
            setErrorTypeEnseignement("");
            setErrorEnseignantPrincipal("");
            setIsFirstRender(false);
            
        }
    }, [enseignement,  isFirstRender, t]);

    const closeModal = () => {
        setErrorTypeEnseignement("");
        setErrorEnseignantPrincipal("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    
    

    const handleCreateUpdate = () => {
        // Vérifier si tous les champs requis sont remplis
        if (!typeEnseignement || !enseignantPrincipal) {
            if (!typeEnseignement) {
                setErrorTypeEnseignement(t('error.type_ens'));
            }
            if (!enseignantPrincipal) {
                setErrorEnseignantPrincipal(t('error.enseignant'));
            }

            return;
        }
        closeModal();
    };

    const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const selectedTypeEnseignement = typesEnseignement.find(typeEnseignement => typeEnseignement.code === selectedCode);
        if (selectedTypeEnseignement) {
            setTypeEnseignement(selectedTypeEnseignement);
            setErrorTypeEnseignement("");
        }
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
                <select
                    value={typeEnseignement ? typeEnseignement.code : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                    {typesEnseignement.map(typeEnseignement => (
                        <option key={typeEnseignement._id} value={typeEnseignement.code}>{typeEnseignement.code}</option>
                    ))}
                </select>
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
