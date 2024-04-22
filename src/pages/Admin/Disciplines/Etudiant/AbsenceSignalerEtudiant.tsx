import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import { setShowModal } from "../../../../_redux/features/setting";
import Breadcrumb from "../../../../components/Breadcrumb";
import LoadingTable from "../../../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../../../components/_Global/PageErreur";
import { PageNoData } from "../../../../components/_Global/PageNoData";



const AbsenceSignalerEtudiant = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedSection, setSelectedSection] = useState<CommonSettingProps | null>(null);
    const handleEditSection = (section: CommonSettingProps) => {
        setSelectedSection(section);
    }
    const sections = [];
    const handleAddSection = () => {
        setSelectedSection(null);
    }


    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    const handleCreate = () => {
        handleAddSection();
        dispatch(setShowModal())
    }
    const handleRefresh = async () => {
        // dispatch(setLoadingDataSetting(true));
        // try {
        //     const settingsData = await apiGetAllSettings();
        //     dispatch(setDataSetting(settingsData));
        //     dispatch(setErrorDataSetting(null))

        // } catch (error) { dispatch(setErrorDataSetting('une erreur est survenue')) }
        // finally { dispatch(setLoadingDataSetting(false)); }
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.absence_reporting')} />

            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        sections.length === 0 ?
                            <PageNoData
                                afficherBoutonCreer={false}
                                titrePage={t('aucun.absence_signaler')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <div>DATA</div>
                // <Table
                //     data={sections}
                //     onCreate={handleAddSection}
                //     onEdit={handleEditSection} />

            }

            {/* <FormCreateUpdate section={selectedSection} />
            <FormDelete section={selectedSection} /> */}

        </>
    );
};

export default AbsenceSignalerEtudiant;
