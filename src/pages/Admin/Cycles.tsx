import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCycle/Table";

export interface Cycle{
    code:string;
    libelle:string;
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
        code:"CA",
        libelle:"Cycle A",
    },
    {
        code:"CB",
        libelle:"Cycle B",
    },
];
