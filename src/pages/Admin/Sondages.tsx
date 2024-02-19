import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSondage/Table";
import { Niveau } from "./Niveaux";
import FormCreateUpdate from "../../components/Modals/ModalSondage/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSondage/FormDelete";
import { enseignants } from "./ListeEnseignants";
import { Rubrique } from "./Rubriques";
import { Matiere } from "./ListeMatieres";
import { Cycle } from "./Cycles";
import FormSondage from "../../components/Modals/ModalSondage/FormSondage";

export interface Sondage {
    id? : number;
    code: string;
    libelle: string;
    cycle: Cycle;
    rubriques : Rubrique[];
    matiere:Matiere;
}




const ListeDesSondages = () => {
    const [selectedSondage, setSelectedSondage] = useState<Sondage | null>(null);
    const handleEditSondage = (sondage : Sondage) => {
        setSelectedSondage(sondage);
    }

    const handletoDoSondage = (sondage : Sondage) => {
        setSelectedSondage(sondage);
    }


    const handleAddSondage = () => {
        console.log("is call");
        setSelectedSondage(null);
    }

    const handleOpenRubriques = (sondage: Sondage) => {
        setSelectedSondage(sondage);
    };
    return (
        <>
            <Breadcrumb pageName="Liste des matières" />
            <Table data={sondages} onCreate={handleAddSondage} onEdit={handleEditSondage} toDo={handletoDoSondage} />
            
            <FormCreateUpdate sondage={selectedSondage}/>
            <FormSondage sondage={selectedSondage}/>
            <FormDelete sondage={selectedSondage}/>
        </>
    );
};

export default ListeDesSondages;
const cycle:Cycle={
    id:1,
    code:"CA",
    libelle:"Cycle A",
    section:{
        code:"S001",
        libelle:"Douane",
    }
}
const niveau:Niveau={
    id:1,
    code:"N1",
    libelle:"1ère année",
    cycle:cycle
}

const matiere1:Matiere={
    id:1,
    code: "CG1",
    libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
    prerequis: "",
    evaluationDesAcquis: "Contrôle continu, Examen écrit",
    enseignant:enseignants[0],
    niveau: niveau,
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
}
const matiere2:Matiere={
    id:2,
    code: "CG2",
    libelle: "Elaboration du budget de l'Etat",
    prerequis: "",
    evaluationDesAcquis: "Contrôle continu, Examen écrit",
    enseignant:enseignants[1],
    enseignantSup:enseignants[0],
    niveau: niveau,
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
}
const rubriques:Rubrique[]=[
    {
        id:1,
        code:"R1",
        libelle:"Profil",
        ordre:1,
    },
    {
        id:2,
        code:"R2",
        libelle:"Organisation de la formation",
        ordre : 2
    },
    {
        id:3,
        code:"R3",
        libelle:"Contenus pédagogiques et animation de la formation",
        ordre : 3
    }
]


export const sondages: Sondage[] = [
    {
        id:1,
        code: "S1",
        libelle: "Fiche d'évaluation des enseignements d'élaboration, exécution et contrôle du budget de l'Etat",
        cycle: cycle,
        rubriques: rubriques,
        matiere:matiere1
    },
    {
        id:2,
        code: "S2",
        libelle: "Fiche d'évaluation des enseignements d'élaboration du budget de l'Etat",
        cycle: cycle,
        rubriques: rubriques,
        matiere:matiere2
    },
];



