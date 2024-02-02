import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableNiveau/Table";

export interface Niveau{
    code:string;
    libelle:string;
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
        code:"N1",
        libelle:"1ère année",
    },
    {
        code:"N2",
        libelle:"2ème année",
    },
];
