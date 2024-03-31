import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { useEffect } from "react";
import { RootState } from "../../_redux/store";
import { getMatieresByNiveau } from "../../api/api_matiere";
import createToast from "../../hooks/toastify";
import { setErrorPageMatiere, setMatiereLoading, setMatieres } from "../../_redux/features/progession_matiere_slice";

const ProgressionMatiere = () => {
    const {t}=useTranslation();
    const matieres = useSelector((state: RootState) => state.progressionMatiereSlice.data.matieres);
    const dispatch = useDispatch();
    const niveaux: NiveauProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.niveau) ?? [];
    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycle) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.section) ?? [];
    const currentCyleId = sections && sections.length>0 && cycles.find(cycle => cycle.section === "" + sections[0]._id);
    const currentNiveauId =currentCyleId && cycles && cycles.length>0 && niveaux.find(niveau => niveau.cycle === "" +currentCyleId)?._id;
    useEffect(() => {
        const fetchMatieres = async () => {
            dispatch(setMatiereLoading(true)); // Définissez le loading à true avant le chargement
            try {
                if (currentNiveauId) {
                    const fetchedMatieres = await getMatieresByNiveau({ niveauId: currentNiveauId});
                    if (fetchedMatieres) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                        dispatch(setMatieres(fetchedMatieres));
                    } else {
                        // Traitez le cas où fetchedMatieres est faux, vide ou indéfini
                        // Vous pouvez ignorer cette condition si vous souhaitez simplement ne rien faire dans ce cas
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageMatiere(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setMatiereLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchMatieres();
    }, [currentNiveauId, dispatch]);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression')} />
            <Table data={matieres && matieres[0]}/>
        </>
    );
};

export default ProgressionMatiere;
