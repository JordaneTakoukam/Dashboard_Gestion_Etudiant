import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../_redux/store";
import { getMatieresByNiveau } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from "../../_redux/features/progession_matiere_slice";

const ProgressionMatiere = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Récupérer les données de l'état Redux
    const matieres = useSelector((state: RootState) => state.progressionMatiereSlice.data.matieres);
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveau) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycle) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.section) ?? [];

    

    useEffect(() => {
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définir le chargement à true avant de récupérer les données
            try {
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                if (currentNiveauId) {
                    const fetchedMatieres = await getMatieresByNiveau({ niveauId: currentNiveauId });
                    dispatch(setMatieres(fetchedMatieres));
                }
                dispatch(setErrorPageMatiere(null)); // Réinitialiser les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setMatiereLoading(false)); // Définir le chargement à false après avoir récupéré les données
            }
        };

        fetchMatieres();
    }, [dispatch, t]);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression')} />
            <Table data={matieres && matieres[0]} />
        </>
    );
};

export default ProgressionMatiere;
