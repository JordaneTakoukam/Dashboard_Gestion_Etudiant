import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { updateChapitre } from '../../../_redux/features/chapitre_slice';
import { apiUpdateChapitre } from '../../../api/api_chapitre';



function ModalCreateUpdate({ objectif, chapitre  }: { objectif: ObjectifType | null, chapitre : ChapitreType |undefined|null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [etat, setEtat]=useState(0);
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");

   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
   
    useEffect(() => {
        
        if (objectif) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.objectif'));
            setCode(objectif.code);
            setLibelleFr(objectif.libelleFr);
            setLibelleEn(objectif.libelleEn);
            setEtat(objectif.etat);
            
            
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.objectif'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setEtat(0);
        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setIsFirstRender(false);
        }
    }, [objectif,  isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!code || !libelleFr || !libelleEn) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle_en'));
            }
            
            return;
        }
       
        if (!objectif) {
            if (chapitre && chapitre._id) {
                var newObjectifs:ObjectifType[] = [];
                for (let i = 0; chapitre.objectifs && i < chapitre.objectifs.length; i++) {
                    const objectif = chapitre.objectifs[i];
                    newObjectifs.push(objectif)
                }
                newObjectifs.push({
                    code,
                    libelleFr,
                    libelleEn,
                    etat
                })
                await apiUpdateChapitre(
                    {
                        _id:chapitre._id, 
                        code:chapitre.code, 
                        libelleFr:chapitre.libelleFr, 
                        libelleEn:chapitre.libelleEn, 
                        matiere:chapitre.matiere,
                        typesEnseignement:chapitre.typesEnseignement,
                        objectifs:newObjectifs,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else{
            if (chapitre && chapitre._id) {
                const updatedObjectif: ObjectifType = {
                    _id: objectif._id,
                    code,
                    libelleFr,
                    libelleEn,
                    etat: objectif.etat
                };
                
               
                var newObjectifs:ObjectifType[] = [];
                for (let i = 0; chapitre.objectifs && i < chapitre.objectifs.length; i++) {
                    const objectif = chapitre.objectifs[i];
                    newObjectifs.push(objectif)
                }
                const index = newObjectifs.findIndex((obj) => obj._id === objectif?._id);
                if (index !== -1) {
                    newObjectifs[index] = updatedObjectif;
                }
                await apiUpdateChapitre(
                    {
                        _id:chapitre._id, 
                        code:chapitre.code, 
                        libelleFr:chapitre.libelleFr, 
                        libelleEn:chapitre.libelleEn, 
                        matiere:chapitre.matiere,
                        typesEnseignement:chapitre.typesEnseignement,
                        objectifs:newObjectifs
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        
                        closeModal();
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
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
                
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {errorCode && <p className="text-red-500">{errorCode}</p>}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn("") }}
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
