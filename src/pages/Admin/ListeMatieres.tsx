import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";
import { Niveau } from "./Niveaux";
import FormCreateUpdate from "../../components/Modals/ModalMatiere/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalMatiere/FormDelete";
import { Enseignant } from "./ListeEnseignants";
import Chapitres, { Chapitre } from "./Chapitres";
import { Link, useNavigate } from "react-router-dom";

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
    const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
    const navigate = useNavigate();
    const handleEditMatiere = (matiere : Matiere) => {
        setSelectedMatiere(matiere);
    }

    const handleAddMatiere = () => {
        console.log("is call");
        setSelectedMatiere(null);
    }

    const handleOpenChapitres = (matiere: Matiere) => {
        setSelectedMatiere(matiere);
    };
    return (
        <>
            {!selectedMatiere && <Breadcrumb pageName="Liste des matières" />}
            {!selectedMatiere && <Table data={matieres} onCreate={handleAddMatiere} onEdit={handleEditMatiere} onAddChap={handleOpenChapitres}/>}
            
            <FormCreateUpdate matiere={selectedMatiere}/>
            <FormDelete matiere={selectedMatiere}/>
            {selectedMatiere && <Chapitres matiereSelectionnee={selectedMatiere} returnWithMatiere={handleAddMatiere}/>}
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

export const matieres: Matiere[] = [
    {
        id:1,
        code: "CG1",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        enseignant:enseignants[0],
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
        approchePedagogique: "APC",
        chapitres: [
            {
                code: "CG1C1",
                libelle: "Introduction au budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre les bases du budget de l'Etat", etat: 1 },
                    { libelle: "Connaître l'importance du budget dans la gestion publique", etat: 1 },
                    { libelle: "Identifier les différentes phases de l'élaboration du budget", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:8},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:4},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
            {
                code: "CG1C2",
                libelle: "Processus d'élaboration du budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre le processus d'élaboration du budget", etat: 0 },
                    { libelle: "Analyser les étapes de l'élaboration budgétaire", etat: 0 },
                    { libelle: "Maîtriser les mécanismes de contrôle du budget", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:5},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:2},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
        ]
    },
    {
        id:2,
        code: "CG2",
        libelle: "Elaboration du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        enseignant:enseignants[1],
        enseignantSup:enseignants[0],
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
        approchePedagogique: "APC",
        chapitres: [
            {
                code: "CG2C1",
                libelle: "Introduction à l'élaboration budgétaire",
                objectifs: [
                    { libelle: "Comprendre les principes de l'élaboration du budget", etat: 1 },
                    { libelle: "Analyser les différentes composantes du budget", etat: 0 },
                    { libelle: "Identifier les acteurs impliqués dans le processus budgétaire", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:7},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:4},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
            {
                code: "CG2C2",
                libelle: "Techniques d'élaboration budgétaire",
                objectifs: [
                    { libelle: "Connaître les techniques courantes d'élaboration du budget", etat: 0 },
                    { libelle: "Mettre en pratique les méthodes d'élaboration budgétaire", etat: 0 },
                    { libelle: "Analyser les résultats budgétaires", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:5},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:2},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
        ]
    },
    {
        id:3,
        code: "CG3",
        libelle: "Management des organisations publiques",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        enseignant:enseignants[3],
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
        approchePedagogique: "APC",
        chapitres: [
            {
                code: "CG3C1",
                libelle: "Introduction au management public",
                objectifs: [
                    { libelle: "Comprendre les principes du management dans le secteur public", etat: 0 },
                    { libelle: "Analyser les spécificités du management des organisations publiques", etat: 0 },
                    { libelle: "Appliquer les concepts de gestion dans le contexte public", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:5},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:2},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
            {
                code: "CG3C2",
                libelle: "Structures organisationnelles",
                objectifs: [
                    { libelle: "Connaître les différentes structures des organisations publiques", etat: 0 },
                    { libelle: "Analyser l'impact des structures sur la performance organisationnelle", etat: 0 },
                    { libelle: "Proposer des améliorations de structures", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:7},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:4},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
        ]
    },
    {
        id:4,
        code: "CG4",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        enseignant:enseignants[4],
        enseignantSup:enseignants[5],
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
        approchePedagogique: "APC",
        chapitres: [
            {
                code: "CG4C1",
                libelle: "Introduction au budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre les bases du budget de l'Etat", etat: 0 },
                    { libelle: "Connaître l'importance du budget dans la gestion publique", etat: 0 },
                    { libelle: "Identifier les différentes phases de l'élaboration du budget", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:5},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:2},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
            {
                code: "CG4C2",
                libelle: "Processus d'élaboration du budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre le processus d'élaboration du budget", etat: 0 },
                    { libelle: "Analyser les étapes de l'élaboration budgétaire", etat: 0 },
                    { libelle: "Maîtriser les mécanismes de contrôle du budget", etat: 0 },
                ],
                typesEnseignement:[
                    {id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:5},
                    {id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:2},
                    {id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0},
                ]
            },
        ]
    },
];



