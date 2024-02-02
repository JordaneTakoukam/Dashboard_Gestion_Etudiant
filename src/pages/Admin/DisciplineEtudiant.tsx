import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import { listTest } from "./ListeEtudiants";
import TableDisciplineEtudiant from "../../components/Tables/TablesDisciplineEtudiants/TableDisciplineEdudiants";


const DisciplineEtudiants = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return (
        <>
            <Breadcrumb pageName={`Disciplines ${roles.teacher === userRole ? "des étudiants" : roles.student === userRole ? "" : ""}`} />
            <TableDisciplineEtudiant data={listTest} />


            {/* Boite de dialogue */}
            
        </>
    );
};

export default DisciplineEtudiants;