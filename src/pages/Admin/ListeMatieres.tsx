import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";
import { Niveau } from "./Niveaux";
import FormCreateUpdate from "../../components/Modals/ModalMatiere/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalMatiere/FormDelete";
import { Enseignant } from "./ListeEnseignants";
import Chapitres, { Chapitre } from "./Chapitres";
import { useTranslation } from "react-i18next";

export interface Matiere {
    id? : number;
    code: string;
    libelle: string;
    prerequis?: string;
    evaluationDesAcquis?: string;
    niveau: Niveau;
    enseignant:Enseignant;
    enseignantSup?:Enseignant
    approchePedagogique?: string;
    chapitres? : Chapitre[];
}




const ListeDesMatieres = () => {
    const {t}=useTranslation();
    const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
    const [openChapitres, setOpenChapitre]=useState(false);
    const handleEditMatiere = (matiere : Matiere) => {
        setSelectedMatiere(matiere);
        setOpenChapitre(false);
    }

    const handleAddMatiere = () => {
        console.log("is call");
        setSelectedMatiere(null);
        setOpenChapitre(false);
    }

    const handleOpenChapitres = (matiere: Matiere) => {
        setSelectedMatiere(matiere);
        setOpenChapitre(true);
    };
    return (
        <>
            {!openChapitres && <Breadcrumb pageName={t('sub_menu.liste_matiere')} />}
            {!openChapitres && <Table data={matieres} onCreate={handleAddMatiere} onEdit={handleEditMatiere} onAddChap={handleOpenChapitres}/>}
            
            {/* {!openChapitres && <FormCreateUpdate matiere={selectedMatiere}/>} */}
            {!openChapitres && <FormDelete matiere={selectedMatiere}/>}
            {openChapitres && <Chapitres matiereSelectionnee={selectedMatiere} returnWithMatiere={handleAddMatiere}/>}
        </>
    );
};

export default ListeDesMatieres;

export const enseignants: Enseignant[] = [
    {
        id:1,
        nom: "Jane",
        prenom: "Smith",
        email: "test@123",
        contact: "655484959",
        matricule: "CD5678",
        genre:"H",
        abscences:[],
        
    },
    {
        id:2,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "M", 
        abscences:[],
    },
    {
        id:3,
        nom: "Alice",
        prenom: "Johnson",
        email: "test@123",
        contact: "677988866",
        matricule: "EF9012",
        genre: "F", 
        abscences:[],
    },
    {
        id:4,
        nom: "Bob",
        prenom: "Brown",
        email: "test@123",
        contact: "677978745",
        matricule: "GH3456",
        genre: "H", 
        abscences:[],
    },
    {
        id:5,
        nom: "Emily",
        prenom: "Taylor",
        email: "test@123",
        contact: "677966888",
        matricule: "IJ7890",
        genre: "F", 
        abscences:[],
    },
    {
        id:6,
        nom: "Michael",
        prenom: "Anderson",
        email: "test@123",
        contact: "655489566",
        matricule: "KL2345",
        genre: "H", 
        abscences:[],
    },
    {
        id:7,
        nom: "Sophia",
        prenom: "Martinez",
        email: "test@123",
        contact: "677944777",
        matricule: "MN6789",
        genre: "F", 
        abscences:[],
    },
    {
        id:8,
        nom: "William",
        prenom: "Garcia",
        email: "test@123",
        contact: "655484343",
        matricule: "OP0123",
        genre: "H", 
        abscences:[],
    },
    {
        id:9,
        nom: "Olivia",
        prenom: "Hernandez",
        email: "test@123",
        contact: "677955666",
        matricule: "QR4567",
        genre: "F", 
        abscences:[],
    },
    {
        id:10,
        nom: "James",
        prenom: "Lopez",
        email: "test@123",
        contact: "677988877",
        matricule: "ST8901",
        genre: "H", 
        abscences:[],
    },
    {
        id:11,
        nom: "Maria",
        prenom: "Ramirez",
        email: "test@123",
        contact: "677999888",
        matricule: "UV2345",
        genre: "F", 
        abscences:[],
    }
];

export const matieres: Matiere[] = [];



