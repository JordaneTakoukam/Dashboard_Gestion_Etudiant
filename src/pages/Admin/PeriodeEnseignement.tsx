import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { Enseignant } from "./ListeEnseignants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import { setPeriodeEnseignementLoading, setPeriodeEnseignements, setErrorPagePeriodeEnseignement } from "../../_redux/features/periode_enseignement_slice";
import { getPeriodesEnseignement } from "../../api/api_periode_enseignement";
import Table from "../../components/Tables/TablePeriodeEnseignement/Table";
import FormCreateUpdate from "../../components/Modals/ModalPeriodeEnseignement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalPeriodeEnseignement/FormDelete";
import EnseignementsPeriode from "./EnseignementsPeriode";



const ListeDesPeriodesEnseignement = () => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [openEnseignementsPeriode, setOpenChapitre]=useState(false);
    const [selectedPeriodeEnseignement, setSelectedPeriodeEnseignement] = useState<PeriodeEnseignementType | null>(null);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const currentNiveauId =niveaux && niveaux.length>0 && niveaux[0]._id;
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    // Utilisez useSelector pour accéder à l'état du reducer
    const { data: { periodes } } = useSelector((state: RootState) => state.periodeEnseignementSlice);

    useEffect(() => {
        const fetchPeriodeEnseignements = async () => {
            dispatch(setPeriodeEnseignementLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyPeriodes : PeriodeEnseignementReturnGetType = {
                    periodes: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                } ;
                if (currentNiveauId) {
                    const fetchedPeriodeEnseignements = await getPeriodesEnseignement({ niveauId: currentNiveauId, page: 1, annee:currentYear, semestre:currentSemester });
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
    }, [currentNiveauId, dispatch, t]);


    const handleEditSection = (periodeEnseignement: PeriodeEnseignementType) => {
        setSelectedPeriodeEnseignement(periodeEnseignement);
    }

    const handleEditPeriodeEnseignement = (periodeEnseignement : PeriodeEnseignementType) => {
        setSelectedPeriodeEnseignement(periodeEnseignement);
        setOpenChapitre(false);
    }

    const handleAddPeriodeEnseignement = () => {
        setSelectedPeriodeEnseignement(null);
        setOpenChapitre(false);
    }

    const handleOpenEnseignementsPeriode = (periodeEnseignement: PeriodeEnseignementType) => {
        setSelectedPeriodeEnseignement(periodeEnseignement);
        setOpenChapitre(true);
    };
    return (
        <>
            {!openEnseignementsPeriode && <Breadcrumb pageName={t('sub_menu.liste_periodeEnseignement')} />}
            {!openEnseignementsPeriode && <Table data={periodes} onCreate={handleAddPeriodeEnseignement} onEdit={handleEditPeriodeEnseignement} onAddEnseignement={handleOpenEnseignementsPeriode}/>}
            
            {!openEnseignementsPeriode && <FormCreateUpdate periodeEnseignement={selectedPeriodeEnseignement}/>}
            {!openEnseignementsPeriode && <FormDelete periodeEnseignement={selectedPeriodeEnseignement}/>}
            {openEnseignementsPeriode && <EnseignementsPeriode periodeSelectionnee={selectedPeriodeEnseignement} returnWithPeriodeEnseignement={handleAddPeriodeEnseignement}/>}
        </>
    );
};

export default ListeDesPeriodesEnseignement;

export const enseignants: Enseignant[] = [];