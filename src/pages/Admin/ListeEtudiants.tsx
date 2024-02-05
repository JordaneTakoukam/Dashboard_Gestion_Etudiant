import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import ModalCreateEtudiant from "../../components/Modals/ModalEtudiant/DialogCreateEtudiant";
import ModalDeleteEtudiant from "../../components/Modals/ModalEtudiant/DialogDeleteEtudiant";
// import ModalUpdateEtudiant from "../../components/Modals/ModalEtudiant/DialogUpdateEtudiant";
import TableEtudiant from "../../components/Tables/TablesEtudiants/TableEdudiants";
import { Niveau } from "./Niveaux";

export interface Etudiant {
    id?:number
    nom: string;
    prenom?: string;
    genre : string;
    dateNaiss?:string,
    lieuNaiss?:string;
    email: string;
    contact?: string;
    matricule?: string;
    niveau: Niveau;
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

export interface Grade{
    id?:number;
    code : string;
    libelle : string;
}
export interface Categorie{
    id?:number;
    code : string;
    libelle : string;
}
export interface Fonction{
    id?:number;
    code : string;
    libelle : string;
}
export interface Service{
    id?:number;
    code : string;
    libelle : string;
}
export interface Region{
    id?:number;
    code : string;
    libelle : string;
}
export interface Departement{
    id?:number;
    code : string;
    libelle : string;
}
export interface Commune{
    id?:number;
    code : string;
    libelle : string;
}



const ListeDesEtudiants = () => {
    const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
        // Fonction pour gérer l'édition d'un étudiant
    const handleEditEtudiant = (etudiant: Etudiant) => {
        setSelectedEtudiant(etudiant);
    }

    // Fonction pour gérer l'ajout d'un nouvel étudiant
    const handleAddEtudiant = () => {
        setSelectedEtudiant(null);
    }
    return (
        <>
            <Breadcrumb pageName="Liste des étudiants" />
            <TableEtudiant data={listTest} onCreate={handleAddEtudiant} onEdit={handleEditEtudiant} />

            {/* Boite de dialogue */}
            <ModalCreateEtudiant etudiant={selectedEtudiant} /> {/*Créer ou modifier un étudiant*/}
            <ModalDeleteEtudiant etudiant={selectedEtudiant}/>{/*Supprimer un étudiant */}
        </>
    );
};

export default ListeDesEtudiants;

export const listTest: Etudiant[] = [
    {
        id : 1,
        nom: "Jane",
        prenom: "Smith",
        email: "test@123",
        contact: "655484959",
        matricule: "CD5678",
        dateNaiss : "2000-02-17",
        genre:"H",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        },
        service : {
            id : 1,
            code : "S01",
            libelle : "Cellule informatique"
        },
        nbAbscences : 0
    },
    {
        id : 2,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        },
        nbAbscences : 0
    },
    {
        id : 3,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 4,
        nom: "Bob",
        prenom: "Brown",
        email: "test@123",
        contact: "677978745",
        matricule: "GH3456",
        genre:"H",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 5,
        nom: "Emily",
        prenom: "Taylor",
        email: "test@123",
        contact: "677966888",
        matricule: "IJ7890",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 6,
        nom: "Michael",
        prenom: "Anderson",
        email: "test@123",
        contact: "655489566",
        matricule: "KL2345",
        genre:"H",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 7,
        nom: "Sophia",
        prenom: "Martinez",
        email: "test@123",
        contact: "677944777",
        matricule: "MN6789",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 8,
        nom: "William",
        prenom: "Garcia",
        email: "test@123",
        contact: "655484343",
        matricule: "OP0123",
        genre:"H",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 9,
        nom: "Olivia",
        prenom: "Hernandez",
        email: "test@123",
        contact: "677955666",
        matricule: "QR4567",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        },
        nbAbscences : 0
    },
    {
        id : 10,
        nom: "James",
        prenom: "Lopez",
        email: "test@123",
        contact: "677988877",
        matricule: "ST8901",
        genre:"H",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    },
    {
        id : 11,
        nom: "Maria",
        prenom: "Ramirez",
        email: "test@123",
        contact: "677999888",
        matricule: "UV2345",
        genre:"F",
        niveau: {
            id:1,
            code:"N1",
            libelle:"1ère année",
            cycle:{
                id:1,
                code:"CA",
                libelle:"Cycle A",
                section:{
                    code:"S001",
                    libelle:"Douane",
                }
            },
        }, 
        nbAbscences : 0
    }
];

export const grades: Grade[]=[];
export const categories : Categorie[]=[];
export const services : Service[]=[
    {
        id : 1,
        code : "S01",
        libelle : "Cellule informatique"
    },
    {
        id : 2,
        code : "S02",
        libelle : "Cellule Enquête"
    }
];
export const fonctions : Fonction[]=[];
export const regions : Region[]=[];
export const departements : Departement[]=[];
export const communes : Commune[]=[];

