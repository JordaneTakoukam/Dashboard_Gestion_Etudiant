import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalPromotion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalPromotion/FormDelete";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import { PageNoData } from "../../components/_Global/PageNoData";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import { setShowModal } from "../../_redux/features/setting";
import Table from "../../components/Tables/TablePromotion/Table";
import Loading from "../../components/ui/loading";

const Promotions = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [selectedPromotion, setSelectedPromotion] = useState<PromotionProps | null>(null);

    // data depuis le store de redux
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante)??2023; 
    const promotions = useSelector((state: RootState) => state.dataSetting.dataSetting.promotions);

    const handleCreate = () => {
        handleAddPromotion();
        dispatch(setShowModal())
    }
    const handleEditPromotion = (promotion: PromotionProps) => { setSelectedPromotion(promotion) }
    const handleAddPromotion = () => { setSelectedPromotion(null) }


    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);

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
            <Breadcrumb pageName={t('sub_menu.promotions')} />
            {
                pageIsLoading ?
                    <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        promotions.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.promotion')}
                                titreBouton={t('ajouter_votre_premier.promotion')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />

                            : <Table data={promotions} onCreate={handleAddPromotion} onEdit={handleEditPromotion} />

            }

            <FormCreateUpdate promotion={selectedPromotion} />
            <FormDelete promotion={selectedPromotion} />

        </>
    );
};

export default Promotions;
