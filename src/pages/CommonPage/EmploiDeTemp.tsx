import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableEmploieDeTemps/Table";
import { Matiere, matieres } from "../Admin/ListeMatieres";
import { SalleCours, sallesCours } from "../Admin/SallesDeCours";
import FormCreateUpdate from "../../components/Modals/ModalEmploiTemps/FormCreateUpdate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setPeriodeLoading, setPeriodes, setErrorPagePeriode } from "../../_redux/features/periode_slice";
import { RootState } from "../../_redux/store";
import { getPeriodesByNiveau } from "../../api/api_periode";



export interface Jour {
    ordre: number;
    libelleFr: string;
    libelleEn: string;
}

const EmploiDeTemp = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedPeriode, setSelectedPeriode] = useState<PeriodeType | null>(null);

    // Récupérer les données de l'état Redux
    const periodes = useSelector((state: RootState) => state.periodeSlice.data.periodes);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    // Récupérer le premier niveau du premier cycle
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];


    useEffect(() => {
        const fetchPeriodes = async () => {
            dispatch(setPeriodeLoading(true)); // Définir le chargement à true avant de récupérer les données
            try {
                // Initialisation de currentCycleId et currentNiveauId
                const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
                const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;


                if (currentNiveauId) {
                    const fetchedPeriodes = await getPeriodesByNiveau({ niveauId: currentNiveauId, annee: currentYear, semestre: 1 });
                    dispatch(setPeriodes(fetchedPeriodes));
                }
                dispatch(setErrorPagePeriode(null)); // Réinitialiser les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPagePeriode(t('message.erreur')));
                // createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setPeriodeLoading(false)); // Définir le chargement à false après avoir récupéré les données
            }
        };

        fetchPeriodes();
    }, [dispatch]);

    const handleEditPeriode = (periode: PeriodeType) => {
        setSelectedPeriode(periode);
    };

    const handleAddPeriode = () => {
        setSelectedPeriode(null);
    };

    return (
        <>
            <Breadcrumb pageName={t('menu.emploi')} />
            <Table data={periodes} onCreate={handleAddPeriode} onEdit={handleEditPeriode} />
            <FormCreateUpdate periodeCours={selectedPeriode} />
        </>
    );
};


export default EmploiDeTemp;
export const semestres = [1, 2];
//const { t } = useTranslation();
export const lundi: Jour = { ordre: 1, libelleFr: 'Lundi', libelleEn: "Monday" }
export const mardi: Jour = { ordre: 2, libelleFr: "Mardi", libelleEn: "Tuesday" }
export const mercredi: Jour = { ordre: 3, libelleFr: "Mercredi", libelleEn: "Wednesday" }
export const jeudi: Jour = { ordre: 4, libelleFr: "Jeudi", libelleEn: "Thursday" }
export const vendredi: Jour = { ordre: 5, libelleFr: "Vendredi", libelleEn: "Friday" }
export const samedi: Jour = { ordre: 6, libelleFr: "Samedi", libelleEn: "Saturday" }
export const dimanche: Jour = { ordre: 7, libelleFr: "Dimanche", libelleEn: "Sunday" }
export const jours: Jour[] = [lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche];
