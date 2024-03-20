import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";


const Matieres = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    return (
        <>
            <Breadcrumb pageName={`Matières ${roles.enseignant === userRole ? "de l'enseignant" : roles.etudiant === userRole ? "" : ""}`} />

        </>
    );
};

export default Matieres;
