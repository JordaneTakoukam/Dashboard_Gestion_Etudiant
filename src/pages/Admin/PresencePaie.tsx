import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setErrorPagePresencePaie, setPresencePaie, setPresencePaiesLoading } from "../../_redux/features/presence_paie_slice";
import { RootState } from "../../_redux/store";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/ui/loading";
import createToast from "../../hooks/toastify";
import Table from "../../components/Tables/TablePresencePaieEnseignant/Table";
import { apiGetPresencesWithTotalHoraire } from "../../api/api_presence_paie";




const PresenceManagement = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedPresencePaie, setSelectedPresencePaie] = useState<PresencePaieType | null>(null);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { presencePaies } } = useSelector((state: RootState) => state.presencePaieSlice);


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading) ?? [];

    useEffect(() => {
        const fetchPresencePaies = async () => {
            dispatch(setPresencePaiesLoading(true)); // Définissez le loading à true avant le chargement
            try {
                // Initialisation de currentCycleId et currentNiveauId
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
                const emptyPresencePaies: PresencePaieListGetType = {
                    presencePaies: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                if (currentNiveauId) {
                    const fetchedPresencePaies = await apiGetPresencesWithTotalHoraire({page: 1, annee: currentYear, semestre:currentSemestre, niveauId: currentNiveauId});
                    if (fetchedPresencePaies) { // Vérifiez si fetchedPresencePaies n'est pas faux, vide ou indéfini
                        dispatch(setPresencePaie(fetchedPresencePaies));
                    } else {
                        dispatch(setPresencePaie(emptyPresencePaies));
                    }
                } // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPagePresencePaie(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setPresencePaiesLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchPresencePaies();
    }, [ t]);
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.presence_paie')} />
            {
                settingIsLoading ?
                    <Loading /> :
                        <Table data={presencePaies}  />
            }
            
        </>
    );
};

export default PresenceManagement;


