import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableNiveau/Table";
import { Cycle } from "./Cycles";

export interface Niveau{
    id?:number;
    code:string;
    libelle:string;
    cycle: Cycle;
}

const Niveaux = () => {
    return (
        <>
            <Breadcrumb pageName="Niveaux" />
            <Table data={listNiveau}/>

        </>
    );
};

export default Niveaux;
export const listNiveau: Niveau[] = [
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
