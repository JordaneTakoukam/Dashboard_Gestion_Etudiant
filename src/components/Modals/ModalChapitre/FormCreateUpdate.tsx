import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiCreateChapitre, apiUpdateChapitre } from '../../../api/api_chapitre';
import createToast from '../../../hooks/toastify';
import { ajouterChapitre, modifierChapitre } from '../../../_redux/features/matiere_slice';
import { createChapitre, updateChapitre } from '../../../_redux/features/chapitre_slice';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { formatYear } from '../../../fonctions/fonction';
import { config } from '../../../config';



function ModalCreateUpdate({ chapitre, matiere  }: { chapitre: ChapitreType | null, matiere : MatiereType |undefined|null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const [typesEnseignementState, setTypesEnseignementState] = useState<CommonSettingProps[]>([]); // État local pour les types d'enseignement
    const [objectifs, setObjectifs] = useState<ObjectifType[]>([]); // État local pour les objectifs
    const [enseignementState, setEnseignementState] = useState<EnseignementType[]>([]); // État local pour les types d'enseignement
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    
    const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorTypesEnseignement, setErrorTypesEnseignement] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const currentUser: UserState = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const listeTypesEnseignementDeMatiere = matiere && matiere.typesEnseignement && matiere.typesEnseignement
                .map(type => type) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
        listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
    }, [matiere]);

   
    useEffect(() => {
        const listeTypesEnseignementDeMatiere = matiere && matiere.typesEnseignement && matiere.typesEnseignement
                .map(type => type) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
        listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);


        if (chapitre) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.chapitre'));
            setCode(chapitre.code);
            setLibelleFr(chapitre.libelleFr);
            setLibelleEn(chapitre.libelleEn);
            // setTypesEnseignementState(chapitre.typesEnseignement);
            setEnseignementState(chapitre.typesEnseignement);
            setAnnee(chapitre.annee);
            setSemestre(chapitre.semestre);
            // setObjectifs(chapitre.objectifs);
            
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.chapitre'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setTypesEnseignementState([]);
            setAnnee(currentYear);
            setSemestre(currentSemester);
            setEnseignementState([]);
            handleAddTypeEnseignement();
            setObjectifs([]);
        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorTypesEnseignement("");
            setErrorSemestre("");
            setIsFirstRender(false);
            setTypesEnseignementState([]);
            setObjectifs([]);
            setEnseignementState([]);
        }
    }, [chapitre,  isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorTypesEnseignement("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };
    
    const handleAddTypeEnseignement = () => {
        // Vérifier s'il existe un type d'enseignement à ajouter
        if (typesEnseignement.length > 0) {
            // Ajouter le premier type d'enseignement à la liste
            
            setTypesEnseignementState(prevState => [...prevState, typesEnseignement[0]]);
            var id="";
            if(typesEnseignement[0]._id){
                id = typesEnseignement[0]._id;
            }
            
            const enseignements : EnseignementType[]=[{
                typeEnseignement: id,
            }]
            setEnseignementState(prevState => [...prevState, enseignements[0]]);
        }
    };

    const handleRemoveTypeEnseignement = (index: number) => {
        setTypesEnseignementState(prevState => prevState.filter((_, i) => i !== index));
        setEnseignementState(prevState => prevState.filter((_, i) => i !== index));
    };

    const handleTypeEnseignementChange = (index: number, type: CommonSettingProps) => {
        setTypesEnseignementState(prevState => {
            const updatedTypes = [...prevState];
            updatedTypes[index] = type;
            return updatedTypes;
        });
    };

    const handleEnseignementChange = (index: number, type: EnseignementType) => {
        setEnseignementState(prevState => {
            const updatedTypes = [...prevState];
            updatedTypes[index] = type;
            return updatedTypes;
        });
    };

    // const handleAddObjectif = () => {
    //     setObjectifs(prevObjectifs => [...prevObjectifs, objectif]);
    // };
    

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!semestre || !libelleFr || !libelleEn || !enseignementState[0].volumeHoraire) {
            if (!semestre) {
                setErrorSemestre(t('error.semestre'));
            }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle_en'));
            }
            if(!enseignementState[0].volumeHoraire){
                setErrorTypesEnseignement(t('error.type_ens'));
            }
            
            return;
        }
        var statut = 0;
        if(currentUser.role == config.roles.admin){
            statut = 1;
        }
        if (!chapitre) {
            if (matiere && matiere._id) {
                await apiCreateChapitre(
                    {
                        annee:annee,
                        semestre:semestre,
                        code, 
                        libelleFr, 
                        libelleEn, 
                        typesEnseignement:enseignementState,
                        statut,
                        user:currentUser._id,
                        matiere:matiere._id, 
                        // objectifs:[],
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        dispatch(createChapitre({
                            
                            chapitre: {
                                _id: e.data._id,
                                annee: e.data.annee,
                                semestre: e.data.semestre,
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                matiere: matiere,
                                statut:e.data.statut,
                                typesEnseignement: e.data.typesEnseignement,
                            }
                            
                        }));
                        // dispatch(ajouterChapitre({...e.data}))
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
            if (matiere && matiere._id) {
                await apiUpdateChapitre(
                    {
                        annee:annee,
                        semestre:semestre,
                        code, 
                        libelleFr, 
                        libelleEn, 
                        typesEnseignement:enseignementState, 
                        matiere:matiere, 
                        statut:chapitre.statut,
                        // objectifs:chapitre.objectifs,
                        _id:chapitre._id
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        dispatch(
                            updateChapitre({
                                id: e.data._id,
                                chapitreData: {
                                    _id: e.data._id,
                                    annee:e.data.annee,
                                    semestre:e.data.semestre,
                                    code:e.data.code,
                                    libelleFr:e.data.libelleFr,
                                    libelleEn:e.data.libelleEn,
                                    matiere:matiere,
                                    statut:e.data.statut,
                                    typesEnseignement: e.data.typesEnseignement,
                                }
                            }));
                        // dispatch(modifierChapitre({...e.data}))
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
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    readOnly
                    onChange={(e) => { setAnnee(parseInt(e.target.value)); }}
                />
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}

                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>{t('label.code')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {/* {errorCode && <p className="text-red-500">{errorCode}</p>} */}
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
                <div>
                    <h3>{t('label.type_ens')}<label className="text-red-500"> *</label></h3>
                    {enseignementState.map((type, index) => (
                        <div key={index} className="flex items-center flex-item">
                            <select
                                value={typesEnseignement.find(t => t._id === type.typeEnseignement)?.code}
                                onChange={(e) => {
                                    const selectedType = typesEnseignement.find(t => t.code === e.target.value);
                                    
                                    if (selectedType && selectedType?._id) {
                                        const selected : EnseignementType ={
                                            typeEnseignement: selectedType?._id,
                                            volumeHoraire:type.volumeHoraire,
                                        }
                                        handleEnseignementChange(index, selected);
                                    }
                                }}
                            >
                                {typesEnseignementMat.map((t, i) => (
                                    <option key={i} value={t.code}>{t.code}</option>
                                ))}
                            </select>
                            <input
                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="number"
                                placeholder={t('label.volume_horaire')}
                                value={type.volumeHoraire || ''}
                                onChange={(e) => {
                                    // setSelectedVolume(parseInt(e.target.value));
                                    handleEnseignementChange(index, {
                                        ...type, volumeHoraire: +e.target.value,
                                        typeEnseignement: type.typeEnseignement
                                    });
                                    setErrorTypesEnseignement("")
                                }}
                            />
                            
                            {index !== 0 && ( // Ne pas afficher le bouton de suppression pour le premier type
                                <button type="button" onClick={() => handleRemoveTypeEnseignement(index)}>
                                    {t('boutton.supprimer')}
                                </button>
                            )}
                        </div>
                    ))}
                    {errorTypesEnseignement && <p className="text-red-500">{errorTypesEnseignement}</p>}
                    {enseignementState.length < typesEnseignementMat.length && ( // Afficher le bouton d'ajout si tous les types n'ont pas été ajoutés
                        <button type="button" onClick={handleAddTypeEnseignement}>
                            {t('boutton.ajouter_type')}
                        </button>
                    )}
                </div>
{/* 
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
                </div> */}
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
