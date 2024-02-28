import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting_slice';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import { Chapitre, Competence, Objectif, TypeEnseignement, cm, typesEnseignement } from '../../../pages/Admin/Chapitres';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';



function ModalCreateUpdate({ chapitre }: { chapitre: Chapitre | null }) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelle, setLibelle] = useState("");
    const [typesEnseignementState, setTypesEnseignementState] = useState<TypeEnseignement[]>([cm]); // État local pour les types d'enseignement
    const [objectifs, setObjectifs] = useState<Objectif[]>([]); // État local pour les objectifs
    const [competences, setCompetences] = useState<Competence[]>([]); // État local pour les compétences
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelle, setErrorLibelle] = useState("");
    const [errorTypesEnseignement, setErrorTypesEnseignement] = useState("");
    const [errorObjectif, setErrorObjectif] = useState("");
    const [errorCompetence, setErrorCompetence] = useState("");
   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const objectif:Objectif={
        libelle: "",
        etat: 0
    };
    const competence:Competence={
        code: "",
        libelle: "",
    };

    useEffect(() => {
        if (chapitre) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.chapitre'));
            setCode(chapitre.code);
            setLibelle(chapitre.libelle);
            setTypesEnseignementState(chapitre.typesEnseignement || [cm]);
            setObjectifs(chapitre.objectifs || [objectif]);
            setCompetences(chapitre.competences || [competence]);
        
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.chapitre'));
            setCode("");
            setLibelle("");
            setTypesEnseignementState([cm]);
            setObjectifs([objectif]);
            setCompetences([competence]);

        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelle("");
            setErrorTypesEnseignement("");
            setErrorObjectif("");
            setErrorCompetence("");
            setIsFirstRender(false);
            setTypesEnseignementState([cm]);
            setObjectifs([objectif]);
            setCompetences([competence]);
        }
    }, [chapitre,  isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelle("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleAddTypeEnseignement = () => {
        // Vérifier s'il existe un type d'enseignement à ajouter
        if (typesEnseignement.length > 0) {
            // Ajouter le premier type d'enseignement à la liste
            setTypesEnseignementState(prevState => [...prevState, typesEnseignement[0]]);
        }
    };

    const handleRemoveTypeEnseignement = (index: number) => {
        setTypesEnseignementState(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleTypeEnseignementChange = (index: number, type: TypeEnseignement) => {
        setTypesEnseignementState(prevState => {
            const updatedTypes = [...prevState];
            updatedTypes[index] = type;
            return updatedTypes;
        });
    };

    const handleAddObjectif = () => {
        setObjectifs(prevObjectifs => [...prevObjectifs, objectif]);
    };

    const handleRemoveObjectif = (index: number) => {
        setObjectifs(prevObjectifs => prevObjectifs.filter((_, i) => i !== index));
    };

    const handleObjectifChange = (index: number, objectif: Objectif) => {
        setObjectifs(prevObjectifs => {
            const updatedObjectifs = [...prevObjectifs];
            updatedObjectifs[index] = objectif;
            return updatedObjectifs;
        });
    };

    const handleAddCompetence = () => {
        setCompetences(prevCompetences => [...prevCompetences, competence]);
    };

    const handleRemoveCompetence = (index: number) => {
        setCompetences(prevCompetences => prevCompetences.filter((_, i) => i !== index));
    };

    const handleCompetenceChange = (index: number, competence: Competence) => {
        setCompetences(prevCompetences => {
            const updatedCompetences = [...prevCompetences];
            updatedCompetences[index] = competence;
            return updatedCompetences;
        });
    };

    

    const handleCreateUpdate = () => {
        // Vérifier si tous les champs requis sont remplis
        if (!code || !libelle ||  !typesEnseignementState[0].volumeHoraire 
        || !objectifs[0].libelle || !competences[0].libelle) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelle) {
                setErrorLibelle(t('error.libelle'));
            }
            if(!typesEnseignementState[0].volumeHoraire){
                setErrorTypesEnseignement(t('error.type_ens'));
            }
            
            if(!objectifs[0].libelle){
                setErrorObjectif(t('error.objectif'));
            }

            if(!competences[0].libelle){
                setErrorCompetence(t('error.competence'));
            }

            return;
        }
        closeModal();
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
                <label>{t('label.libelle')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelle}
                    onChange={(e) => { setLibelle(e.target.value); setErrorLibelle("") }}
                />
                {errorLibelle && <p className="text-red-500">{errorLibelle}</p>}
                <div>
                    <h3>{t('label.type_ens')}<label className="text-red-500"> *</label></h3>
                    {typesEnseignementState.map((type, index) => (
                        <div key={index} className="flex items-center flex-item">
                            <select
                                value={type.code}
                                onChange={(e) => {
                                    const selectedType = typesEnseignement.find(t => t.code === e.target.value);
                                    if (selectedType) {
                                        handleTypeEnseignementChange(index, selectedType);
                                    }
                                }}
                            >
                                {typesEnseignement.map((t, i) => (
                                    <option key={i} value={t.code}>{t.code}</option>
                                ))}
                            </select>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="number"
                                placeholder={t('label.volume_horaire')}
                                value={type.volumeHoraire}
                                onChange={(e) => {handleTypeEnseignementChange(index, { ...type, volumeHoraire: +e.target.value }); setErrorTypesEnseignement("")}}
                            />
                            
                            {index !== 0 && ( // Ne pas afficher le bouton de suppression pour le premier type
                                <button type="button" onClick={() => handleRemoveTypeEnseignement(index)}>
                                    {t('boutton.supprimer')}
                                </button>
                            )}
                        </div>
                    ))}
                    {errorTypesEnseignement && <p className="text-red-500">{errorTypesEnseignement}</p>}
                    {typesEnseignementState.length < typesEnseignement.length && ( // Afficher le bouton d'ajout si tous les types n'ont pas été ajoutés
                        <button type="button" onClick={handleAddTypeEnseignement}>
                            {t('boutton.ajouter_type')}
                        </button>
                    )}
                </div>

                <div>
                    <h3>{t('label.objectifs')} <label className="text-red-500"> *</label></h3>
                    {objectifs.map((objectif, index) => (
                        <div key={index} className="flex items-center flex-item">
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                placeholder={`${t('label.objectif')} ${index + 1}`}
                                value={objectif.libelle}
                                onChange={(e) => {handleObjectifChange(index, {...objectif, libelle : e.target.value}); setErrorObjectif("")}}
                            />
                            
                            {index !== 0 && (
                                <button type="button" onClick={() => handleRemoveObjectif(index)}>
                                    {t('boutton.supprimer')}
                                </button>
                            )}
                        </div>
                    ))}
                    {errorObjectif && <p className="text-red-500">{errorObjectif}</p>}
                    <button type="button" onClick={handleAddObjectif}>
                        {t('boutton.ajouter_obj')}
                    </button>
                </div>

                <div>
                    <h3>{t('label.competences')} <label className="text-red-500"> *</label></h3>
                    {competences.map((competence, index) => (
                        <div key={index} className="flex items-center flex-item">
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                placeholder={`${t('label.competence')} ${index + 1}`}
                                value={competence.libelle}
                                onChange={(e) => {handleCompetenceChange(index, {...competence, libelle : e.target.value}); setErrorCompetence("")}}
                            />
                            
                            {index !== 0 && (
                                <button type="button" onClick={() => handleRemoveCompetence(index)}>
                                    {t('boutton.supprimer')}
                                </button>
                            )}
                        </div>
                    ))}
                    {errorCompetence && <p className="text-red-500">{errorCompetence}</p>}
                    <button type="button" onClick={handleAddCompetence}>
                        {t('boutton.ajouter_comp')}
                    </button>
                </div>
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
