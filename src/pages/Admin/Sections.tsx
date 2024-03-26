import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSection/Table";
import FormCreateUpdate from "../../components/Modals/ModalSection/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSection/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";


const Sections = () => {
    const {t}=useTranslation();
    const [selectedSection, setSelectedSection] = useState<CommonSettingProps | null>(null);
    const handleEditSection = (section : CommonSettingProps) => {
        setSelectedSection(section);
    }
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.section);
    const handleAddSection = () => {
        setSelectedSection(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.sections')} />
            <Table data={sections} onCreate={handleAddSection} onEdit={handleEditSection}/>

            <FormCreateUpdate section={selectedSection}/>
            <FormDelete section={selectedSection}/>

        </>
    );
};

export default Sections;
