import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Breadcrumb";
import Table from "../../../../components/Tables/TableDisciplineEnseignants/Table";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import { apiGetAbsencesWithEnseignantsByFilter } from "../../../../api/discipline/api_discipline";
import ModalCreateUpdateAbsence from "../../../../components/Modals/ModalAbsence/FormCreateUpdate";
import { setAnneeDisciplineEns, setEnseignantDiscipline, setEnseignantSelected, setEnseignantsDisciplineLoading, setErrorPageEnseignantDiscipline, setSemestreDisciplineEns } from "../../../../_redux/features/absence/discipline_enseignant_slice";
import { setShowModal } from "../../../../_redux/features/setting";
import Loading from "../../../../components/ui/loading";

const DisciplineDesEnseignants = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isJustify, setJustify] = useState(false);
    const [isHourRemove, setHourRemove] = useState(false);
    const { data: { enseignants } } = useSelector((state: RootState) => state.enseignantDisciplineSlice);

    const [selectedEtudiant, setSelectedEtudiant] = useState<UserDiscipline | undefined>();
    const [enseignantCustomSelected, setEnseignantCustomSelected] = useState<CustomEtudiantSelect>({ absence: undefined, user: selectedEtudiant })
    const handleShowModal = () => { dispatch(setShowModal()); }
    const handleEditHourEnseignant = (selectEnseignant : UserDiscipline) => {
        
        if(isHourRemove){
            setHourRemove(isHourRemove);
            setJustify(false);
        }

        if(isJustify){
            setJustify(isJustify);
            setHourRemove(false);
        }
        
        if (selectEnseignant) {
            // contien l'utilisateur et l'objet absence a supprimer
            setEnseignantCustomSelected({ absence: undefined, user: selectEnseignant })
            dispatch(setEnseignantSelected(selectEnseignant))
        }

        handleShowModal();
    }


    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const currentSemestre = useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;


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



    useEffect(() => {
        dispatch(setAnneeDisciplineEns(currentYear));
        dispatch(setSemestreDisciplineEns(currentSemestre));
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

    // }, [enseignants.length, loadingSetting]);
    }, [dispatch, t]);

    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.discipline')} />
            {
                settingIsLoading ? 
                    <Loading /> :
                        <Table data={enseignants} onEdit={handleEditHourEnseignant} />
            }

            {/* Boite de dialogue */}
            <ModalCreateUpdateAbsence isStudent={false} user={enseignantCustomSelected} isHourRemove={isHourRemove} isJustify={isJustify} />
        </>
    );
};

export default DisciplineDesEnseignants;
