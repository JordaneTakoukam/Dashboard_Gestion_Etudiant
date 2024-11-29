import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalSalleCours/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSalleCours/FormDelete";
import Table from "../../components/Tables/TableSalleCours/Table";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setLoadingDataSetting, setDataSetting, setErrorDataSetting } from "../../_redux/features/data_setting_slice";
import { setShowModal } from "../../_redux/features/setting";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import { PageErreur } from "../../components/_Global/PageErreur";
import { PageNoData } from "../../components/_Global/PageNoData";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import Loading from "../../components/ui/loading";

export interface SalleCours{
    id?:number;
    code:string;
    nom:string;
    nbPlace:number;
}

const SallesDeCours = () => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [selectedSalleCours, setSelectedSalleCours] = useState<SalleDeCoursProps | null>(null);
    const sallesDecours = useSelector((state: RootState) => state.dataSetting.dataSetting.sallesDeCours);
    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);
    
    const handleEditSection = (salleCours : SalleDeCoursProps) => {
        setSelectedSalleCours(salleCours);
    }

    const handleAddSection = () => {
        setSelectedSalleCours(null);
    }

    const handleCreate = () => {
        handleAddSection();
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
            <Breadcrumb pageName={t('menu.salles')} />
            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        sallesDecours.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.salle')}
                                titreBouton={t('ajouter_votre_premier.salle')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />

                            : <Table data={sallesDecours} onCreate={handleAddSection} onEdit={handleEditSection}/>
            }

            <FormCreateUpdate salleDeCours={selectedSalleCours}/>
            <FormDelete salleDeCours={selectedSalleCours}/>

        </>
    );
};

export default SallesDeCours;
export const sallesCours: SalleCours[] = [];