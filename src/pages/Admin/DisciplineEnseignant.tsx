import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TablesDisciplineEnseignants/Table";
import { listTest } from "./ListeEnseignants";


const DisciplineDesEnseignants = () => {
    return (
        <>
            <Breadcrumb pageName="Discipline des enseignants" />
            <Table data={listTest}/>

            {/* Boite de dialogue */}
        </>
    );
};

export default DisciplineDesEnseignants;
