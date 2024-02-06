import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCycle/Table";
import { Section } from "./Sections";
import FormCreateUpdate from "../../components/Modals/ModalCycle/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCycle/FormDelete";

export interface Cycle{
    id?:number,
    code:string;
    libelle:string;
    section:Section;
}

const Cycles = () => {
    const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
    const handleEditCycle = (cycle: Cycle) => {
        setSelectedCycle(cycle);
    }

    const handleAddCycle = () => {
        setSelectedCycle(null);
    }
    return (
        <>
            <Breadcrumb pageName="Cycles" />
            <Table data={cycles} onCreate={handleAddCycle} onEdit={handleEditCycle}/>

            <FormCreateUpdate cycle={selectedCycle}/>
            <FormDelete cycle={selectedCycle}/>

        </>
    );
};

export default Cycles;
export const cycles: Cycle[] = [
    {
        id:1,
        code:"CA",
        libelle:"Cycle A",
        section:{
            id:1,
            code:"S001",
            libelle:"Douane",
        }
    },
    {
        id:2,
        code:"CB",
        libelle:"Cycle B",
        section:{
            id:2,
            code:"S001",
            libelle:"Douane",
        }
    },
];
