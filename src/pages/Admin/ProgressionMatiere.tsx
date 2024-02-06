import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { matieres } from "./ListeMatieres";


const ProgressionMatiere = () => {
    return (
        <>
            <Breadcrumb pageName="Progréssion des matières" />
            <Table data={matieres[0]}/>
        </>
    );
};

export default ProgressionMatiere;
