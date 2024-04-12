import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { getPeriodesEnseignement } from "../../api/api_periode_enseignement";
import { setErrorPagePeriodeEnseignement, setPeriodeEnseignementLoading, setPeriodeEnseignements } from "../../_redux/features/progession_periode_slice";
import Table from "../../components/Tables/TableProgressionPeriode/Table";

const ProgressionMatiere = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Récupérer les données de l'état Redux
    const { data: { periodes } } = useSelector((state: RootState) => state.progressionPeriodeEnseignementSlice);
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;

    useEffect(() => {
        const fetchPeriodeEnseignements = async () => {
            dispatch(setPeriodeEnseignementLoading(true)); // Définissez le loading à true avant le chargement
            const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                    const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
            try {
                const emptyPeriodes : ProgressionPeriodeEnseignementReturnGetType = {
                    periodes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                } ;
                if (currentNiveauId) {
                    const fetchedPeriodeEnseignements = await getPeriodesEnseignement({ niveauId: currentNiveauId, annee:currentYear, semestre:currentSemester });
                    console.log(fetchedPeriodeEnseignements);
                    if (fetchedPeriodeEnseignements) { // Vérifiez si fetchedPeriodeEnseignements n'est pas faux, vide ou indéfini
                        dispatch(setPeriodeEnseignements(fetchedPeriodeEnseignements));
                        console.log(periodes);
                        
                    } else {
                        dispatch(setPeriodeEnseignements(emptyPeriodes));
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPagePeriodeEnseignement(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setPeriodeEnseignementLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchPeriodeEnseignements();
    }, [dispatch, t]);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression_periode')} />
            <Table data={periodes && periodes[0]} periodes={periodes} />
        </>
    );
};

export default ProgressionMatiere;
