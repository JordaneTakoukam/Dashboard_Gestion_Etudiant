import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Breadcrumb";
import Table from "../../../../components/Tables/TablesDisciplineEnseignants/Table";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import LoadingTable from "../../../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../../../components/_Global/PageErreur";
import { PageNoData } from "../../../../components/_Global/PageNoData";
import { apiGetAbsencesWithEnseignantsByFilter } from "../../../../api/discipline/api_discipline";

import { useNavigate } from 'react-router-dom';
import { setEnseignantDiscipline, setEnseignantsDisciplineLoading, setErrorPageEnseignantDiscipline } from "../../../../_redux/features/absence/discipline_enseignant_slice";
import { generateYearRange } from "../../../../fonctions/fonction";

const DisciplineDesEnseignants = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: { enseignants }, pageIsLoading, pageError } = useSelector((state: RootState) => state.enseignantDisciplineSlice);

    const [selectedEnseignant, setSelectedEnseignant] = useState<UserDiscipline | null>(null);
    const [isHourRemove, setHourRemove] = useState(false);

    const handleEditHourEnseignant = (enseignant: UserDiscipline, isHourRemove: boolean) => {
        setSelectedEnseignant(enseignant);
        setHourRemove(isHourRemove);
    }


    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2024;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const currentPlageDate: string[] = generateYearRange(currentYear, firstYear);


    const loadingSetting = useSelector((state: RootState) => state.dataSetting.loading);

    const fetchEnseignants = async () => {
        dispatch(setEnseignantsDisciplineLoading(true));

        try {
            const fetchedEnseignants = await apiGetAbsencesWithEnseignantsByFilter({
                page: 1, semestre: currentSemestre, annee: currentYear
            });
            if (fetchedEnseignants) {
                dispatch(setEnseignantDiscipline(fetchedEnseignants));

                dispatch(setErrorPageEnseignantDiscipline(null));
            } else {
                dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageEnseignantDiscipline(t('message.erreur')));
        } finally {
            dispatch(setEnseignantsDisciplineLoading(false));
        }
    };

    const handleRefresh = async () => {
        await fetchEnseignants();
    };


    useEffect(() => {
        const fetchData = async () => {
            if (enseignants.length === 0) {
                dispatch(setEnseignantsDisciplineLoading(true));

                while (loadingSetting) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100ms avant de vérifier à nouveau
                }
                fetchEnseignants();
            }
        };

        fetchData();

    }, [enseignants.length, loadingSetting]);


    return (
        <>
            <Breadcrumb pageName={t('sub_menu.discipline')} />
            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        enseignants.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.enseignant')}
                                titreBouton={t('ajouter_votre_premier.enseignant')}
                                showModalCreate={() => { navigate("/teachers/teacher-list") }}
                                refreshFunction={handleRefresh}
                            />
                            :
                            <div>
                                {/* <SectionRefresh refreshFunction={handleRefresh} /> */}

                                <Table
                                    data={enseignants}
                                    onEdit={handleEditHourEnseignant} />

                            </div>

            }

            {/* Boite de dialogue */}
        </>
    );
};

export default DisciplineDesEnseignants;
