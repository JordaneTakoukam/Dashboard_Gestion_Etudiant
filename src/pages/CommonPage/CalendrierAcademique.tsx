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
import { SectionRefresh } from "../../components/ui/SectionRefresh";

const CalendrierAcademique = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedEvenement, setSelectedEvenement] = useState<EvenementType | null>(null);

    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const promotions = useSelector((state: RootState) => state.dataSetting.dataSetting.promotions);
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { evenements } } = useSelector((state: RootState) => state.evenementSlice);

    const fetchEvenements = async () => {
        dispatch(setEvenementLoading(true)); // Définissez le loading à true avant le chargement
        try {
            const emptyCalendrier:EvenementReturnGetType={
                evenements: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            }
            if(promotions && promotions.length>0 && promotions[0]._id){
                const fetchedEvenements = await getEvenementsByYear({ annee: currentYear, page: 1, promotion:promotions[0]._id});
                // Mettez à jour l'état Redux avec les données récupérées
                dispatch(setEvenements(fetchedEvenements));

                dispatch(setErrorPageEvenement(null)); // Réinitialisez les erreurs s'il y en a
            }else{
                setEvenements(emptyCalendrier);
            }
            
        } catch (error) {
            dispatch(setErrorPageEvenement(t('message.erreur')));
        } finally {
            dispatch(setEvenementLoading(false));
        }
    };
    useEffect(() => {
        // if (evenements.length === 0) {
            fetchEvenements();
        // }
    }, [currentYear, promotions, dispatch]);

    const handleEditEvenement = (evenement: EvenementType) => {
        setSelectedEvenement(evenement);
    }

    const handleAddEvenement = () => {
        setSelectedEvenement(null);
    }

    return (
        <>
            <Breadcrumb pageName={t('menu.calendrier')} />
            {/* <SectionRefresh refreshFunction={() => fetchEvenements()} /> */}

            {/* Affichez le tableau uniquement lorsque les données sont chargées avec succès */}
            <Table data={evenements} onCreate={handleAddEvenement} onEdit={handleEditEvenement} refresh={() => fetchEvenements()} />
            <FormCreateUpdate evenement={selectedEvenement} />
            <FormDelete evenement={selectedEvenement} />
        </>
    );
};

export default CalendrierAcademique;
