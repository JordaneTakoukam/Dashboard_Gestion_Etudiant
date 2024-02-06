import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalSalleCours/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSalleCours/FormDelete";
import Table from "../../components/Tables/TableSalleCours/Table";

export interface SalleCours{
    id?:number;
    code:string;
    nom:string;
    nbPlace:number;
}

const SallesDeCours = () => {
    const [selectedSalleCours, setSelectedSalleCours] = useState<SalleCours | null>(null);
    const handleEditSection = (salleCours : SalleCours) => {
        setSelectedSalleCours(salleCours);
    }

    const handleAddSection = () => {
        setSelectedSalleCours(null);
    }
    return (
        <>
            <Breadcrumb pageName="Salles de cours" />
            <Table data={sallesCours} onCreate={handleAddSection} onEdit={handleEditSection}/>

            <FormCreateUpdate salleCours={selectedSalleCours}/>
            <FormDelete salleCours={selectedSalleCours}/>

        </>
    );
};

export default SallesDeCours;
export const sallesCours: SalleCours[] = [
    {
        id:1,
        code:"S1",
        nom:"S001",
        nbPlace:100
    },
    {
        id:2,
        code:"S2",
        nom:"S002",
        nbPlace:100
    },
    {
        id:3,
        code:"S3",
        nom:"S003",
        nbPlace:100
    },
    {
        id:4,
        code:"1001",
        nom:"Amphi 1001",
        nbPlace:1500
    },
    {
        id:5,
        code:"1002",
        nom:"Amphi 1002",
        nbPlace:1500
    },
    {
        id:6,
        code:"501",
        nom:"Amphi 501",
        nbPlace:700
    },
    {
        id:7,
        code:"502",
        nom:"Amphi 502",
        nbPlace:700
    },
];