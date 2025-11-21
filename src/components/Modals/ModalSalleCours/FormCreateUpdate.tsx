import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';
import { apiCreateSalleDeCours, apiUpdateSalleDeCours } from '../../../api/settings/api_salle_de_cours';


function ModalCreateUpdate({ salleDeCours }: { salleDeCours : SalleDeCoursProps | null }) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [nbPlace, setNbPlace] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorNbPlace, setErrorNbPlace] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (salleDeCours) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.salle'));
            setCode(salleDeCours.code);
            setLibelleFr(salleDeCours.libelleFr);
            setLibelleEn(salleDeCours.libelleEn);
            setNbPlace(salleDeCours.nbPlace);
            
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.salle'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setNbPlace(0);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorNbPlace("");
            setIsFirstRender(false);
        }
    }, [salleDeCours, isFirstRender, t]);

    const closeModal = () => { 
        setErrorCode(""); 
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorNbPlace("");    
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    const handleCreateUpdate = async () => {
        // create
        if (!salleDeCours) {
            if (!libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.nom_fr'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.nom_en'));
                }

            } else {
                // creation
                setIsLoading(true);
                await apiCreateSalleDeCours(
                    { code, libelleFr, libelleEn, nbPlace }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createSettingItem({
                            tableName: 'sallesDeCours', newItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                nbPlace:e.data.nbPlace,
                                date_creation: e.data.date_creation,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();


                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false)
                })
            }
        }

        //update
        else {

            if (!libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.nom_fr'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.nom_en'));
                }

            } else {
                //
                //
                // mise a jour
                setIsLoading(true)
                await apiUpdateSalleDeCours(
                    { _id: salleDeCours._id, code, libelleFr, libelleEn, nbPlace}
                ).then((e: ReponseApiPros) => {
                    
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(updateSettingItem({
                            tableName: 'sallesDeCours',
                            updatedItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                nbPlace: e.data.nbPlace,
                                date_creation: e.data.date_creation,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();


                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false)
                })
            }
        }


    }    

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >
                
                <label>{t('label.code')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => {setCode(e.target.value); setErrorCode("")}}
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) =>{setLibelleFr(e.target.value); setErrorLibelleFr("");} }
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) =>{setLibelleEn(e.target.value); setErrorLibelleEn("");} }
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
                <label>{t('label.nombre_place')}</label><label className="text-red-500"> *</label>
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
