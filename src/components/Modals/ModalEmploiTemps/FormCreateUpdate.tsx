import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import {useEffect, useState } from 'react';
import { Niveau, niveaux } from '../../../pages/Admin/Niveaux';
import { Cycle, cycles } from '../../../pages/Admin/Cycles';
import { Jour, jours, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { Matiere, matieres } from '../../../pages/Admin/ListeMatieres';
import { SalleCours, sallesCours } from '../../../pages/Admin/SallesDeCours';
import { FaTrash } from 'react-icons/fa6';
import { TypeEnseignement } from '../../../pages/Admin/Chapitres';
import { useTranslation } from 'react-i18next';
import { setMatiereLoading, setMatieres, setErrorPageMatiere } from '../../../_redux/features/matiere_slice';
import { getMatieresByNiveauWithPagination } from '../../../api/api_matiere';
import createToast from '../../../hooks/toastify';
import { apiCreatePeriode, apiDeletePeriode, apiUpdatePeriode } from '../../../api/api_periode';
import { ReponseApiPros } from '../../../api/interface_reponse';
import { createPeriode, deletePeriode, updatePeriode } from '../../../_redux/features/periode_slice';
import { formatYear } from '../../../fonctions/fonction';



function ModalCreateUpdate({ periodeCours }: { periodeCours : PeriodeType | null }) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveau) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycle) ?? [];
    const sections: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.section) ?? [];
    const sallesCours: SalleDeCoursProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.salleDeCours) ?? [];
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typeEnseignement) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [section, setSection] = useState<CommonSettingProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [matiere, setMatiere] = useState<MatiereType>();
    const [semestre, setSemestre] = useState(0);
    const [annee, setAnnee] = useState(currentYear);
    const [salleCours, setSalleCours] = useState<SalleDeCoursProps>();
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);

    const [errorJour, setErrorJour] = useState("");
    const [errorHeureDebut, setErrorHeureDebut] = useState("");
    const [errorHeureFin, setErrorHeureFin] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorMatiere, setErrorMatiere] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [errorSalle, setErrorSalle] = useState("");
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);

    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les cycles en fonction de l'ID de la section
            const result: CycleProps[] = cycles.filter(cycle => "" + cycle.section === sectionId);

            setFilteredCycle(result);
            
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner
    const filterNiveauByCycle = (cycleId: string | undefined) => {
        if (cycleId && cycleId !== '') {
            // Filtrer les cycles en fonction de l'ID de la cycle
            const result: NiveauProps[] = niveaux.filter(niveau => "" + niveau.cycle === cycleId);

            setFilteredNiveau(result);
        }
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSectionLibelle = e.target.value;
        var selectedSection = null;

        if (lang === 'fr') {
            selectedSection = sections.find(section => section.libelleFr === selectedSectionLibelle);

        }
        else {
            selectedSection = sections.find(section => section.libelleEn === selectedSectionLibelle);

        }


        if (selectedSection) {
            setSection(selectedSection);
            filterCycleBySection(selectedSection._id);
            setErrorSection("");
        }
    };
    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycleLibelle = e.target.value;
        var selectedCycle = null;

        if (lang === 'fr') {
            selectedCycle = cycles.find(cycle => cycle.libelleFr === selectedCycleLibelle);

        }
        else {
            selectedCycle = cycles.find(cycle => cycle.libelleEn === selectedCycleLibelle);
        }

        if (selectedCycle) {
            setCycle(selectedCycle);
            filterNiveauByCycle(selectedCycle._id);
            setErrorCycle("");
        }
    };
    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauLibelle = e.target.value;
        var selectedNiveau = null;

        if (lang === 'fr') {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleFr === selectedNiveauLibelle);

        }
        else {
            selectedNiveau = filteredNiveau && filteredNiveau.find(niveau => niveau.libelleEn === selectedNiveauLibelle);

        }


        if (selectedNiveau) {
            setNiveau(selectedNiveau);
            setErrorNiveau("");
        }
    };

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
                if(periodeCours){
                    const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeCours.niveau);
                    setNiveau(currentNiveau);
                }
                if (niveau && niveau._id) {
                    
                    const fetchedMatieres = await getMatieresByNiveauWithPagination({ niveauId: niveau._id, page: 1 });
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
    }, [periodeCours, niveau, dispatch]);

    

    useEffect(() => {
        
        if (periodeCours) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.periode'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeCours.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            setJour(jours.find((jour)=> periodeCours.jour == jour.ordre));
            setHeureDebut(periodeCours.heureDebut);
            setHeureFin(periodeCours.heureFin);
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            const mat = matieres.find(matiere=> matiere._id === periodeCours.matiere._id);
            setMatiere(mat);
        
            const salleCours = sallesCours.find(salle=>salle._id===periodeCours.salleCours);
            setSalleCours(salleCours);
            const listeTypesEnseignementDeMatiere = matiere &&  matiere.typesEnseignement
                .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            const typeEnseignement = typesEnseignementMat.find(typeEnseignement=>typeEnseignement._id===periodeCours.typeEnseignement);
            setTypeEnseignement(typeEnseignement);
            setSemestre(periodeCours.semestre);
        } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.periode'));
            setJour(undefined);
            setHeureDebut("");
            setHeureFin("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
            setMatiere(undefined);
            setSalleCours(undefined);
            setTypeEnseignement(undefined);
            setSemestre(0);
            setFilteredCycle(undefined);
            setFilteredNiveau(undefined);
            setTypesEnseignementMat([]);
            
        }
        


        if (isFirstRender) {
            setIsDeleting(false);
            setErrorJour("");
            setHeureDebut("");
            setErrorHeureFin("");
            setErrorSection("");
            setErrorCycle("");
            setErrorNiveau("");
            setErrorMatiere("");
            setErrorSemestre("");
            setErrorSalle("");
            setErrorTypeEnseignement("");
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, matieres,  t]);
    // Troisième useEffect pour gérer le changement de matière sélectionnée
    useEffect(() => {
        if (matiere) {
            const listeTypesEnseignementDeMatiere = matiere.typesEnseignement
                .map(type => type.typeEnseignement)
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
    
            // Vérifier si le type d'enseignement de la période correspond à l'un des types d'enseignement de la matière
            if(periodeCours){
                const typeEnseignementPeriode = listeTypesEnseignementDeMatiere.find(type => type._id === periodeCours.typeEnseignement);
                if (typeEnseignementPeriode) {
                    setTypeEnseignement(typeEnseignementPeriode);
                }
            }
                
        }
    }, [matiere, typesEnseignement, periodeCours]);

    const closeModal = () => { 
        setErrorJour("");
        setErrorHeureDebut("");
        setErrorHeureFin("");
        setErrorSection("");
        setErrorCycle("");
        setErrorNiveau("");
        setErrorMatiere("");
        setErrorSemestre("");
        setErrorSalle("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleJourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedJourLibelle = e.target.value;
        const selectedJour = jours.find(jour => lang==='fr'?jour.libelleFr === selectedJourLibelle:jour.libelleEn === selectedJourLibelle);
        if (selectedJour) {
            setJour(selectedJour);
            setErrorJour("");
        }
    };

    
    const handleSalleCoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSalleCoursLibelle = e.target.value;
        const selectedSalleCours = sallesCours.find((salleCours) => salleCours.code === selectedSalleCoursLibelle);
        if (selectedSalleCours) {
            setSalleCours(selectedSalleCours);
            setErrorSalle("");
        }
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

    //verifier si l'heure de fin vient avant l'heure de début
    const verifierHeureFinApresDebut = (heureDebut: string, heureFin: string): boolean => {
        const debutMinutes = convertirHeureVersMinutes(heureDebut);
        const finMinutes = convertirHeureVersMinutes(heureFin);
    
        return finMinutes < debutMinutes;
    };

    // Fonction utilitaire pour convertir l'heure au format HH:MM en minutes
    const convertirHeureVersMinutes = (heure: string): number => {
        const [heures, minutes] = heure.split(':').map(Number);
        return heures * 60 + minutes;
    };
    
    

    
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleDelete = () => {
        setIsDeleting(!isDeleting);
    };

    const handleDelete = async () => {
        if (periodeCours?._id != undefined) {
            await apiDeletePeriode(periodeCours._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (periodeCours._id) {
                        dispatch(deletePeriode({ id: periodeCours._id }));
                    }

                    closeModal();
                    setIsDeleting(false); // Réinitialiser le toggle à false après la suppression
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

            })
        }
        
    };

    function handleCreatePeriodeCours(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreatePeriodeCours}
            >   
                <div style={{textAlign:'right'}}>
                <button onClick={handleToggleDelete} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                        {isDeleting ? (
                            <span>{t('label.confirm_sup')}</span>
                        ) : (
                            <FaTrash style={{ color: 'red', fontSize: '20px' }} />
                        )}
                        {isDeleting && (
                            <button onClick={closeModal} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                {t('boutton.non')}
                            </button>
                        )}
                        {isDeleting && (
                            <button onClick={handleDelete} style={{ marginLeft: '5px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                {t('boutton.oui')}
                            </button>
                        )}
                </button>
                </div>
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={formatYear(annee)}
                    readOnly  
                    onChange={(e) => {setAnnee(parseInt(e.target.value)); }}
                />
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.semestre')}</option>
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}
                    
                </select>
                {errorSemestre && <p className="text-red-500" >{errorSemestre}</p>}
                <label>{t('label.jour')}</label><label className="text-red-500"> *</label>
                <select
                    value={jour ? lang==='fr'?jour.libelleFr:jour.libelleEn : t('select_par_defaut.selectionnez')+t('select_par_defaut.jour')}
                    onChange={handleJourChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.jour')}</option>
                    {jours.map(jour => (
                        <option key={jour.ordre} value={lang==='fr'?jour.libelleFr:jour.libelleEn}>{lang==='fr'?jour.libelleFr:jour.libelleEn}</option>
                    ))}
                </select>
                {errorJour && <p className="text-red-500" >{errorJour}</p>}
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureDebut}
                    onChange={(e) => {setHeureDebut(e.target.value); setErrorHeureDebut("")}}
                />
                {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureFin}
                    onChange={(e) => {setHeureFin(e.target.value); setErrorHeureFin("")}}
                />
                {errorHeureFin && <p className="text-red-500" >{errorHeureFin}</p>}
                <label>{t('label.section')}</label><label className="text-red-500"> *</label>
                <select
                    value={section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : 'Sélectionnez une section'}
                    onChange={handleSectionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.section')}</option>
                    {sections.map(section => (
                        <option key={section._id} value={lang === 'fr' ? section.libelleFr : section.libelleEn}>{lang === 'fr' ? section.libelleFr : section.libelleEn}</option>
                    ))}
                </select>
                {errorSection && <p className="text-red-500">{errorSection}</p>}
                <label>{t('label.cycle')}</label><label className="text-red-500"> *</label>
                <select
                    value={cycle ? (lang === 'fr' ? cycle.libelleFr : cycle.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}
                    onChange={handleCycleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.cycle')}</option>
                    {filteredCycle && filteredCycle.map(cycle => (
                        <option key={cycle._id} value={lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}>{lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}</option>
                    ))}
                </select>
                {errorCycle && <p className="text-red-500">{errorCycle}</p>}
                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <select
                    value={niveau ? (lang === 'fr' ? niveau.libelleFr : niveau.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}
                    onChange={handleNiveauChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau')}</option>
                    {filteredNiveau && filteredNiveau.map(niveau => (
                        <option key={niveau._id} value={lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}>{lang === 'fr' ? niveau.libelleFr : niveau.libelleEn}</option>
                    ))}
                </select>
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}
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
                <label>{t('label.salle_cour')}</label><label className="text-red-500"> *</label>
                <select
                    value={salleCours ?salleCours.code : t('select_par_defaut.selectionnez')+t('select_par_defaut.salle')}
                    onChange={handleSalleCoursChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez')+t('select_par_defaut.salle')}</option>
                    {sallesCours.map(salleCours => (
                        <option key={salleCours._id} value={salleCours.code}>{salleCours.code}</option>
                    ))}
                </select>
                {errorSalle && <p className="text-red-500">{errorSalle}</p>}
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
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
