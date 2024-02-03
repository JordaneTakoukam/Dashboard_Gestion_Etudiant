import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { listMatieres } from "./ListeMatieres";


const ProgressionMatiere = () => {
    return (
        <>
            <Breadcrumb pageName="Progréssion des matières" />
            <Table data={listMatieres[0]}/>
        </>
    );
};

export default ProgressionMatiere;
