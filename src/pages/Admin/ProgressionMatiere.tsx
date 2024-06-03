import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../_redux/store";
import { getMatieresByEnseignantNiveau, getMatieresByNiveau } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from "../../_redux/features/progession_matiere_slice";
import { config } from "../../config";
import { setObjectifLoading, setObjectifs, setErrorPageObjectif } from "../../_redux/features/objectif_slice";
import { getObjectifByMatiereWithPagination } from "../../api/api_objectif";

const ProgressionMatiere = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Récupérer les données de l'état Redux
    const { data: { matieres } } = useSelector((state: RootState) => state.progressionMatiereSlice);
    const { data: { objectifs } } = useSelector((state: RootState) => state.objectifSlice);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;

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
                            fetchedMatieres = await getMatieresByEnseignantNiveau({ niveauId: currentNiveauId, enseignantId: currentUser._id, annee: currentYear, semestre: currentSemestre });
                        }else{
                            fetchedMatieres = await getMatieresByNiveau({ niveauId: currentNiveauId, annee: currentYear, semestre: currentSemestre });
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

        const fetchObjectifs = async () => {
            dispatch(setObjectifLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyObjectifs: ObjectifReturnGetType = {
                    objectifs: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                if(matieres && matieres.length>0 && matieres[0]._id){
                    const fetchedObjectifs = await getObjectifByMatiereWithPagination({ matiereId: matieres[0]._id, page: 1, annee: currentYear, semestre: currentSemestre });
                        
                    if (fetchedObjectifs) { // Vérifiez si fetchedObjectifs n'est pas faux, vide ou indéfini
                        dispatch(setObjectifs(fetchedObjectifs));
                    } else {
                        dispatch(setObjectifs(emptyObjectifs));
                    }
                }else {
                    dispatch(setObjectifs(emptyObjectifs));
                }
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageObjectif(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setObjectifLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchObjectifs();
    }, [currentYear,t, dispatch]); // Déclencher l'effet lorsque currentPage change

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression')} />
            <Table data={objectifs} matieres={matieres}/>
        </>
    );
};

export default ProgressionMatiere;
