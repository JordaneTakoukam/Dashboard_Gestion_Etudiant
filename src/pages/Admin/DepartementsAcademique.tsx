import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import { setShowModal } from "../../_redux/features/setting";
import Table from "../../components/Tables/TableDepartementAcademique/Table";
import FormCreateUpdate from "../../components/Modals/ModalDepartementAcademique/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalDepartementAcademique/FormDelete";
import Loading from "../../components/ui/loading";


const DepartementsAcademique = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selecteddepartementAcademique, setSelecteddepartementAcademique] = useState<CommonSettingProps | null>(null);
    const handleEditdepartementAcademique = (departementAcademique: CommonSettingProps) => {
        setSelecteddepartementAcademique(departementAcademique);
    }
    const departementsAcademique = useSelector((state: RootState) => state.dataSetting.dataSetting.departementsAcademique);
    const handleAdddepartementAcademique = () => {
        setSelecteddepartementAcademique(null);
    }


    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    const handleCreate = () => {
        handleAdddepartementAcademique();
        dispatch(setShowModal())
    }
    const handleRefresh = async () => {
        dispatch(setLoadingDataSetting(true));
        try {
            const settingsData = await apiGetAllSettings();
            dispatch(setDataSetting(settingsData));
            dispatch(setErrorDataSetting(null))

        } catch (error) { dispatch(setErrorDataSetting('une erreur est survenue')) }
        finally { dispatch(setLoadingDataSetting(false)); }
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.departementsAcademique')} />

            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        departementsAcademique.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.departementAcademique')}
                                titreBouton={t('ajouter_votre_premier.departementAcademique')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table
                                data={departementsAcademique}
                                onCreate={handleAdddepartementAcademique}
                                onEdit={handleEditdepartementAcademique} />

            }

            <FormCreateUpdate departementAcademique={selecteddepartementAcademique} />
            <FormDelete departementAcademique={selecteddepartementAcademique} />

        </>
    );
};

export default DepartementsAcademique;
