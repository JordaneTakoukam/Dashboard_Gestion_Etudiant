import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";

import { useNavigate } from 'react-router-dom';
import { setEtudiantDiscipline, setEtudiantsDisciplineLoading, setErrorPageEtudiantDiscipline, setSemestreDisciplineEns, setEtudiantselected } from "../../../../_redux/features/absence/discipline_etudiant_slice";
import { generateYearRange } from "../../../../fonctions/fonction";
import { apiGetAbsencesWithEtudiantsByFilter } from "../../../../api/discipline/api_discipline";
import Table from "../../../../components/Tables/TableDisciplineEtudiants/Table";
import { setAnneeDisciplineEns } from "../../../../_redux/features/absence/discipline_enseignant_slice";
import Loading from "../../../../components/ui/loading";
import ModalCreateUpdateAbsence from "../../../../components/Modals/ModalAbsence/FormCreateUpdate";
import { setShowModal } from "../../../../_redux/features/setting";



// a mdofier les differetns champs + le slice
const DisciplineDesEtudiants = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isJustify, setJustify] = useState(false);
    const [isHourRemove, setHourRemove] = useState(false);
    // const selectedEtudiant = useSelector((state: RootState) => state.etudiantDisciplineSlice.selected.user);
    

    const { data: { etudiants }, pageIsLoading, pageError } = useSelector((state: RootState) => state.etudiantDisciplineSlice);

    const [selectedEtudiant, setSelectedEtudiant] = useState<UserDiscipline | undefined>();
    const [etudiantCustomSelected, setEtudiantCustomSelected] = useState<CustomEtudiantSelect>({ absence: undefined, user: selectedEtudiant })
    const handleShowModal = () => { dispatch(setShowModal()); }

    const handleEditHourEtudiant = (selectEtudiant : UserDiscipline) => {
        
        if(isHourRemove){
            setHourRemove(isHourRemove);
            setJustify(false);
        }

        if(isJustify){
            setJustify(isJustify);
            setHourRemove(false);
        }
        
        if (selectEtudiant) {
            // contien l'utilisateur et l'objet absence a supprimer
            setEtudiantCustomSelected({ absence: undefined, user: selectEtudiant })
            dispatch(setEtudiantselected(selectEtudiant))
        }

        handleShowModal();
    }


    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux) ?? [];
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const currentPlageDate: string[] = generateYearRange(currentYear, firstYear);


    const loadingSetting = useSelector((state: RootState) => state.dataSetting.loading);

    const fetchEtudiants = async () => {
        dispatch(setEtudiantsDisciplineLoading(true));
        const currentCycleId = sections && sections.length > 0 ? cycles.find(cycle => cycle.section === "" + sections[0]._id) : null;
        const currentNiveauId = currentCycleId && cycles && cycles.length > 0 ? niveaux.find(niveau => niveau.cycle === "" + currentCycleId._id)?._id : null;
        try {
            let fetchedEtudiants;
            const emptyEtudiants: EtudiantDisciplineListGetType = {
                etudiants: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0
            }
            if (currentNiveauId) {
                fetchedEtudiants = await apiGetAbsencesWithEtudiantsByFilter({
                    page: 1, semestre: currentSemestre, annee: currentYear, niveauId: currentNiveauId
                });
            }

            if (fetchedEtudiants) {
                dispatch(setEtudiantDiscipline(fetchedEtudiants));

                dispatch(setErrorPageEtudiantDiscipline(null));
            } else {
                dispatch(setEtudiantDiscipline(emptyEtudiants));
                dispatch(setErrorPageEtudiantDiscipline(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageEtudiantDiscipline(t('message.erreur')));
        } finally {
            dispatch(setEtudiantsDisciplineLoading(false));
        }
    };

    const handleRefresh = async () => {
        await fetchEtudiants();
    };


    useEffect(() => {
        dispatch(setAnneeDisciplineEns(currentYear));
        dispatch(setSemestreDisciplineEns(currentSemestre));
        const fetchData = async () => {
            if (etudiants.length === 0) {
                dispatch(setEtudiantsDisciplineLoading(true));

                while (loadingSetting) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100ms avant de vérifier à nouveau
                }
                fetchEtudiants();
            }
        };

        fetchData();

    }, [dispatch, t]);


    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.discipline')} />
            {
                settingIsLoading ? 
                    <Loading /> :
                        <Table data={etudiants} onEdit={handleEditHourEtudiant} />
            }

            {/* Boite de dialogue */}
            <ModalCreateUpdateAbsence isStudent={true} user={etudiantCustomSelected} isHourRemove={isHourRemove} isJustify={isJustify} />
        </>
    );
};

export default DisciplineDesEtudiants;
