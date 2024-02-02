import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSection/Table";

export interface Section{
    code:string;
    libelle:string;
}

const Sections = () => {
    return (
        <>
            <Breadcrumb pageName="Sections" />
            <Table data={listSection}/>

        </>
    );
};

export default Sections;
export const listSection: Section[] = [
    {
        code:"S001",
        libelle:"Douane",
    },
    {
        code:"S002",
        libelle:"Impôt",
    },
    {
        code:"S003",
        libelle:"Greffier",
    },
    {
        code:"S004",
        libelle:"Magistrat",
    },
    {
        code:"S005",
        libelle:"Maître",
    },
];
