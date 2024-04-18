import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TablesDisciplineEnseignants/Table";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { SectionRefresh } from "../../components/ui/SectionRefresh";
import { setEnseignant, setEnseignantsLoading, setErrorPageEnseignant } from "../../_redux/features/enseignant_slice";
import ModalCreateEnseignant from "../../components/Modals/ModalEnseignant/FormCreateUpdate";
import { setShowModal } from "../../_redux/features/setting";
import { apiGetEnseignantsWithPagination } from "../../api/other_users/api_enseignant";


const DisciplineDesEnseignants = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { data: { enseignants }, pageIsLoading, pageError } = useSelector((state: RootState) => state.enseignantSlice);

    const [selectedEnseignant, setSelectedEnseignant] = useState<EnseignantType | null>(null);
    const [isHourRemove, setHourRemove] = useState(false);
    const handleEditHourEnseignant = (enseignant: EnseignantType, isHourRemove: boolean) => {
        console.log("handleEditHour");
        setSelectedEnseignant(enseignant);
        setHourRemove(isHourRemove);
    }


    const fetchEnseignants = async () => {
        dispatch(setEnseignantsLoading(true));
        try {
            const fetchedEnseignants = await apiGetEnseignantsWithPagination({ page: 1 });
            if (fetchedEnseignants) {
                dispatch(setEnseignant(fetchedEnseignants));
                dispatch(setErrorPageEnseignant(null));
            } else {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageEnseignant(t('message.erreur')));
        } finally {
            dispatch(setEnseignantsLoading(false));
        }
    };

    const handleRefresh = async () => {
        await fetchEnseignants();
    };

    const handleCreate = () => {
        setSelectedEnseignant(null);
        dispatch(setShowModal())
    }


    useEffect(() => {
        if (enseignants.length === 0) {
            fetchEnseignants();
        }
    }, [dispatch]);

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
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh}
                            />
                            :
                            <div>
                                <SectionRefresh refreshFunction={handleRefresh} />

                                <Table
                                    data={enseignants}
                                    onEdit={handleEditHourEnseignant} />

                            </div>

            }


            {enseignants.length === 0 ?
                <ModalCreateEnseignant enseignant={selectedEnseignant} />
                : <FormCreateUpdate user={selectedEnseignant} isHourRemove={isHourRemove} />
            }

            {/* Boite de dialogue */}
        </>
    );
};

export default DisciplineDesEnseignants;
