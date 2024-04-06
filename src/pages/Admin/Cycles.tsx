import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCycle/Table";
import FormCreateUpdate from "../../components/Modals/ModalCycle/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCycle/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setShowModal } from "../../_redux/features/setting";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";

export interface Cycle {
    id?: number,
    code: string;
    libelle: string;
    // section:Section;
}

const Cycles = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedCycle, setSelectedCycle] = useState<CycleProps | null>(null);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles);
    const handleEditCycle = (cycle: CycleProps) => {
        setSelectedCycle(cycle);
    }

    const handleAddCycle = () => {
        setSelectedCycle(null);
    }

    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);

    const handleCreate = () => {
        handleAddCycle();
        dispatch(setShowModal())
    }
    const handleRefresh = async () => {
        dispatch(setLoadingDataSetting(true));
        try {
            const settingsData = await apiGetAllSettings();
            dispatch(setDataSetting(settingsData));
            dispatch(setErrorDataSetting(null))

        } catch (error) { dispatch(setErrorDataSetting('erreur')) }
        finally { dispatch(setLoadingDataSetting(false)); }
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.cycles')} />
            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        cycles.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.service')}
                                titreBouton={t('ajouter_votre_premier.cycle')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table
                                data={cycles}
                                onCreate={handleAddCycle}
                                onEdit={handleEditCycle} />

            }

            <FormCreateUpdate cycle={selectedCycle} />
            <FormDelete cycle={selectedCycle} />

        </>
    );
};

export default Cycles;
export const cycles: Cycle[] = []