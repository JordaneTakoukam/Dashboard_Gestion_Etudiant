import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSection/Table";
import FormCreateUpdate from "../../components/Modals/ModalSection/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSection/FormDelete";

export interface Section{
    id?:number;
    code:string;
    libelle:string;
}

const Sections = () => {
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const handleEditSection = (section : Section) => {
        setSelectedSection(section);
    }

    const handleAddSection = () => {
        setSelectedSection(null);
    }
    return (
        <>
            <Breadcrumb pageName="Sections" />
            <Table data={sections} onCreate={handleAddSection} onEdit={handleEditSection}/>

            <FormCreateUpdate section={selectedSection}/>
            <FormDelete section={selectedSection}/>

        </>
    );
};

export default Sections;
export const sections: Section[] = [
    {
        id:1,
        code:"S001",
        libelle:"Douane",
    },
    {
        id:2,
        code:"S002",
        libelle:"Impôt",
    },
    {
        id:3,
        code:"S003",
        libelle:"Greffier",
    },
    {
        id:4,
        code:"S004",
        libelle:"Magistrat",
    },
    {
        id:5,
        code:"S005",
        libelle:"Maître",
    },
];
