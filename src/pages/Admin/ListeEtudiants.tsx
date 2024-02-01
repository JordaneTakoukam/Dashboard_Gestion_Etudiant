import Breadcrumb from "../../components/Breadcrumb";
import ModalCreateEtudiant from "../../components/Modals/ModalEtudiant/DialogCreateEtudiant";
import ModalDeleteEtudiant from "../../components/Modals/ModalEtudiant/DialogDeleteEtudiant";
import ModalUpdateEtudiant from "../../components/Modals/ModalEtudiant/DialogUpdateEtudiant";
import TableEtudiant from "../../components/Tables/TablesEtudiants/TableEdudiants";

export interface Etudiant {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    matricule: string;
    classe: string;
    nbAbscences : number
}

const ListeDesEtudiants = () => {
    return (
        <>
            <Breadcrumb pageName="Liste des étudiants" />
            <TableEtudiant data={listTest} />


            {/* Boite de dialogue */}
            <ModalCreateEtudiant />
            <ModalUpdateEtudiant />
            <ModalDeleteEtudiant />


        </>
    );
};

export default ListeDesEtudiants;



export const listTest: Etudiant[] = [
    {
        firstName: "Jane",
        lastName: "Smith",
        email: "test@123",
        contact: "655484959",
        matricule: "CD5678",
        classe: "L2A", 
        nbAbscences : 0
    },
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        classe: "L2B", 
        nbAbscences : 0
    },
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        classe: "L2B", 
        nbAbscences : 0
    },
    {
        firstName: "Bob",
        lastName: "Brown",
        email: "test@123",
        contact: "677978745",
        matricule: "GH3456",
        classe: "L3A", 
        nbAbscences : 0
    },
    {
        firstName: "Emily",
        lastName: "Taylor",
        email: "test@123",
        contact: "677966888",
        matricule: "IJ7890",
        classe: "L3B", 
        nbAbscences : 0
    },
    {
        firstName: "Michael",
        lastName: "Anderson",
        email: "test@123",
        contact: "655489566",
        matricule: "KL2345",
        classe: "L4A", 
        nbAbscences : 0
    },
    {
        firstName: "Sophia",
        lastName: "Martinez",
        email: "test@123",
        contact: "677944777",
        matricule: "MN6789",
        classe: "L4B", 
        nbAbscences : 0
    },
    {
        firstName: "William",
        lastName: "Garcia",
        email: "test@123",
        contact: "655484343",
        matricule: "OP0123",
        classe: "L5A", 
        nbAbscences : 0
    },
    {
        firstName: "Olivia",
        lastName: "Hernandez",
        email: "test@123",
        contact: "677955666",
        matricule: "QR4567",
        classe: "L5B", 
        nbAbscences : 0
    },
    {
        firstName: "James",
        lastName: "Lopez",
        email: "test@123",
        contact: "677988877",
        matricule: "ST8901",
        classe: "L6A", 
        nbAbscences : 0
    },
    {
        firstName: "Maria",
        lastName: "Ramirez",
        email: "test@123",
        contact: "677999888",
        matricule: "UV2345",
        classe: "L6B", 
        nbAbscences : 0
    }
];

