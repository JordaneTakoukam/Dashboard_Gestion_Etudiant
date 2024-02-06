import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalEnseignant/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEnseignant/FormDelete";
import Table from "../../components/Tables/TablesEnseignants/Table";
import { Grade, Categorie, Fonction, Service, Region, Departement, Commune } from "./ListeEtudiants";
import { Niveau } from "./Niveaux";

export interface Enseignant {
    id?:number
    nom: string;
    prenom?: string;
    genre : string;
    dateNaiss?:string,
    lieuNaiss?:string;
    email: string;
    contact?: string;
    matricule?: string;
    niveaux?: Niveau[];
    grade?:Grade;
    categorie?:Categorie;
    fonction?:Fonction;
    service?:Service;
    region?:Region;
    departement?:Departement;
    commune?:Commune;
    dateEntreeAdmin?:string;
    nbAbscences: number;
}
const ListeDesEnseignant = () => {
    const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
        // Fonction pour gérer l'édition d'un étudiant
    const handleEditEtudiant = (enseignant: Enseignant) => {
        setSelectedEnseignant(enseignant);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddEtudiant = () => {
        setSelectedEnseignant(null);
    }
    return (
        <>
            <Breadcrumb pageName="Liste des enseignants" />
            <Table data={enseignants} onCreate={handleAddEtudiant} onEdit={handleEditEtudiant}/>


            {/* Boite de dialogue */}
            <FormCreateUpdate enseignant={selectedEnseignant}/>
            <FormDelete enseignant={selectedEnseignant}/>

        </>
    );
};

export default ListeDesEnseignant;

export const enseignants: Enseignant[] = [
    {
        id:1,
        nom: "Jane",
        prenom: "Smith",
        email: "test@123",
        contact: "655484959",
        matricule: "CD5678",
        genre:"H",
        nbAbscences : 0
    },
    {
        id:2,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "M", 
        nbAbscences : 0
    },
    {
        id:3,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "F", 
        nbAbscences : 0
    },
    {
        id:4,
        nom: "Bob",
        prenom: "Brown",
        email: "test@123",
        contact: "677978745",
        matricule: "GH3456",
        genre: "H", 
        nbAbscences : 0
    },
    {
        id:5,
        nom: "Emily",
        prenom: "Taylor",
        email: "test@123",
        contact: "677966888",
        matricule: "IJ7890",
        genre: "F", 
        nbAbscences : 0
    },
    {
        id:6,
        nom: "Michael",
        prenom: "Anderson",
        email: "test@123",
        contact: "655489566",
        matricule: "KL2345",
        genre: "H", 
        nbAbscences : 0
    },
    {
        id:7,
        nom: "Sophia",
        prenom: "Martinez",
        email: "test@123",
        contact: "677944777",
        matricule: "MN6789",
        genre: "F", 
        nbAbscences : 0
    },
    {
        id:8,
        nom: "William",
        prenom: "Garcia",
        email: "test@123",
        contact: "655484343",
        matricule: "OP0123",
        genre: "H", 
        nbAbscences : 0
    },
    {
        id:9,
        nom: "Olivia",
        prenom: "Hernandez",
        email: "test@123",
        contact: "677955666",
        matricule: "QR4567",
        genre: "F", 
        nbAbscences : 0
    },
    {
        id:10,
        nom: "James",
        prenom: "Lopez",
        email: "test@123",
        contact: "677988877",
        matricule: "ST8901",
        genre: "H", 
        nbAbscences : 0
    },
    {
        id:11,
        nom: "Maria",
        prenom: "Ramirez",
        email: "test@123",
        contact: "677999888",
        matricule: "UV2345",
        genre: "F", 
        nbAbscences : 0
    }
];
