import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TablesDisciplineEnseignants/Table";
import { enseignants } from "./ListeEnseignants";


const DisciplineDesEnseignants = () => {
    return (
        <>
            <Breadcrumb pageName="Discipline des enseignants" />
            <Table data={enseignants}/>

            {/* Boite de dialogue */}
        </>
    );
};

export default DisciplineDesEnseignants;
