import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCommune/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCommune/FormDelete";
import Table from "../../components/Tables/TableCommune/Table";
import { Departement } from "./Departements";
import { Region } from "./Regions";

export interface Commune{
    id?:number;
    code:string;
    libelle:string;
    departement: Departement;
}

const Communes = () => {
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
    const handleEditDepartement = (commune: Commune) => {
        setSelectedCommune(commune);
    }

    const handleAddDepartement = () => {
        setSelectedCommune(null);
    }
    return (
        <>
            <Breadcrumb pageName="Communex" />
            <Table data={communes}  onCreate={handleAddDepartement} onEdit={handleEditDepartement}/>

            <FormCreateUpdate commune={selectedCommune}/>
            <FormDelete commune={selectedCommune}/>

        </>
    );
};

export default Communes;
const centre:Region={
    id:1,
    code:"CE",
    libelle:"Centre"
}
const departement:Departement={
    id:1,
    code:"HS",
    libelle:"Haute Sanaga",
    region:centre
}
export const communes: Commune[] = [
    {
        id:1,
        code:"YI",
        libelle:"Yaoundé I",
        departement:departement,
    },
    {
        id:2,
        code:"YII",
        libelle:"Yaoundé II",
        departement:departement,
    },
    {
        id:3,
        code:"YIII",
        libelle:"Yaoundé III",
        departement:departement,
    },
    {
        id:4,
        code:"YIV",
        libelle:"Yaoundé IV",
        departement:departement,
    },
    {
        id:5,
        code:"YV",
        libelle:"Yaoundé V",
        departement:departement,
    },
    {
        id:6,
        code:"YVI",
        libelle:"Yaoundé VI",
        departement:departement,
    },
    {
        id:7,
        code:"YVII",
        libelle:"Yaoundé VII",
        departement:departement,
    }
];
