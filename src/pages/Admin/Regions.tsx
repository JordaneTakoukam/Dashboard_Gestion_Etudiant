import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableRegion/Table";
import FormCreateUpdate from "../../components/Modals/ModalRegion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalRegion/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { CommonSettingProps } from "../../_types/data_setting_type";


const Regions = () => {
    const { t } = useTranslation();
    const [selectedRegion, setSelectedRegion] = useState<CommonSettingProps | null>(null);

    // data depuis le store de redux
    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.region);
    
    const handleEditRegion = (region: CommonSettingProps) => { setSelectedRegion(region) }
    const handleAddRegion = () => { setSelectedRegion(null) }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.regions')} />
            <Table data={regions} onCreate={handleAddRegion} onEdit={handleEditRegion} />

            <FormCreateUpdate region={selectedRegion} />
            <FormDelete region={selectedRegion} />

        </>
    );
};

export default Regions;
