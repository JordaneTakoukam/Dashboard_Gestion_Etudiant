import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCycle/Table";
import { Section } from "./Sections";

export interface Cycle{
    id?:number,
    code:string;
    libelle:string;
    section:Section;
}

const Cycles = () => {
    return (
        <>
            <Breadcrumb pageName="Cycles" />
            <Table data={listCycle}/>

        </>
    );
};

export default Cycles;
export const listCycle: Cycle[] = [
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
