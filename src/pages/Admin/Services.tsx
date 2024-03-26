import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableService/Table";
import FormCreateUpdate from "../../components/Modals/ModalService/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalService/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";


const Services = () => {
    const {t}=useTranslation();
    const [selectedService, setSelectedService] = useState<CommonSettingProps | null>(null);
    const handleEditService = (service : CommonSettingProps) => {
        setSelectedService(service);
    }

    const handleAddService = () => {
        setSelectedService(null);
    }
    const services = useSelector((state: RootState) => state.dataSetting.dataSetting.services);
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.services')} />
            <Table data={services} onCreate={handleAddService} onEdit={handleEditService}/>

            <FormCreateUpdate service={selectedService}/>
            <FormDelete service={selectedService}/>

        </>
    );
};

export default Services;