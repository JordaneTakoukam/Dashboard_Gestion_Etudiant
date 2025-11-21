import { useDispatch, useSelector } from 'react-redux';
import { setPeriodeIndex, setShowModal, } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useRef, useState } from 'react';
import { Jour, jours, semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { useTranslation } from 'react-i18next';
import { apiSearchMatiere } from '../../../api/api_matiere';
import createToast from '../../../hooks/toastify';
import { createPeriode, deletePeriode, updatePeriode } from '../../../_redux/features/periode_slice';
import { formatYear } from '../../../fonctions/fonction';
import { apiCreatePeriode, apiDeletePeriode, apiUpdatePeriode } from '../../../api/api_periode';
import { apiSearchEnseignant } from '../../../api/other_users/api_enseignant';
import SearchInput from '../../ui/SearchInput';



function ModalCreateUpdate({ periodeCours }: { periodeCours: PeriodeType | null}) {
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections: SectionProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const sallesCours: SalleDeCoursProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.sallesDeCours) ?? [];
    const typesEnseignement: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const index = useSelector((state: RootState) => state.setting.periodeIndex); // index courant à modifier
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [jour, setJour] = useState<Jour>();
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();
    const [niveau, setNiveau] = useState<NiveauProps>();
    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);
    const [salleCours, setSalleCours] = useState<SalleDeCoursProps>();
    const [typeEnseignement, setTypeEnseignement] = useState<CommonSettingProps>();
    const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorJour, setErrorJour] = useState("");
    const [errorHeureDebut, setErrorHeureDebut] = useState("");
    const [errorHeureFin, setErrorHeureFin] = useState("");
    const [errorSection, setErrorSection] = useState("");
    const [errorCycle, setErrorCycle] = useState("");
    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorMatiere, setErrorMatiere] = useState("");
    const [errorEnseignant, setErrorEnseignant] = useState("");
    const [errorSemestre, setErrorSemestre] = useState("");
    const [errorSalle, setErrorSalle] = useState("");
    const [errorTypeEnseignement, setErrorTypeEnseignement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[] | undefined>([]);
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[] | undefined>([]);

    const [resultsEnsPrincipal, setResultsEnsPrincipal] = useState<EnseignantType[]>([]);
    const [resultsEnsSuppleant, setResultsEnsSuppleant] = useState<EnseignantType[]>([]);
    const [resultsMatiere, setResultsMatiere] = useState<MatiereType[]>([]);
    const [isLoadingEnsPrincipal, setIsLoadingEnsPrincipal] = useState(false);
    const [isLoadingEnsSuppleant, setIsLoadingEnsSuppleant] = useState(false);
    const [isLoadingMatiere, setIsLoadingMatiere] = useState(false);
    const [queryEnsPrincipal, setQueryEnsPrincipal] = useState('');
    const [queryEnsSuppleant, setQueryEnsSuppleant] = useState('');
    const [queryMatiere, setQueryMatiere] = useState('');
    const latestQueryEnsPrincipal = useRef('');
    const latestQueryEnsSuppleant = useRef('');
    const latestQueryMatiere = useRef('');
    const [selectedEnsPrincipal, setSelectedEnsPrincipal] = useState<EnseignantType>();
    const [selectedEnsSuppleant, setSelectedEnsSuppleant] = useState<EnseignantType>();
    const [selectedMatiere, setSelectedMatiere] = useState<MatiereType>();

    //Rechercher un enseignant principal
    const handleSearchEnsPrincipal = async (queryEnsPrincipal: string) => {
        setIsLoadingEnsPrincipal(true);
        latestQueryEnsPrincipal.current = queryEnsPrincipal;
    
        try {
          if (queryEnsPrincipal === '') {
            setSelectedEnsPrincipal(undefined);
            setQueryEnsPrincipal("");
            setResultsEnsPrincipal([]);
          } else if (queryEnsPrincipal.trim().length > 0) {
            const result = await apiSearchEnseignant({ searchString: queryEnsPrincipal, limit:5 });
            // Vérifiez si la requête actuelle correspond toujours à la dernière requête
            if (latestQueryEnsPrincipal.current === queryEnsPrincipal) {
              setResultsEnsPrincipal(result.enseignants);
            }
          } else {
            setSelectedEnsPrincipal(undefined);
            setQueryEnsPrincipal("");
            setResultsEnsPrincipal([]);
          }
        } catch (error) {
          console.error('Error fetching search resultsEnsPrincipal:', error);
          createToast(t('message.erreur'), "", 2)
        } finally {
          if (latestQueryEnsPrincipal.current === queryEnsPrincipal) {
            setIsLoadingEnsPrincipal(false);
          }
        }
    };

    //Rechercher un enseignant suppleant
    const handleSearchEnsSuppleant = async (queryEnsSuppleant: string) => {
        setIsLoadingEnsSuppleant(true);
        latestQueryEnsSuppleant.current = queryEnsSuppleant;
    
        try {
          if (queryEnsSuppleant === '') {
            setSelectedEnsSuppleant(undefined);
            setQueryEnsSuppleant("");
            setResultsEnsSuppleant([]);
          } else if (queryEnsSuppleant.trim().length > 0) {
            const result = await apiSearchEnseignant({ searchString: queryEnsSuppleant, limit:5 });
            // Vérifiez si la requête actuelle correspond toujours à la dernière requête
            if (latestQueryEnsSuppleant.current === queryEnsSuppleant) {
              setResultsEnsSuppleant(result.enseignants);
            }
          } else {
            setSelectedEnsSuppleant(undefined);
            setQueryEnsSuppleant("");
            setResultsEnsSuppleant([]);
          }
        } catch (error) {
          console.error('Error fetching search resultsEnsSuppleant:', error);
          createToast(t('message.erreur'), "", 2)
        } finally {
          if (latestQueryEnsSuppleant.current === queryEnsSuppleant) {
            setIsLoadingEnsSuppleant(false);
          }
        }
    };

    //Rechercher une matiere
    const handleSearchMatiere = async (queryMatiere: string) => {
        setIsLoadingMatiere(true);
        latestQueryMatiere.current = queryMatiere;
      
        try {
          if (queryMatiere === '') {
            setSelectedMatiere(undefined);
            setQueryMatiere("");
            setResultsMatiere([]);
          } else if (queryMatiere.trim().length > 0) {
            const result = await apiSearchMatiere({ langue:lang, searchString: queryMatiere, limit:5 });
            // Vérifiez si la requête actuelle correspond toujours à la dernière requête
            if (latestQueryMatiere.current === queryMatiere) {
              setResultsMatiere(result.matieres);
            }
          } else {
            setSelectedMatiere(undefined);
            setQueryMatiere("");
            setResultsMatiere([]);
          }
        } catch (error) {
          console.error('Error fetching search resultsMatiere:', error);
          createToast(t('message.erreur'), "", 2)
        } finally {
          if (latestQueryMatiere.current === queryMatiere) {
            setIsLoadingMatiere(false);
          }
        }
    };



    //Gestion de la perte de curseur par le search input de l'enseignant principal
    const handleBlurEnsPrincipal = () => {
        setTimeout(() => {
        setResultsEnsPrincipal([]);
        }, 200); // Délai pour permettre l'exécution de l'événement de clic
    };

    //Gestion de la perte de curseur par le search input de l'enseignant suppleant
    const handleBlurEnsSuppleant = () => {
        setTimeout(() => {
        setResultsEnsSuppleant([]);
        }, 200); // Délai pour permettre l'exécution de l'événement de clic
    };

    //Gestion de la perte de curseur par le search input de la matiere
    const handleBlurMatiere = () => {
        setTimeout(() => {
        setResultsMatiere([]);
        }, 200); // Délai pour permettre l'exécution de l'événement de clic
    };

    

    const handleSelectEnsPrincipal = (ensPrincipal:EnseignantType) => {
        setSelectedEnsPrincipal(ensPrincipal);
        setQueryEnsPrincipal(`${ensPrincipal.nom} ${ensPrincipal?.prenom??""}`.trim());
        setResultsEnsPrincipal([]);
    };

    const handleSelectEnsSuppleant = (ensSuppleant:EnseignantType) => {
        setSelectedEnsSuppleant(ensSuppleant);
        setQueryEnsSuppleant(`${ensSuppleant.nom} ${ensSuppleant?.prenom??""}`.trim());
        setResultsEnsSuppleant([]);
    };

    const handleSelectMatiere = (matiere:MatiereType) => {
        setSelectedMatiere(matiere);
        
        setQueryMatiere(`${lang==='fr'?matiere.libelleFr:matiere.libelleEn}`.trim());
        if(matiere && matiere.typesEnseignement){
            const listeTypesEnseignementDeMatiere = matiere.typesEnseignement
                .map(type => type) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            if (listeTypesEnseignementDeMatiere) {
                setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            }
        }
        setResultsMatiere([]);
    };

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

    // useEffect(() => {

    //     const fetchMatieres = async () => {
    //         dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
    //         try {
    //             const matieresV: MatiereReturnGetType = {
    //                 matieres: [],
    //                 currentPage: 0,
    //                 totalItems: 0,
    //                 totalPages: 0,
    //                 pageSize: 0
    //             }
                
    //             if (niveau && niveau._id) {
                    
    //                 const fetchedMatieres = await getMatieresByNiveau({ niveauId: niveau._id, annee:currentYear, semestre:currentSemester});
    //                 if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
    //                     dispatch(setMatieres(fetchedMatieres));
    //                 } else {

    //                     dispatch(setMatieres(matieresV));
    //                 }
    //             } else {

    //                 dispatch(setMatieres(matieresV));

    //             } // Réinitialisez les erreurs s'il y en a
    //         } catch (error) {
    //             dispatch(setErrorPageMatiere(t('message.erreur')));
    //             createToast(t('message.erreur'), "", 2)
    //         } finally {
    //             dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
    //         }
    //     };

    //     fetchMatieres();
    // }, [periodeCours,niveau, dispatch]);



    useEffect(() => {

        if (periodeCours && periodeCours._id) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.periode'));
            const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeCours.niveau);
            const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
            const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
            currentSection && filterCycleBySection(currentSection._id);
            currentCycle && filterNiveauByCycle(currentCycle._id);
            setJour(jours.find((jour) => periodeCours.jour == jour.ordre));
            setHeureDebut(periodeCours.heureDebut);
            setHeureFin(periodeCours.heureFin);
            setSection(currentSection);
            setCycle(currentCycle);
            setNiveau(currentNiveau);
            // const mat = matieres.find(matiere => periodeCours.enseignements && (matiere._id === periodeCours.matiere._id));
            // setMatiere(mat);
            const currentMatiere =  index!=-1 && periodeCours.enseignements && periodeCours.enseignements[index].matiere || undefined
            const currentEnseignantP = index!=-1 &&  periodeCours.enseignements && periodeCours.enseignements[index].enseignantPrincipal || undefined
            const currentEnseignantS = index!=-1 &&  periodeCours.enseignements && periodeCours.enseignements[index].enseignantSuppleant || undefined
            const currentSalleCour = index!=-1 &&  periodeCours.enseignements && periodeCours.enseignements[index].salleCours || ""
            const currentType = index!=-1 &&  periodeCours.enseignements && periodeCours.enseignements[index].typeEnseignement || ""
            setSelectedMatiere(currentMatiere);
            lang==='fr'?setQueryMatiere(currentMatiere?.libelleFr??""):setQueryMatiere(currentMatiere?.libelleEn??"")
            setSelectedEnsPrincipal(currentEnseignantP);
            setQueryEnsPrincipal(`${currentEnseignantP?.nom??""} ${currentEnseignantP?.prenom??""}`.trim());
            setSelectedEnsSuppleant(currentEnseignantS);
            setQueryEnsSuppleant(`${currentEnseignantS?.nom??""} ${currentEnseignantS?.prenom??""}`.trim());
            
            
            const salleCours = sallesCours.find(salle => salle._id === currentSalleCour);
            setSalleCours(salleCours);
            const listeTypesEnseignementDeMatiere = currentMatiere && currentMatiere.typesEnseignement && currentMatiere.typesEnseignement
                .map(type => type) // Obtenir une liste d'objectIds
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
                
            listeTypesEnseignementDeMatiere && setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
            const typeEnseignement = typesEnseignementMat.find(typeEnseignement => typeEnseignement._id === currentType);
            setTypeEnseignement(typeEnseignement);
            setSemestre(periodeCours.semestre);
            setAnnee(periodeCours.annee);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.periode'));
            setJour(undefined);
            setHeureDebut("");
            setHeureFin("");
            setSection(undefined);
            setCycle(undefined);
            setNiveau(undefined);
            // setMatiere(undefined);
            setSelectedMatiere(undefined);
            setQueryMatiere("");
            setSelectedEnsPrincipal(undefined);
            setQueryEnsPrincipal("");
            setSelectedEnsSuppleant(undefined);
            setQueryEnsSuppleant("");
            setSalleCours(undefined);
            setTypeEnseignement(undefined);
            setSemestre(currentSemester);
            setAnnee(currentYear);
            setFilteredCycle(undefined);
            setFilteredNiveau(undefined);
            setTypesEnseignementMat([]);
            if(periodeCours && !periodeCours._id){
                const currentNiveau = niveaux.find(niveau => niveau._id === "" + periodeCours.niveau);
                const currentCycle = currentNiveau && cycles.find(cycle => cycle._id === "" + currentNiveau.cycle);
                const currentSection = currentCycle && sections.find(section => section._id === "" + currentCycle.section);
                currentSection && filterCycleBySection(currentSection._id);
                currentCycle && filterNiveauByCycle(currentCycle._id);
                setJour(jours.find((jour) => periodeCours.jour == jour.ordre));
                setHeureDebut(periodeCours.heureDebut);
                setHeureFin(periodeCours.heureFin);
                setSection(currentSection);
                setCycle(currentCycle);
                setNiveau(currentNiveau);
                setSemestre(periodeCours.semestre);
                setAnnee(periodeCours.annee);  
            }

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
            setErrorEnseignant("");
            setIsFirstRender(false);
        }
    }, [periodeCours, isFirstRender, currentYear, index,t]);

    // useEffect(() => {

    //     if (periodeCours) {
    //         const mat = matieres.find(matiere => periodeCours.matiere && (matiere._id === periodeCours.matiere._id));
    //         setMatiere(mat);
    //     }

    // }, [matieres]);
    
    // Troisième useEffect pour gérer le changement de matière sélectionnée
    useEffect(() => {
        
        if (selectedMatiere && selectedMatiere.typesEnseignement) {
            const listeTypesEnseignementDeMatiere = selectedMatiere.typesEnseignement
                .map(type => type)
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            setTypesEnseignementMat(listeTypesEnseignementDeMatiere);

            // Vérifier si le type d'enseignement de la période correspond à l'un des types d'enseignement de la matière
            if (periodeCours && periodeCours.enseignements && periodeCours.enseignements.length>0) {
                const currentType = periodeCours.enseignements && periodeCours.enseignements[index].typeEnseignement || ""
                const typeEnseignementPeriode = listeTypesEnseignementDeMatiere.find(type => type._id === currentType);
                if (typeEnseignementPeriode) {
                    setTypeEnseignement(typeEnseignementPeriode);
                }
            }

        }
    }, [selectedMatiere, typesEnseignement, periodeCours]);

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
        setErrorEnseignant("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
        setErrorSemestre("");
    };

    const handleJourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedJourLibelle = e.target.value;
        const selectedJour = jours.find(jour => lang === 'fr' ? jour.libelleFr === selectedJourLibelle : jour.libelleEn === selectedJourLibelle);
        if (selectedJour) {
            setJour(selectedJour);
            setErrorJour("");
        }
    };


    const handleSalleCoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSalleCoursLibelle = e.target.value;
        const selectedSalleCours = lang==='fr'?sallesCours.find((salleCours) => salleCours.libelleFr === selectedSalleCoursLibelle):sallesCours.find((salleCours) => salleCours.libelleEn === selectedSalleCoursLibelle);
        if (selectedSalleCours) {
            setSalleCours(selectedSalleCours);
            setErrorSalle("");
        }
    };
    // const handleMatiereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedMatiereLibelle = e.target.value;
    //     const selectedMatiere = matieres.find((matiere) => lang === 'fr' ? matiere.libelleFr === selectedMatiereLibelle : matiere.libelleEn === selectedMatiereLibelle);
    //     if (selectedMatiere && selectedMatiere.typesEnseignement) {
    //         setMatiere(selectedMatiere);
    //         setErrorMatiere("");
    //         const listeTypesEnseignementDeMatiere = selectedMatiere.typesEnseignement
    //             .map(type => type.typeEnseignement) // Obtenir une liste d'objectIds
    //             .map(objectId => typesEnseignement.find(type => type._id === objectId))
    //             .filter(type => type !== undefined) as CommonSettingProps[];
    //         if (listeTypesEnseignementDeMatiere) {
    //             setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
    //         }
    //     }


    // };


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

   

    const handleCreatePeriodeCours = async () => {
        // Validation des champs obligatoires
        if (!jour || !heureDebut || !heureFin || !section || !cycle || !niveau || !selectedMatiere || !selectedEnsPrincipal || !semestre 
            || !typeEnseignement || !salleCours) {
            if (!jour) setErrorJour(t('error.jour'));
            if (!heureDebut) setErrorHeureDebut(t('error.heure_debut'));
            if (!heureFin) setErrorHeureFin(t('error.heure_fin'));
            if (!section) setErrorSection(t('error.section'));
            if (!cycle) setErrorCycle(t('error.cycle'));
            if (!niveau) setErrorNiveau(t('error.niveau'));
            if (!selectedMatiere) setErrorMatiere(t('error.matiere'));
            if (!semestre) setErrorSemestre(t('error.semestre'));
            if (!typeEnseignement) setErrorTypeEnseignement(t('error.type_ens_periode'));
            if (!selectedEnsPrincipal) setErrorEnseignant(t('error.enseignant'));
            if (!salleCours) setErrorSalle(t('error.salle'));
            return;
        }
    
        // Vérification si heureFin est après heureDebut
        if (verifierHeureFinApresDebut(heureDebut, heureFin)) {
            setErrorHeureFin(t('error.debut_sup_fin_periode'));
            return;
        }
    
        // Si aucune période de cours existante, création d'une nouvelle période
        if (!periodeCours || (periodeCours && !periodeCours._id) || index == -1) {
            setIsLoading(true)
            if (selectedMatiere && typeEnseignement && typeEnseignement._id && selectedEnsPrincipal && niveau._id && salleCours._id && jour.ordre) {
                const enseignements = [...(periodeCours?.enseignements || [])];
               
    
                // Ajouter les éléments s'ils ne sont pas undefined
                enseignements.push({
                    matiere:selectedMatiere,
                    enseignantPrincipal:selectedEnsPrincipal,
                    enseignantSuppleant:selectedEnsSuppleant,
                    salleCours:salleCours._id,
                    typeEnseignement:typeEnseignement._id,
                });
    

                // API pour créer une nouvelle période
                await apiCreatePeriode({
                    jour: jour.ordre,
                    semestre,
                    annee,
                    niveau: niveau._id,
                    enseignements,
                    heureDebut,
                    heureFin,
                    pause: false
                }).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(createPeriode({
                                periode: {
                                    _id: e.data._id,
                                    jour: e.data.jour,
                                    annee: e.data.annee,
                                    semestre: e.data.semestre,
                                    niveau: e.data.niveau,
                                    enseignements: e.data.enseignements,
                                    heureDebut: e.data.heureDebut,
                                    heureFin: e.data.heureFin,
                                    pause: e.data.pause,
                                }
                            }));
                            dispatch(setPeriodeIndex(-1));
                            closeModal();
                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);
                        }
                })
                .catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                }).finally(() => {
                    setIsLoading(false)
                })
            }
        } else {
            // Mise à jour d'une période existante
            if (selectedMatiere && typeEnseignement && typeEnseignement._id && selectedEnsPrincipal && niveau._id && salleCours._id && jour.ordre) {
                const enseignements = [...(periodeCours?.enseignements || [])];
                const newEnseignement ={matiere:selectedMatiere, 
                                        enseignantPrincipal:selectedEnsPrincipal,
                                        enseignantSuppleant:selectedEnsSuppleant,
                                        salleCours:salleCours._id,
                                        typeEnseignement:typeEnseignement._id
                                    }
                enseignements[index] = newEnseignement;
                setIsLoading(true);
                // API pour mettre à jour la période
                await apiUpdatePeriode({
                    jour: jour.ordre,
                    semestre,
                    annee,
                    niveau: niveau._id,
                    enseignements,
                    heureDebut,
                    heureFin,
                    _id: periodeCours._id,
                    pause: false,
                })
                    .then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(updatePeriode({
                                id: e.data._id,
                                periodeData: {
                                    _id: e.data._id,
                                    jour: e.data.jour,
                                    annee: e.data.annee,
                                    semestre: e.data.semestre,
                                    niveau: e.data.niveau,
                                    enseignements: e.data.enseignements,
                                    heureDebut: e.data.heureDebut,
                                    heureFin: e.data.heureFin,
                                    pause: e.data.pause,
                                }
                            }));
                            dispatch(setPeriodeIndex(-1));
                            closeModal();
                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);
                        }
                    })
                    .catch((e) => {
                        createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                    }).finally(() => {
                        setIsLoading(false)
                    })
            }
        }
    };
    
    

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreatePeriodeCours}
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
                <label>{t('label.jour')}</label><label className="text-red-500"> *</label>
                <select
                    value={jour ? lang === 'fr' ? jour.libelleFr : jour.libelleEn : t('select_par_defaut.selectionnez') + t('select_par_defaut.jour')}
                    onChange={handleJourChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.jour')}</option>
                    {jours.map(jour => (
                        <option key={jour.ordre} value={lang === 'fr' ? jour.libelleFr : jour.libelleEn}>{lang === 'fr' ? jour.libelleFr : jour.libelleEn}</option>
                    ))}
                </select>
                {errorJour && <p className="text-red-500" >{errorJour}</p>}
                <label>{t('label.heure_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureDebut}
                    onChange={(e) => { setHeureDebut(e.target.value); setErrorHeureDebut("") }}
                />
                {errorHeureDebut && <p className="text-red-500" >{errorHeureDebut}</p>}
                <label>{t('label.heure_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="time"
                    value={heureFin}
                    onChange={(e) => { setHeureFin(e.target.value); setErrorHeureFin("") }}
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
                <div >
                    <SearchInput 
                        onSearch={handleSearchMatiere} 
                        placeHolder={t('recherche.rechercher')+t('recherche.matiere')}
                        style="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        query={queryMatiere}
                        setQuery={setQueryMatiere}
                        onBlur={handleBlurMatiere}
                    />
                    {isLoadingMatiere ? (
                        <p>{t('label.recherche')}</p>
                    ) : resultsMatiere.length>0 && (
                        <ul className="border mt-2">
                            {resultsMatiere.map((matiere) => (
                                <li 
                                    key={matiere._id} 
                                    className="p-2 border-b cursor-pointer"
                                    onClick={() => handleSelectMatiere(matiere)}
                                >
                                    {lang==='fr'?matiere.libelleFr:matiere.libelleEn}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {errorMatiere && <p className="text-red-500">{errorMatiere}</p>}
                <label>{t('label.type_ens')}</label><label className="text-red-500"> *</label>
                <select
                    value={typeEnseignement ? typeEnseignement.code : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}
                    onChange={handleTypeEnseignementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_ens')}</option>
                    {typesEnseignementMat.map(typeEnseignement => (
                        <option key={typeEnseignement._id} value={typeEnseignement.code}>{typeEnseignement.code}</option>
                    ))}
                </select>
                {errorTypeEnseignement && <p className="text-red-500">{errorTypeEnseignement}</p>}
                <label>{t('label.enseignant')}</label><label className="text-red-500"> *</label>
                <div >
                    <SearchInput 
                        onSearch={handleSearchEnsPrincipal} 
                        placeHolder={t('recherche.rechercher')+t('recherche.enseignant')}
                        style="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        query={queryEnsPrincipal}
                        setQuery={setQueryEnsPrincipal}
                        onBlur={handleBlurEnsPrincipal}
                    />
                    {isLoadingEnsPrincipal ? (
                        <p>{t('label.recherche')}</p>
                    ) : resultsEnsPrincipal.length>0 && (
                        <ul className="border mt-2">
                            {resultsEnsPrincipal.map((enseignant) => (
                                <li 
                                    key={enseignant._id} 
                                    className="p-2 border-b cursor-pointer"
                                    onClick={() => handleSelectEnsPrincipal(enseignant)}
                                >
                                    {enseignant.nom} {enseignant.prenom}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {errorEnseignant && <p className="text-red-500">{errorEnseignant}</p>}
                <label>{t('label.enseignant_sup')}</label>
                <div >
                    <SearchInput 
                        onSearch={handleSearchEnsSuppleant} 
                        placeHolder={t('recherche.rechercher')+t('recherche.enseignant')}
                        style="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        query={queryEnsSuppleant}
                        setQuery={setQueryEnsSuppleant}
                        onBlur={handleBlurEnsSuppleant}
                    />
                    {isLoadingEnsSuppleant ? (
                        <p>{t('label.recherche')}</p>
                    ) : resultsEnsSuppleant.length>0 && (
                        <ul className="border mt-2">
                            {resultsEnsSuppleant.map((enseignant) => (
                                <li 
                                    key={enseignant._id} 
                                    className="p-2 border-b cursor-pointer"
                                    onClick={() => handleSelectEnsSuppleant(enseignant)}
                                >
                                    {enseignant.nom} {enseignant.prenom}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <label>{t('label.salle_cour')}</label><label className="text-red-500"> *</label>
                <select
                    value={salleCours ? lang==='fr'?salleCours.libelleFr:salleCours.libelleEn : t('select_par_defaut.selectionnez') + t('select_par_defaut.salle')}
                    onChange={handleSalleCoursChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.salle')}</option>
                    {sallesCours.map(salleCours => (
                        <option key={salleCours._id} value={lang==='fr'?salleCours.libelleFr:salleCours.libelleEn}>{lang==='fr'?salleCours.libelleFr:salleCours.libelleEn}</option>
                    ))}
                </select>
                {errorSalle && <p className="text-red-500">{errorSalle}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
