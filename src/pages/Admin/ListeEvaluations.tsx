//src/pages/Admin/Evaluations/ListeEvaluations.tsx

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import TableEvaluation from "../../components/Tables/TableEvaluation/Table";
import FormDeleteEvaluation from "../../components/Modals/ModalEvaluation/FormDelete";
import FormCreateUpdateEvaluation from "../../components/Modals/ModalEvaluation/FormCreateUpdate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { getEvaluationsByNiveau } from "../../api/api_evaluation";
import createToast from "../../hooks/toastify";
import {
    setEvaluationLoading,
    setEvaluations,
    setErrorPageEvaluation
} from "../../_redux/features/evaluation_slice";
import { config } from "../../config";
import Loading from "../../components/ui/loading";

const ListeEvaluations = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationType | null>(null);
    
    const currentUser: UserState = useSelector((state: RootState) => state.user);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const { data: { evaluations } } = useSelector((state: RootState) => state.evaluationSlice);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const lang = useSelector((state: RootState) => state.setting.language);
    
    const roles = config.roles;
    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);

    useEffect(() => {
        const fetchEvaluations = async () => {
            dispatch(setEvaluationLoading(true));
            try {
                const emptyEvaluations: EvaluationReturnGetType = {
                    evaluations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                };

                const currentCycleId = sections && sections.length > 0 
                    ? cycles.find(cycle => cycle.section === "" + sections[0]._id) 
                    : null;
                    
                let currentNiveauId = currentCycleId && cycles && cycles.length > 0 
                    ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id 
                    : null;

                if (roles.enseignant === currentUser.role || roles.etudiant === currentUser.role) {
                    const currentNiveau = niveaux.find(niveau => niveau._id === "" + currentUser.niveaux[0]?.niveau);
                    currentNiveauId = currentNiveau?._id;
                }

                if (currentNiveauId) {
                    const fetchedEvaluations = await getEvaluationsByNiveau({
                        niveauId: currentNiveauId,
                        annee: currentYear,
                        semestre: currentSemestre,
                        page: 1
                    });

                    if (fetchedEvaluations) {
                        dispatch(setEvaluations(fetchedEvaluations));
                    } else {
                        dispatch(setEvaluations(emptyEvaluations));
                    }
                } else {
                    dispatch(setEvaluations(emptyEvaluations));
                }
            } catch (error) {
                dispatch(setErrorPageEvaluation(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setEvaluationLoading(false));
            }
        };

        fetchEvaluations();
    }, [dispatch, t, currentYear, currentSemestre]);

    const handleEditEvaluation = (evaluation: EvaluationType) => {
        setSelectedEvaluation(evaluation);
    };

    const handleAddEvaluation = () => {
        setSelectedEvaluation(null);
    };

    return (
        <>
            <Breadcrumb pageName={t('menu.evaluations')} />
            
            {settingIsLoading ? (
                <Loading />
            ) : (
                <TableEvaluation 
                    data={evaluations} 
                    onCreate={handleAddEvaluation} 
                    onEdit={handleEditEvaluation} 
                />
            )}

            <FormCreateUpdateEvaluation evaluation={selectedEvaluation} />
            <FormDeleteEvaluation evaluation={selectedEvaluation} />
        </>
    );
};

export default ListeEvaluations;