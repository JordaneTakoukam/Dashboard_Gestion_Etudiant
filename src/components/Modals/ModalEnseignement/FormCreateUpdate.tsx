import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { getMatieresByNiveau } from '../../../api/api_matiere';
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from '../../../_redux/features/matiere_slice';
import createToast from '../../../hooks/toastify';
import { apiUpdatePeriodeEnseignement } from '../../../api/api_periode_enseignement';
import { ajouterEnseignement, modifierEnseignement } from '../../../_redux/features/periode_enseignement_slice';



function ModalCreateUpdate({ enseignement, periodeEnseignement }: { enseignement: MatiereEnseignement | null, periodeEnseignement:PeriodeEnseignementType | null | undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    // const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    
    const [matiere, setMatiere] = useState<MatiereType>();
    // const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    // const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);
    const [nombreSeance, setNombreSeance ] = useState(0);

    const [errorMatiere, setErrorMatiere] = useState("");
    const [errornbSeance, setErrorNbSeance] = useState("");
    // const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    useEffect(() => {

        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const matieresV: MatiereReturnGetType = {
                    matieres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                if (periodeEnseignement && periodeEnseignement.niveau) {
                    
                    const fetchedMatieres = await getMatieresByNiveau({ niveauId: periodeEnseignement.niveau});
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                    } else {

                        dispatch(setMatieres(matieresV));
                    }
                } else {

                    dispatch(setMatieres(matieresV));

                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchMatieres();
    }, [enseignement,isFirstRender, periodeEnseignement && periodeEnseignement.niveau, dispatch]);

    useEffect(() => {
        if (enseignement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.enseignement'));
            setMatiere(enseignement.matiere);
            // const listeTypesEnseignementDeMatiere = matiere && matiere.typesEnseignement &&  matiere.typesEnseignement
            // .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
            // .map(objectId => typesEnseignement.find(type => type._id === objectId))
            // .filter(type => type !== undefined) as CommonSettingProps[];
            // listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            // const typeEnseignement = typesEnseignementMat.find(typeEnseignement=>typeEnseignement._id===enseignement.typeEnseignement);
            // setTypeEnseignement(typeEnseignement);
            setNombreSeance(enseignement.nombreSeance);    
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.enseignement'));
            setMatiere(undefined);
            // setTypeEnseignement(undefined);
            setNombreSeance(0);
        }
        if (isFirstRender) {
            setErrorMatiere("");
            // setErrorTypeEnseignement("");
            setErrorNbSeance("");
            setIsFirstRender(false);
        }
    }, [enseignement,  isFirstRender, t]);

    // useEffect(() => {
    //     if (matiere && matiere.typesEnseignement) {
    //         const listeTypesEnseignementDeMatiere = matiere.typesEnseignement
    //             .map(type => type.typeEnseignement)
    //             .map(objectId => typesEnseignement.find(type => type._id === objectId))
    //             .filter(type => type !== undefined) as CommonSettingProps[];
    //         setTypesEnseignementMat(listeTypesEnseignementDeMatiere);

    //         // Vérifier si le type d'enseignement de la période correspond à l'un des types d'enseignement de la matière
    //         if (enseignement) {
    //             const typeEnseignementPeriode = listeTypesEnseignementDeMatiere.find(type => type._id === enseignement.typeEnseignement);
    //             if (typeEnseignementPeriode) {
    //                 setTypeEnseignement(typeEnseignementPeriode);
    //             }
    //         }

    //     }
    // }, [matiere, typesEnseignement, enseignement]);

    const closeModal = () => {
        setErrorMatiere("");
        // setErrorTypeEnseignement("");
        setErrorNbSeance("");
        dispatch(setMatiereLoading(false)); // Définissez le loading à true avant le chargement
        const matieresV:MatiereReturnGetType={
            matieres: [],
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            pageSize: 0
        } 
        dispatch(setMatieres(matieresV));
        dispatch(setErrorPageMatiere(""));
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleMatiereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMatiereLibelle = e.target.value;
        const selectedMatiere = matieres.find((matiere) => lang === 'fr' ? matiere.libelleFr === selectedMatiereLibelle :  matiere.libelleEn === selectedMatiereLibelle);
        if (selectedMatiere) {
            setMatiere(selectedMatiere);
            setErrorMatiere("");
            // const listeTypesEnseignementDeMatiere = selectedMatiere.typesEnseignement && selectedMatiere.typesEnseignement
            //     .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
            //     .map(objectId => typesEnseignement.find(type => type._id === objectId))
            //     .filter(type => type !== undefined) as CommonSettingProps[];
            // if(listeTypesEnseignementDeMatiere){
            //     setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            // }
        }

        
    };

    // const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedCode = e.target.value;
    //     const selectedTypeEnseignement = typesEnseignementMat.find(typeEnseignement => typeEnseignement.code === selectedCode);
    //     if (selectedTypeEnseignement) {
    //         setTypeEnseignement(selectedTypeEnseignement);
    //         // setErrorTypeEnseignement("");
    //     }
    // };

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        // if (!matiere || !typeEnseignement || !nombreSeance ) {
        if (!matiere || !nombreSeance ) {
            if (!matiere) {
                setErrorMatiere(t('error.matiere'));
            }
            // if (!typeEnseignement) {
            //     setErrorTypeEnseignement(t('error.type_ens'));
            // }
            if (!nombreSeance) {
                setErrorNbSeance(t('error.nb_seance'));
            }
            return;
        }


        
        if (periodeEnseignement) {
            
            const updatedEnseignement: MatiereEnseignement = {
                _id: enseignement?._id,
                // typeEnseignement: typeEnseignement?._id || '',
                matiere,
                nombreSeance,
                nbSeancesPratiquees: enseignement?.nbSeancesPratiquees??0
            };
            
            
           
            var newEnseignements: MatiereEnseignement[] = [];
            for (let i = 0;periodeEnseignement.enseignements &&  i < ( periodeEnseignement.enseignements ? periodeEnseignement.enseignements.length : 0); i++) {
                const ens = periodeEnseignement.enseignements[i];
                newEnseignements.push(ens);
            }
            const index = newEnseignements.findIndex((obj) => obj._id === enseignement?._id);
            if (index !== -1) {
                newEnseignements[index] = updatedEnseignement;
            }else{
                newEnseignements.push(updatedEnseignement)
            }
            
            await apiUpdatePeriodeEnseignement(
                {
                    semestre : periodeEnseignement.semestre,
                    annee : periodeEnseignement.annee,
                    periodeFr : periodeEnseignement.periodeFr,
                    periodeEn : periodeEnseignement.periodeEn,
                    dateDebut : periodeEnseignement.dateDebut,
                    dateFin : periodeEnseignement.dateFin,
                    niveau:periodeEnseignement.niveau,
                    enseignements:newEnseignements,
                    _id:periodeEnseignement._id
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    dispatch(modifierEnseignement({...e.data})); 
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
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
                <label>{t('label.matiere')}</label><label className="text-red-500"> *</label>
                {!enseignement && <select
                    value={matiere ? lang==='fr'?matiere.libelleFr:matiere.libelleEn : t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}
                    onChange={handleMatiereChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}</option>
                    {matieres
                        .filter(matiere => periodeEnseignement && periodeEnseignement.enseignements && !periodeEnseignement.enseignements.some(enseignement => enseignement.matiere._id === matiere._id))
                        .map(matiere => (
                            <option key={matiere._id} value={lang === 'fr' ? matiere.libelleFr : matiere.libelleEn}>
                                {lang === 'fr' ? matiere.libelleFr : matiere.libelleEn}
                            </option>
                    ))}
                </select>}
                {enseignement && (
                    <select
                        value={matiere ? (lang === 'fr' ? matiere.libelleFr : matiere.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.matiere')}
                        onChange={handleMatiereChange}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.matiere')}</option>
                        {enseignement.matiere && ( // Vérifie si une matière est déjà sélectionnée dans l'enseignement
                            <option key={enseignement.matiere._id} value={lang === 'fr' ? enseignement.matiere.libelleFr : enseignement.matiere.libelleEn}>
                                {lang === 'fr' ? enseignement.matiere.libelleFr : enseignement.matiere.libelleEn}
                            </option>
                        )}
                        {matieres
                            .filter(matiere => periodeEnseignement && periodeEnseignement.enseignements && !periodeEnseignement.enseignements.some(enseignement => enseignement.matiere._id === matiere._id))
                            .map(matiere => (
                                <option key={matiere._id} value={lang === 'fr' ? matiere.libelleFr : matiere.libelleEn}>
                                    {lang === 'fr' ? matiere.libelleFr : matiere.libelleEn}
                                </option>
                        ))}
                    </select>
                )}

                {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
                
                {/* <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
                <select
                    value={typeEnseignement ? typeEnseignement.code : t('select_par_defaut.selectionnez')+t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.type_ens')}</option>
                    {typesEnseignementMat.map(typeEnseignement => (
                        <option key={typeEnseignement._id} value={typeEnseignement.code}>{typeEnseignement.code}</option>
                    ))}
                </select>
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>} */}
                <label>{t('label.nb_seance')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={nombreSeance}
                    onChange={(e) => {setNombreSeance(parseInt(e.target.value)); setErrorNbSeance("") }}
                />
                {errornbSeance && <p className="text-red-500">{errornbSeance}</p>}
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
