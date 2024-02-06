import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalNiveau/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalNiveau/FormDelete";
import Table from "../../components/Tables/TableNiveau/Table";
import { Cycle } from "./Cycles";

export interface Niveau{
    id?:number;
    code:string;
    libelle:string;
    cycle: Cycle;
}

const Niveaux = () => {
    const [selectedNiveau, setSelectedNiveau] = useState<Niveau | null>(null);
    const handleEditCycle = (niveau: Niveau) => {
        setSelectedNiveau(niveau);
    }

    const handleAddCycle = () => {
        setSelectedNiveau(null);
    }
    return (
        <>
            <Breadcrumb pageName="Niveaux" />
            <Table data={niveaux}  onCreate={handleAddCycle} onEdit={handleEditCycle}/>

            <FormCreateUpdate niveau={selectedNiveau}/>
            <FormDelete niveau={selectedNiveau}/>

        </>
    );
};

export default Niveaux;
export const niveau:Niveau={
    id:1,
    code:"N1",
    libelle:"1ère année",
    cycle:{
        id:1,
        code:"CA",
        libelle:"Cycle A",
        section:{
            code:"S001",
            libelle:"Douane",
        }
    },
}
export const niveaux: Niveau[] = [
    {
        id:1,
        code:"N1",
        libelle:"1ère année",
        cycle:{
            id:1,
            code:"CA",
            libelle:"Cycle A",
            section:{
                code:"S001",
                libelle:"Douane",
            }
        },
    },
    {
        id:2,
        code:"N2",
        libelle:"2ème année",
        cycle : {
            id:1,
            code:"CA",
            libelle:"Cycle A",
            section:{
                code:"S001",
                libelle:"Douane",
            }
        },
    },
];
