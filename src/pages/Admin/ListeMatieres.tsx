import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";

export interface Matiere {
    id? : number;
    code: string;
    libelle: string;
    prerequis: string;
    evaluationDesAcquis: string;
    niveau: string;
    approchePedagogique: string;
    nbChapitre: number;
    volumeHoraire: number;
    chapitres : Chapitre[];
}

export interface Objectif {
    id?:number;
    libelle: string;
    etat: number;
}

export interface Chapitre {
    id?:number;
    code : string;
    libelle: string;
    objectifs : Objectif[];
}

const ListeDesMatieres = () => {
    return (
        <>
            <Breadcrumb pageName="Liste des matières" />
            <Table data={listMatieres}/>

        </>
    );
};

export default ListeDesMatieres;
export const listMatieres: Matiere[] = [
    {
        code: "CG1",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire: 20,
        chapitres: [
            {
                code: "CG1C1",
                libelle: "Introduction au budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre les bases du budget de l'Etat", etat: 1 },
                    { libelle: "Connaître l'importance du budget dans la gestion publique", etat: 1 },
                    { libelle: "Identifier les différentes phases de l'élaboration du budget", etat: 0 },
                ]
            },
            {
                code: "CG1C2",
                libelle: "Processus d'élaboration du budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre le processus d'élaboration du budget", etat: 0 },
                    { libelle: "Analyser les étapes de l'élaboration budgétaire", etat: 0 },
                    { libelle: "Maîtriser les mécanismes de contrôle du budget", etat: 0 },
                ]
            },
        ]
    },
    {
        code: "CG2",
        libelle: "Elaboration du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire: 20,
        chapitres: [
            {
                code: "CG2C1",
                libelle: "Introduction à l'élaboration budgétaire",
                objectifs: [
                    { libelle: "Comprendre les principes de l'élaboration du budget", etat: 1 },
                    { libelle: "Analyser les différentes composantes du budget", etat: 0 },
                    { libelle: "Identifier les acteurs impliqués dans le processus budgétaire", etat: 0 },
                ]
            },
            {
                code: "CG2C2",
                libelle: "Techniques d'élaboration budgétaire",
                objectifs: [
                    { libelle: "Connaître les techniques courantes d'élaboration du budget", etat: 0 },
                    { libelle: "Mettre en pratique les méthodes d'élaboration budgétaire", etat: 0 },
                    { libelle: "Analyser les résultats budgétaires", etat: 0 },
                ]
            },
        ]
    },
    {
        code: "CG3",
        libelle: "Management des organisations publiques",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 6,
        volumeHoraire: 30,
        chapitres: [
            {
                code: "CG3C1",
                libelle: "Introduction au management public",
                objectifs: [
                    { libelle: "Comprendre les principes du management dans le secteur public", etat: 0 },
                    { libelle: "Analyser les spécificités du management des organisations publiques", etat: 0 },
                    { libelle: "Appliquer les concepts de gestion dans le contexte public", etat: 0 },
                ]
            },
            {
                code: "CG3C2",
                libelle: "Structures organisationnelles",
                objectifs: [
                    { libelle: "Connaître les différentes structures des organisations publiques", etat: 0 },
                    { libelle: "Analyser l'impact des structures sur la performance organisationnelle", etat: 0 },
                    { libelle: "Proposer des améliorations de structures", etat: 0 },
                ]
            },
        ]
    },
    {
        code: "CG4",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire: 20,
        chapitres: [
            {
                code: "CG4C1",
                libelle: "Introduction au budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre les bases du budget de l'Etat", etat: 0 },
                    { libelle: "Connaître l'importance du budget dans la gestion publique", etat: 0 },
                    { libelle: "Identifier les différentes phases de l'élaboration du budget", etat: 0 },
                ]
            },
            {
                code: "CG4C2",
                libelle: "Processus d'élaboration du budget de l'Etat",
                objectifs: [
                    { libelle: "Comprendre le processus d'élaboration du budget", etat: 0 },
                    { libelle: "Analyser les étapes de l'élaboration budgétaire", etat: 0 },
                    { libelle: "Maîtriser les mécanismes de contrôle du budget", etat: 0 },
                ]
            },
        ]
    },
];


