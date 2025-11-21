import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useRef, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { apiCreateObjectif, apiUpdateObjectif } from '../../../api/api_objectif';
import { ajouterObjectif, modifierObjectif } from '../../../_redux/features/matiere_slice';
import { createObjectif, updateObjectif } from '../../../_redux/features/objectif_slice';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { formatYear } from '../../../fonctions/fonction';
import { config } from '../../../config';
import { apiSearchChapitre } from '../../../api/api_chapitre';
import SearchInput from '../../ui/SearchInput';



function ModalCreateUpdate({ objectif, matiere  }: { objectif: ObjectifType | null, matiere:MatiereType | undefined }) {
    const lang:string = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [etat, setEtat]=useState(0);
    const [statut, setStatut]=useState(0);
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    
    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const currentUser: UserState = useSelector((state: RootState) => state.user);

    const [resultsChapitre, setResultsChapitre] = useState<ChapitreType[]>([]);
    const [isLoadingChapitre, setIsLoadingChapitre] = useState(false);
    const [queryChapitre, setQueryChapitre] = useState('');
    const latestQueryChapitre = useRef('');
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType>();
    const statuts:string[]=[t('label.approuver'), t('label.non_approuver')];
    const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatut = e.target.value;
        setStatut(0);
        if(selectedStatut === t('label.approuver')){
            setStatut(1);
        }
    };
    
   
    useEffect(() => {
        
        if (objectif) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.objectif'));
            setAnnee(objectif.annee);
            setSemestre(objectif.semestre);
            setCode(objectif.code);
            setLibelleFr(objectif.libelleFr);
            setLibelleEn(objectif.libelleEn);
            setEtat(objectif.etat);
            setStatut(objectif.statut);
            setSelectedChapitre(objectif.chapitre);
            objectif.chapitre?setQueryChapitre(`${lang==='fr'?objectif.chapitre.libelleFr:objectif.chapitre.libelleEn}`.trim()):setQueryChapitre('');
            
            
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.objectif'));
            setAnnee(currentYear);
            setSemestre(currentSemester);
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setEtat(0);
            setStatut(0);
            setSelectedChapitre(undefined);
            setQueryChapitre('');
        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorSemestre("");
            setIsFirstRender(false);
        }
    }, [objectif,  isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorSemestre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleBlurChapitre = () => {
        setTimeout(() => {
        setResultsChapitre([]);
        }, 200); // Délai pour permettre l'exécution de l'événement de clic
    };

    const handleSelectChapitre = (chapitre:ChapitreType) => {
        setSelectedChapitre(chapitre);
        setQueryChapitre(`${lang==='fr'?chapitre.libelleFr:chapitre.libelleEn}`.trim());
        setResultsChapitre([]);
      };
      
    //Rechercher un chapitre
    const handleSearchChapitre = async (queryChapitre: string) => {
        setIsLoadingChapitre(true);
        latestQueryChapitre.current = queryChapitre;
      
        try {
          if (queryChapitre === '') {
            setSelectedChapitre(undefined);
            setQueryChapitre("");
            setResultsChapitre([]);
          } else if (queryChapitre.trim().length > 0) {
            const result = await apiSearchChapitre({ langue:lang, searchString: queryChapitre, limit:5, matiereId:matiere?._id??"", annee:annee });
            // Vérifiez si la requête actuelle correspond toujours à la dernière requête
            if (latestQueryChapitre.current === queryChapitre) {
              setResultsChapitre(result.chapitres);
            }
          } else {
            setSelectedChapitre(undefined);
            setQueryChapitre("");
            setResultsChapitre([]);
          }
        } catch (error) {
          console.error('Error fetching search resultsChapitre:', error);
          createToast(t('message.erreur'), "", 2)
        } finally {
          if (latestQueryChapitre.current === queryChapitre) {
            setIsLoadingChapitre(false);
          }
        }
    };

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if ( !libelleFr || !libelleEn || !semestre) {
            if (!semestre) {
                setErrorSemestre(t('error.semestre'));
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
            if(currentUser.role == config.roles.admin || currentUser.role == config.roles.superAdmin){
                setStatut(1);
            }
            if(matiere?._id){ 
                setIsLoading(true)
                await apiCreateObjectif(
                    {
                        annee:annee,
                        semestre:semestre,
                        code:code, 
                        libelleFr:libelleFr, 
                        libelleEn:libelleEn, 
                        etat:0,
                        statut,
                        matiere:matiere?._id,
                        chapitre:selectedChapitre?._id,
                        user:currentUser._id
                        
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createObjectif({
                            
                            objectif: {
                                _id: e.data._id,
                                annee:e.data.annee,
                                semestre:e.data.semestre,
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                etat: e.data.etat,
                                statut:e.data.statut,
                                matiere: matiere,
                                chapitre:selectedChapitre
                            }
                            
                        }));
                        // dispatch(ajouterObjectif({...e.data}))
                        closeModal();

                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false);
                })
            }
            
        }else{
            setIsLoading(true)
            await apiUpdateObjectif(
                {
                    _id:objectif._id, 
                    annee:annee,
                    semestre:semestre,
                    code:code, 
                    libelleFr:libelleFr, 
                    libelleEn:libelleEn, 
                    etat:objectif.etat,
                    matiere:objectif.matiere,
                    chapitre:selectedChapitre,
                    statut:statut
                    
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    
                    // dispatch(modifierObjectif({...e.data}))
                    dispatch(
                        updateObjectif({
                            id: e.data._id,
                            objectifData: {
                                _id: e.data._id,
                                annee:e.data.annee,
                                semestre:e.data.semestre,
                                code:e.data.code,
                                libelleFr:e.data.libelleFr,
                                libelleEn:e.data.libelleEn,
                                etat:e.data.etat,
                                statut:e.data.statut,
                                matiere:matiere,
                                chapitre:selectedChapitre,
                            }
                        }));
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.responsmatiere.message[lang as keyof typeof e.responsmatiere.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
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
                isLoading={isLoading}
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
                {(currentUser.role=== config.roles.admin || currentUser.role=== config.roles.superAdmin) && <>
                    <label>{t('label.statut')}</label>
                    <select
                        value={objectif ? (statut==1 ? t('label.approuver') : t('label.non_approuver')) : t('select_par_defaut.selectionnez') + t('select_par_defaut.statut')}
                        onChange={handleStatutChange}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.statut')}</option>
                        {statuts.map(stat => (
                            <option key={statuts.indexOf(stat)} value={stat.toString()}>{stat.toString()}</option>
                        ))}
                    </select>
                </>}
                <label>{t('label.chapitre')}</label>
                <div >
                    <SearchInput 
                        onSearch={handleSearchChapitre} 
                        placeHolder={t('recherche.rechercher')+t('recherche.chapitre')}
                        style="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        query={queryChapitre}
                        setQuery={setQueryChapitre}
                        onBlur={handleBlurChapitre}
                    />
                    {isLoadingChapitre ? (
                        <p>{t('label.recherche')}</p>
                    ) : resultsChapitre.length>0 && (
                        <ul className="border mt-2">
                            {resultsChapitre.map((chapitre) => (
                                <li 
                                    key={chapitre._id} 
                                    className="p-2 border-b cursor-pointer"
                                    onClick={() => handleSelectChapitre(chapitre)}
                                >
                                    {lang==='fr'?chapitre.libelleFr:chapitre.libelleEn}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;


// function ModalCreateUpdate({ objectif, chapitre, matiere  }: { objectif: ObjectifType | null, chapitre : ChapitreType |undefined|null, matiere:MatiereType | undefined | null }) {
//     const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
//     const {t}=useTranslation();
//     const dispatch = useDispatch();
//     const [code, setCode] = useState("");
//     const [libelleFr, setLibelleFr] = useState("");
//     const [libelleEn, setLibelleEn] = useState("");
//     const [etat, setEtat]=useState(0);
    
//     const [errorCode, setErrorCode] = useState("");
//     const [errorLibelleFr, setErrorLibelleFr] = useState("");
//     const [errorLibelleEn, setErrorLibelleEn] = useState("");

   
//     const [isFirstRender, setIsFirstRender] = useState(true);
//     const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
//     const [modalTitle, setModalTitle] = useState("");
   
//     useEffect(() => {
        
//         if (objectif) {
//             setModalTitle(t('form_update.enregistrer')+t('form_update.objectif'));
//             setCode(objectif.code);
//             setLibelleFr(objectif.libelleFr);
//             setLibelleEn(objectif.libelleEn);
//             setEtat(objectif.etat);
            
            
//         }else{
//             setModalTitle(t('form_save.enregistrer')+t('form_save.objectif'));
//             setCode("");
//             setLibelleFr("");
//             setLibelleEn("");
//             setEtat(0);
//         }
//         if (isFirstRender) {
//             setErrorCode("");
//             setErrorLibelleFr("");
//             setErrorLibelleEn("");
//             setIsFirstRender(false);
//         }
//     }, [objectif,  isFirstRender, t]);

//     const closeModal = () => {
//         setErrorCode("");
//         setErrorLibelleFr("");
//         setErrorLibelleEn("");
//         setIsFirstRender(true);
//         dispatch(setShowModal());
//     };

//     const handleCreateUpdate = async () => {
//         // Vérifier si tous les champs requis sont remplis
//         if (!code || !libelleFr || !libelleEn) {
//             if (!code) {
//                 setErrorCode(t('error.code'));
//             }
//             if (!libelleFr) {
//                 setErrorLibelleFr(t('error.libelle_fr'));
//             }
//             if (!libelleEn) {
//                 setErrorLibelleEn(t('error.libelle_en'));
//             }
            
//             return;
//         }
       
//         if (!objectif) {
//             if (chapitre && chapitre._id) {
//                 var newObjectifs:ObjectifType[] = [];
//                 for (let i = 0; chapitre.objectifs && i < chapitre.objectifs.length; i++) {
//                     const objectif = chapitre.objectifs[i];
//                     newObjectifs.push(objectif)
//                 }
//                 newObjectifs.push({
//                     code,
//                     libelleFr,
//                     libelleEn,
//                     etat
//                 })
//                 await apiUpdateChapitre(
//                     {
//                         _id:chapitre._id, 
//                         code:chapitre.code, 
//                         libelleFr:chapitre.libelleFr, 
//                         libelleEn:chapitre.libelleEn, 
//                         matiere:chapitre.matiere,
//                         typesEnseignement:chapitre.typesEnseignement,
//                         objectifs:newObjectifs,
//                     }
//                 ).then((e: ReponseApiPros) => {
//                     if (e.success) {
//                         createToast(e.message[lang as keyof typeof e.message], '', 0);
//                         const chap= {
//                             _id: e.data._id,
//                             code: e.data.code, 
//                             libelleFr: e.data.libelleFr, 
//                             libelleEn: e.data.libelleEn, 
//                             typesEnseignement:chapitre.typesEnseignement, 
//                             matiere:e.data.matiere, 
//                             objectifs:e.data.objectifs,
//                         }
                        
//                         const newChapitres:ChapitreType[] = [];
//                         if(matiere){
//                             for (let i = 0; matiere.chapitres && i < matiere.chapitres.length; i++) {
//                                 const chap = matiere.chapitres[i];
//                                 // if(chapitre._id!==chap._id){
//                                 newChapitres.push(chap)
//                                 // }
//                             }
//                             const index = newChapitres.findIndex(e => e._id === chapitre._id);
//                             if (index !== -1) {
//                                 newChapitres[index]=chap;
//                             }else{
//                                 newChapitres.push(chap)
//                             }
//                         }
                        
//                         if(matiere && matiere._id){    
//                             dispatch(
//                                 updateMatiere({
//                                     id: matiere._id,
//                                     matiereData: {
//                                         _id: matiere._id,
//                                         code:matiere.code,
//                                         libelleFr:matiere.libelleFr,
//                                         libelleEn:matiere.libelleEn,
//                                         niveau:matiere.niveau, 
//                                         prerequisFr:matiere.prerequisFr, 
//                                         prerequisEn:matiere.prerequisEn, 
//                                         approchePedFr:matiere.approchePedFr, 
//                                         approchePedEn:matiere.approchePedEn, 
//                                         evaluationAcquisFr:matiere.evaluationAcquisFr, 
//                                         evaluationAcquisEn:matiere.evaluationAcquisEn,
//                                         typesEnseignement:matiere.typesEnseignement,
//                                         chapitres:newChapitres,
        
//                                     }
//                                 }));
//                             }
//                         closeModal();

//                     } else {
//                         createToast(e.message[lang as keyof typeof e.message], '', 2);

//                     }
//                 }).catch((e) => {
//                     console.log(e);
//                     createToast(e.responsmatiere.message[lang as keyof typeof e.responsmatiere.message], '', 2);
//                 })
//             }
//         }else{
//             if (chapitre && chapitre._id) {
//                 const updatedObjectif: ObjectifType = {
//                     _id: objectif._id,
//                     code,
//                     libelleFr,
//                     libelleEn,
//                     etat: objectif.etat
//                 };
               
//                 var newObjectifs:ObjectifType[] = [];
//                 for (let i = 0; chapitre.objectifs && i < chapitre.objectifs.length; i++) {
//                     const objectif = chapitre.objectifs[i];
//                     newObjectifs.push(objectif)
//                 }
//                 const index = newObjectifs.findIndex((obj) => obj._id === objectif?._id);
//                 if (index !== -1) {
//                     newObjectifs[index] = updatedObjectif;
//                 }
//                 console.log(newObjectifs)
//                 await apiUpdateChapitre(
//                     {
//                         _id:chapitre._id, 
//                         code:chapitre.code, 
//                         libelleFr:chapitre.libelleFr, 
//                         libelleEn:chapitre.libelleEn, 
//                         matiere:chapitre.matiere,
//                         typesEnseignement:chapitre.typesEnseignement,
//                         objectifs:newObjectifs
//                     }
//                 ).then((e: ReponseApiPros) => {
//                     if (e.success) {
                        
//                         const chap= {
//                             _id: e.data._id,
//                             code: e.data.code, 
//                             libelleFr: e.data.libelleFr, 
//                             libelleEn: e.data.libelleEn, 
//                             typesEnseignement:chapitre.typesEnseignement, 
//                             matiere:e.data.matiere, 
//                             objectifs:e.data.objectifs,
//                         }

//                         const newChapitres:ChapitreType[] = [];
//                         if(matiere){
//                             for (let i = 0; matiere.chapitres && i < matiere.chapitres.length; i++) {
//                                 const chap = matiere.chapitres[i];
//                                 // if(chapitre._id!==chap._id){
//                                 newChapitres.push(chap)
//                                 // }
//                             }
//                             const index = newChapitres.findIndex(e => e._id === chapitre._id);
//                             if (index !== -1) {
//                                 newChapitres[index]=chap;
//                             }
//                         }
                        
//                         if(matiere && matiere._id){    
//                             dispatch(
//                                 updateMatiere({
//                                     id: matiere._id,
//                                     matiereData: {
//                                         _id: matiere._id,
//                                         code:matiere.code,
//                                         libelleFr:matiere.libelleFr,
//                                         libelleEn:matiere.libelleEn,
//                                         niveau:matiere.niveau, 
//                                         prerequisFr:matiere.prerequisFr, 
//                                         prerequisEn:matiere.prerequisEn, 
//                                         approchePedFr:matiere.approchePedFr, 
//                                         approchePedEn:matiere.approchePedEn, 
//                                         evaluationAcquisFr:matiere.evaluationAcquisFr, 
//                                         evaluationAcquisEn:matiere.evaluationAcquisEn,
//                                         typesEnseignement:matiere.typesEnseignement,
//                                         chapitres:newChapitres,
        
//                                     }
//                                 }));
//                             }
//                         createToast(e.message[lang as keyof typeof e.message], '', 0);
//                         closeModal();
//                     } else {
//                         createToast(e.message[lang as keyof typeof e.message], '', 2);
//                     }
//                 }).catch((e) => {
//                     createToast(e.responsmatiere.message[lang as keyof typeof e.responsmatiere.message], '', 2);
//                 })
//             }
//         }
//     };

//     return (
//         <>
//             <CustomDialogModal
//                 title={modalTitle}
//                 isModalOpen={isModalOpen}
//                 isDelete={false}
//                 closeModal={closeModal}
//                 handleConfirm={handleCreateUpdate}
//             >
                
//                 <label>{t('label.code')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={code}
//                     onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
//                 />
//                 {errorCode && <p className="text-red-500">{errorCode}</p>}
//                 <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={libelleFr}
//                     onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
//                 />
//                 {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
//                 <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
//                 <input
//                     className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                     type="text"
//                     value={libelleEn}
//                     onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn("") }}
//                 />
//                 {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
//             </CustomDialogModal>
//         </>
//     );
// }
