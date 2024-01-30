import Breadcrumb from "../../components/Breadcrumb";
import ModalCreateEtudiant from "../../components/DialogBoxes/DialogEtudiant/DialogCreateEtudiant";
import TableEtudiant from "../../components/Tables/TablesEtudiants/TableEdudiants";

export interface Etudiant {
    firstName: string;
    lastName: string;
    address: string;
    contact: string;
    matricule: string;
    classe: string;
}

const ListeDesEtudiants = () => {
    return (
        <>
            <Breadcrumb pageName="Liste des étudiants" />
            <TableEtudiant data={listTest} />

            <ModalCreateEtudiant />


        </>
    );
};

export default ListeDesEtudiants;





const listTest: Etudiant[] = [
    {
        firstName: "Jane",
        lastName: "Smith",
        address: "456 Elm Street",
        contact: "655484959",
        matricule: "CD5678",
        classe: "L2A"
    },
    {
        firstName: "Alice",
        lastName: "Johnson",
        address: "789 Oak Street",
        contact: "677988866",
        matricule: "EF9012",
        classe: "L2B"
    },
    {
        firstName: "Alice",
        lastName: "Johnson",
        address: "789 Oak Street",
        contact: "677988866",
        matricule: "EF9012",
        classe: "L2B"
    },
    {
        firstName: "Bob",
        lastName: "Brown",
        address: "321 Pine Street",
        contact: "677978745",
        matricule: "GH3456",
        classe: "L3A"
    },
    {
        firstName: "Emily",
        lastName: "Taylor",
        address: "654 Cedar Street",
        contact: "677966888",
        matricule: "IJ7890",
        classe: "L3B"
    },
    {
        firstName: "Michael",
        lastName: "Anderson",
        address: "987 Maple Street",
        contact: "655489566",
        matricule: "KL2345",
        classe: "L4A"
    },
    {
        firstName: "Sophia",
        lastName: "Martinez",
        address: "210 Birch Street",
        contact: "677944777",
        matricule: "MN6789",
        classe: "L4B"
    },
    {
        firstName: "William",
        lastName: "Garcia",
        address: "543 Walnut Street",
        contact: "655484343",
        matricule: "OP0123",
        classe: "L5A"
    },
    {
        firstName: "Olivia",
        lastName: "Hernandez",
        address: "876 Spruce Street",
        contact: "677955666",
        matricule: "QR4567",
        classe: "L5B"
    },
    {
        firstName: "James",
        lastName: "Lopez",
        address: "109 Cherry Street",
        contact: "677988877",
        matricule: "ST8901",
        classe: "L6A"
    },
    {
        firstName: "Maria",
        lastName: "Ramirez",
        address: "210 Oak Street",
        contact: "677999888",
        matricule: "UV2345",
        classe: "L6B"
    }
];

