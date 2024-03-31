import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import { Chapitre, Competence, Objectif, TypeEnseignement, cm, typesEnseignement } from '../../../pages/Admin/Chapitres';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';



function ModalCreateUpdate({ chapitre }: { chapitre: ChapitreType | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [typesEnseignementState, setTypesEnseignementState] = useState<TypeEnseignement[]>([cm]); // État local pour les types d'enseignement
    const [objectifs, setObjectifs] = useState<ObjectifType[]>([]); // État local pour les objectifs
    const [competences, setCompetences] = useState<CompetenceType[]>([]); // État local pour les compétences
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorTypesEnseignement, setErrorTypesEnseignement] = useState("");
    const [errorObjectif, setErrorObjectif] = useState("");
    const [errorObjectifFr, setErrorObjectifFr] = useState("");
    const [errorObjectifEn, setErrorObjectifEn] = useState("");
    const [errorCompetence, setErrorCompetence] = useState("");
    const [errorCompetenceFr, setErrorCompetenceFr] = useState("");
    const [errorCompetenceEn, setErrorCompetenceEn] = useState("");
   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const objectif:ObjectifType={
        code:"",
        libelleFr: "",
        libelleEn: "",
        etat: 0
    };
    const competence:CompetenceType={
        code:"",
        libelleFr: "",
        libelleEn: "",
    };

    useEffect(() => {
        if (chapitre) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.chapitre'));
            setCode(chapitre.code);
            setLibelleFr(chapitre.libelleFr);
            setLibelleEn(chapitre.libelleEn);
            //setTypesEnseignementState(chapitre.typesEnseignement || [cm]);
            setObjectifs(chapitre.objectifs || [objectif]);
            setCompetences(chapitre.competences || [competence]);
        
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.chapitre'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setTypesEnseignementState([cm]);
            setObjectifs([objectif]);
            setCompetences([competence]);

        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorTypesEnseignement("");
            setErrorObjectif("");
            setErrorObjectifFr("");
            setErrorObjectifEn("");
            setErrorCompetence("");
            setErrorCompetenceFr("");
            setErrorCompetenceEn("");
            setIsFirstRender(false);
            setTypesEnseignementState([cm]);
            setObjectifs([objectif]);
            setCompetences([competence]);
        }
    }, [chapitre,  isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorTypesEnseignement("");
        setErrorObjectif("");
        setErrorObjectifFr("");
        setErrorObjectifEn("");
        setErrorCompetence("");
        setErrorCompetenceFr("");
        setErrorCompetenceEn("");
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

    const handleObjectifChange = (index: number, objectif: ObjectifType) => {
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

    const handleCompetenceChange = (index: number, competence: CompetenceType) => {
        setCompetences(prevCompetences => {
            const updatedCompetences = [...prevCompetences];
            updatedCompetences[index] = competence;
            return updatedCompetences;
        });
    };

    

    const handleCreateUpdate = () => {
        // Vérifier si tous les champs requis sont remplis
        if (!code || !libelleFr || !libelleEn ||  !typesEnseignementState[0].volumeHoraire 
        || !objectifs[0].libelleFr || !objectifs[0].libelleEn || !competences[0].libelleFr || !competences[0].libelleEn) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle_en'));
            }
            if(!typesEnseignementState[0].volumeHoraire){
                setErrorTypesEnseignement(t('error.type_ens'));
            }
            
            if(!objectifs[0].libelleFr){
                setErrorObjectif(t('error.objectif'));
            }

            if(!objectifs[0].libelleEn){
                setErrorObjectif(t('error.objectif'));
            }

            if(!competences[0].libelleFr){
                setErrorCompetence(t('error.competence'));
            }
            if(!competences[0].libelleEn){
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
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn("") }}
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
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
                                value={objectif.libelleFr}
                                onChange={(e) => {handleObjectifChange(index, {...objectif, libelleFr : e.target.value}); setErrorObjectifFr("")}}
                            />
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                placeholder={`${t('label.objectif')} ${index + 1}`}
                                value={objectif.libelleEn}
                                onChange={(e) => {handleObjectifChange(index, {...objectif, libelleEn : e.target.value}); setErrorObjectifEn("")}}
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
                                value={competence.libelleFr}
                                onChange={(e) => {handleCompetenceChange(index, {...competence, libelleFr : e.target.value}); setErrorCompetence("")}}
                            />
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text"
                                placeholder={`${t('label.competence')} ${index + 1}`}
                                value={competence.libelleEn}
                                onChange={(e) => {handleCompetenceChange(index, {...competence, libelleEn : e.target.value}); setErrorCompetence("")}}
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
