import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSalleCours/Table";

export interface SalleCours{
    code:string;
    nom:string;
    nbPlace:number;
}

const SallesDeCours = () => {
    return (
        <>
            <Breadcrumb pageName="Salles de cours" />
            <Table data={listSalle}/>

        </>
    );
};

export default SallesDeCours;
export const listSalle: SalleCours[] = [
    {
        code:"S1",
        nom:"S001",
        nbPlace:100
    },
    {
        code:"S2",
        nom:"S002",
        nbPlace:100
    },
    {
        code:"S3",
        nom:"S003",
        nbPlace:100
    },
    {
        code:"1001",
        nom:"Amphi 1001",
        nbPlace:1500
    },
    {
        code:"1002",
        nom:"Amphi 1002",
        nbPlace:1500
    },
    {
        code:"501",
        nom:"Amphi 501",
        nbPlace:700
    },
    {
        code:"502",
        nom:"Amphi 502",
        nbPlace:700
    },
];