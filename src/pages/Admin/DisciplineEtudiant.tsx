import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import TableEtudiant from "../../components/Tables/TablesDisciplineEtudiants/TableDisciplineEdudiants";
import { listTest } from "./ListeEtudiants";


const DisciplineEtudiants = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return (
        <>
            <Breadcrumb pageName={`Disciplines ${roles.teacher === userRole ? "des étudiants" : roles.student === userRole ? "" : ""}`} />
            <TableEtudiant data={listTest} />


            {/* Boite de dialogue */}
            
        </>
    );
};

export default DisciplineEtudiants;