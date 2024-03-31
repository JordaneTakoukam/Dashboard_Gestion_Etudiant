import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCalendrier/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCalendrier/FormDelete";
import { useTranslation } from "react-i18next";
import { getEvenementsByYear } from "../../api/api_evenement";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setErrorPageEvenement, setEvenementLoading, setEvenements } from "../../_redux/features/evenement_slice";
import Table from "../../components/Tables/TableEvenement/Table";
import createToast from "../../hooks/toastify";

const CalendrierAcademique = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedEvenement, setSelectedEvenement] = useState<EvenementType | null>(null);

    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { evenements } } = useSelector((state: RootState) => state.evenementSlice);

    useEffect(() => {
        const fetchEvenements = async () => {
            dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const fetchedEvenements = await getEvenementsByYear({ annee: currentYear, page: 1 });
                // Mettez à jour l'état Redux avec les données récupérées
                dispatch(setEvenements(fetchedEvenements));

                dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageEvenement(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setEvenementLoading(false)); // Définissez le loading à false après le chargement
            }
        };

        fetchEvenements();
    }, [currentYear, dispatch]);

    const handleEditSection = (evenement: EvenementType) => {
        setSelectedEvenement(evenement);
    }

    const handleAddSection = () => {
        setSelectedEvenement(null);
    }

    return (
        <>
            <Breadcrumb pageName={t('menu.calendrier')} />
            {/* Affichez le tableau uniquement lorsque les données sont chargées avec succès */}
            <Table data={evenements} onCreate={handleAddSection} onEdit={handleEditSection} />
            <FormCreateUpdate evenement={selectedEvenement} />
            <FormDelete evenement={selectedEvenement} />
        </>
    );
};

export default CalendrierAcademique;
