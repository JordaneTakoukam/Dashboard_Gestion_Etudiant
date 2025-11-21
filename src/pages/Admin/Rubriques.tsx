import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableRubrique/Table";
import FormCreateUpdate from "../../components/Modals/ModalRubrique/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalRubrique/FormDelete";

export interface Rubrique{
    id?:number;
    code?:string;
    libelle:string;
    ordre : number;
}

const Rubriques = () => {
    const [selectedRubrique, setSelectedRubrique] = useState<Rubrique | null>(null);
    const handleEditRubrique = (rubrique : Rubrique) => {
        setSelectedRubrique(rubrique);
    }

    const handleAddRubrique = () => {
        setSelectedRubrique(null);
    }
    return (
        <>
            <Breadcrumb pageName="Rubriques" />
            <Table data={rubriques} onCreate={handleAddRubrique} onEdit={handleEditRubrique}/>

            <FormCreateUpdate rubrique={selectedRubrique}/>
            <FormDelete rubrique={selectedRubrique}/>

        </>
    );
};

export default Rubriques;
export const rubriques: Rubrique[] = [
    {
        id:1,
        code:"R1",
        libelle:"Profil",
        ordre:1,
    },
    {
        id:2,
        code:"R2",
        libelle:"Organisation de la formation",
        ordre : 2
    },
    {
        id:3,
        code:"R3",
        libelle:"Contenus pédagogiques et animation de la formation",
        ordre : 3
    }
];

export const allRubriques: Rubrique[] = [
    {
        id:1,
        code:"R1",
        libelle:"Profil",
        ordre:1,
    },
    {
        id:2,
        code:"R2",
        libelle:"Organisation de la formation",
        ordre : 2
    },
    {
        id:3,
        code:"R3",
        libelle:"Contenus pédagogiques et animation de la formation",
        ordre : 3
    }
];
