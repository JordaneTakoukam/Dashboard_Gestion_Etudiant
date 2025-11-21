import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionChapitre/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../_redux/store";
import { getMatieresByEnseignantNiveau, getMatieresByNiveau } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from "../../_redux/features/progession_matiere_slice";
import { config } from "../../config";
import { setChapitreLoading, setChapitres, setErrorPageChapitre } from "../../_redux/features/chapitre_slice";
import { getChapitreByMatiereWithPagination } from "../../api/api_chapitre";
import ModalProgressionChapitre from "../../components/Modals/ModalProgressionChapitre/FormProgressionChapitre";
import Loading from "../../components/ui/loading";


const ProgressionChapitre = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Récupérer les données de l'état Redux
    const { data: { matieres } } = useSelector((state: RootState) => state.progressionMatiereSlice);
    const { data: { chapitres } } = useSelector((state: RootState) => state.chapitreSlice);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);
    const handleEditChapitre = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
        
    }
    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading) ?? [];

    useEffect(() => {
        const fetchMatieres = async () => {
            if (sections.length > 0 && cycles.length > 0 && niveaux.length > 0) {
                dispatch(setMatiereLoading(true)); // Définir le chargement à true avant de récupérer les données
                try {
                    const matieres : ProgressionMatiereReturnGetType = {
                        matieres: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0
                    }
                    const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                    let currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                    if(roles.delegue === currentUser.role || roles.etudiant === currentUser.role){
                        const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux.find(niveau=>niveau.annee===currentYear)?.niveau);
                        currentNiveauId=currentNiveau?._id;
                    }
                    if(roles.enseignant === currentUser.role){
                        const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux[0]?.niveau);
                        currentNiveauId=currentNiveau?._id;
                    }
                    if (currentNiveauId) {
                        let fetchedMatieres = null
                        if(currentUser && currentUser.role===roles.enseignant){
                            fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: currentNiveauId, enseignantId: currentUser._id, annee: currentYear, semestre: currentSemestre, langue:lang});
                        }else{
                            fetchedMatieres = await getMatieresByNiveau({ niveauId: currentNiveauId, annee: currentYear, semestre: currentSemestre, langue:lang });
                        }
                        if(fetchedMatieres){
                            dispatch(setMatieres(fetchedMatieres));
                        }else{
                            dispatch(setMatieres(matieres));
                        }
                        
                    }else{
                        dispatch(setMatieres(matieres));
                    }
                    dispatch(setErrorPageMatiere(null)); // Réinitialiser les erreurs s'il y en a
                } catch (error) {
                    dispatch(setErrorPageMatiere(t('message.erreur')));
                    createToast(t('message.erreur'), "", 2);
                } finally {
                    dispatch(setMatiereLoading(false)); // Définir le chargement à false après avoir récupéré les données
                }
            }
        };

        fetchMatieres();
    }, [dispatch]);
    
    useEffect(() => {

        const fetchChapitres = async () => {
            dispatch(setChapitreLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyChapitres: ChapitreReturnGetType = {
                    chapitres: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                if(matieres && matieres.length>0 && matieres[0]._id){
                    const fetchedChapitres = await getChapitreByMatiereWithPagination({ matiereId: matieres[0]._id, page: 1, annee: currentYear, semestre: currentSemestre, langue:lang });
                        
                    if (fetchedChapitres) { // Vérifiez si fetchedChapitres n'est pas faux, vide ou indéfini
                        dispatch(setChapitres(fetchedChapitres));
                    } else {
                        dispatch(setChapitres(emptyChapitres));
                    }
                }else {
                    dispatch(setChapitres(emptyChapitres));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageChapitre(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setChapitreLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchChapitres();
    }, [currentYear,t, dispatch]); // Déclencher l'effet lorsque currentPage change

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression_chap')} />
            {
                settingIsLoading ?
                    <Loading /> :
                        <Table data={chapitres} matieres={matieres} onEdit={handleEditChapitre}/>
            }       
            <ModalProgressionChapitre chapitre={selectedChapitre}/>
        </>
    );
};

export default ProgressionChapitre;
