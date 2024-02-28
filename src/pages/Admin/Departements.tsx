import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableDepartement/Table";
import { Region } from "./Regions";
import FormCreateUpdate from "../../components/Modals/ModalDepartement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalDepartement/FormDelete";
import { useTranslation } from "react-i18next";


export interface Departement{
    id?:number,
    code:string;
    libelle:string;
    region:Region;
}

const Departements = () => {
    const {t}=useTranslation();
    const [selectedDepartement, setSelectedDepartement] = useState<Departement | null>(null);
    const handleEditDepartement = (departement: Departement) => {
        setSelectedDepartement(departement);
    }

    const handleAddDepartement = () => {
        setSelectedDepartement(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.departements')} />
            <Table data={departements} onCreate={handleAddDepartement} onEdit={handleEditDepartement}/>

            <FormCreateUpdate departement={selectedDepartement}/>
            <FormDelete departement={selectedDepartement}/>

        </>
    );
};

export default Departements;
const centre:Region={
    id:1,
    code:"CE",
    libelle:"Centre"
}
export const departements: Departement[] = [
    {
        id:1,
        code:"HS",
        libelle:"Haute Sanaga",
        region:centre
    },
    {
        id:2,
        code:"LK",
        libelle:"Lékié",
        region:centre
    },
    {
        id:3,
        code:"MI",
        libelle:"Mbam et Inoubou",
        region:centre
    },
    {
        id:4,
        code:"MK",
        libelle:"Mbam et Kim",
        region:centre
    },
    {
        id:5,
        code:"MF",
        libelle:"Mefou et Afamba",
        region:centre
    },
    {
        id:6,
        code:"MA",
        libelle:"Mefou et Akono",
        region:centre
    },
    {
        id:7,
        code:"MD",
        libelle:"Mfoundi",
        region:centre
    },
    {
        id:8,
        code:"NK",
        libelle:"Nyon et Kellé",
        region:centre
    },
    {
        id:9,
        code:"NF",
        libelle:"Nyong et Mfoumou",
        region:centre
    },
    {
        id:10,
        code:"NS",
        libelle:"Nyong et Soo",
        region:centre
    },
];
