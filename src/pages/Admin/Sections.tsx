import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSection/Table";

export interface Section{
    id?:number;
    code:string;
    libelle:string;
}

const Sections = () => {
    return (
        <>
            <Breadcrumb pageName="Sections" />
            <Table data={sections}/>

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
