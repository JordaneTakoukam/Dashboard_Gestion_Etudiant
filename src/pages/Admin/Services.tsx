import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableService/Table";
import FormCreateUpdate from "../../components/Modals/ModalService/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalService/FormDelete";
import { useTranslation } from "react-i18next";

export interface Service{
    id?:number;
    code:string;
    libelle:string;
}

const Services = () => {
    const {t}=useTranslation();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const handleEditService = (service : Service) => {
        setSelectedService(service);
    }

    const handleAddService = () => {
        setSelectedService(null);
    }
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
export const services : Service[]=[
    {
        id : 1,
        code : "S01",
        libelle : "Cellule informatique"
    },
    {
        id : 2,
        code : "S02",
        libelle : "Cellule Enquête"
    }
];
