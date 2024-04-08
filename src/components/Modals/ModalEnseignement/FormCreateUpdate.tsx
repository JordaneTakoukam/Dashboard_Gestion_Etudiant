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
import { ReponseApiPros } from '../../../api/interface_reponse';
import { updatePeriodeEnseignement } from '../../../_redux/features/periode_enseignement_slice';



function ModalCreateUpdate({ enseignement, periodeEnseignement }: { enseignement: MatiereEnseignement | null, periodeEnseignement:PeriodeEnseignementType | undefined}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typeEnseignement) ?? [];
    
    const [matiere, setMatiere] = useState<MatiereType>();
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);
    const [nombreSeance, setNombreSeance ] = useState(0);

    const [errorMatiere, setErrorMatiere] = useState("");
    const [errornbSeance, setErrorNbSeance] = useState("");
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    const [matieresLoaded, setMatieresLoaded] = useState(false);

    useEffect(() => {
        
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const matieresV:MatiereReturnGetType={
                    matieres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                if (periodeEnseignement) {
                    
                    const fetchedMatieres = await getMatieresByNiveau({ niveauId: periodeEnseignement.niveau});
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                    } else {
                        
                        dispatch(setMatieres(matieresV));
                    }
                }else{
                   
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
    }, [periodeEnseignement, dispatch]);

    useEffect(() => {
        if (enseignement) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.enseignement'));
            setMatiere(enseignement.matiere);
            const listeTypesEnseignementDeMatiere = matiere &&  matiere.typesEnseignement
            .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
            .map(objectId => typesEnseignement.find(type => type._id === objectId))
            .filter(type => type !== undefined) as CommonSettingProps[];
            listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            const typeEnseignement = typesEnseignementMat.find(typeEnseignement=>typeEnseignement._id===enseignement.typesEnseignement);
            setTypeEnseignement(typeEnseignement);
            setNombreSeance(enseignement.nombreSeance);    
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.enseignement'));
            setMatiere(undefined);
            setTypeEnseignement(undefined);
            setNombreSeance(0);
        }
        if (isFirstRender) {
            setErrorMatiere("");
            setErrorTypeEnseignement("");
            setErrorNbSeance("");
            setIsFirstRender(false);
        }
    }, [enseignement,  isFirstRender, t]);

    const closeModal = () => {
        setErrorMatiere("");
        setErrorTypeEnseignement("");
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
            const listeTypesEnseignementDeMatiere = selectedMatiere.typesEnseignement
                .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            if(listeTypesEnseignementDeMatiere){
                setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            }
        }

        
    };

    const handleTypeEnseignementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const selectedTypeEnseignement = typesEnseignementMat.find(typeEnseignement => typeEnseignement.code === selectedCode);
        if (selectedTypeEnseignement) {
            setTypeEnseignement(selectedTypeEnseignement);
            setErrorTypeEnseignement("");
        }
    };

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!matiere || !typeEnseignement || !nombreSeance ) {
            if (!matiere) {
                setErrorMatiere(t('error.matiere'));
            }
            if (!typeEnseignement) {
                setErrorTypeEnseignement(t('error.type_ens'));
            }
            if (!nombreSeance) {
                setErrorNbSeance(t('error.nb_seance'));
            }
            return;
        }

        if (periodeEnseignement) {
            
            if(typeEnseignement._id){
                const enseignement : MatiereEnseignement ={
                    matiere: matiere,
                    typesEnseignement: typeEnseignement._id,
                    nombreSeance: nombreSeance
                }
                periodeEnseignement.enseignements?.push(enseignement);
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
                    enseignements:periodeEnseignement.enseignements
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(
                        updatePeriodeEnseignement({
                            id: e.data._id,
                            periodeEnseignementData: {
                                _id: e.data._id,
                                annee: e.data.annee,
                                semestre: e.data.semestre,
                                niveau: e.data.niveau,
                                periodeFr: e.data.periodeFr,
                                periodeEn: e.data.periodeEn,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                enseignements: e.data.enseignements
                            }
                        }));
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
                <select
                    value={matiere ? lang==='fr'?matiere.libelleFr:matiere.libelleEn : t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}
                    onChange={handleMatiereChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.matiere')}</option>
                    {matieres.map(matiere => (
                        <option key={matiere._id} value={lang==='fr'?matiere.libelleFr:matiere.libelleEn}>{lang==='fr'?matiere.libelleFr:matiere.libelleEn}</option>
                    ))}
                </select>
                {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
                
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
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
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
                <label>{t('label.nb_seance')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={""}
                    readOnly  
                    onChange={(e) => {setNombreSeance(parseInt(e.target.value)); }}
                />
                
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;
