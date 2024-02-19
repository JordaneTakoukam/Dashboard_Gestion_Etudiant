import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableGroupeQuestion/Table";
import { Rubrique } from "./Rubriques";
import FormCreateUpdate from "../../components/Modals/ModalGroupeQuestion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalGroupeQuestion/FormDelete";

export interface GroupeQuestion{
    id?:number,
    code:string;
    libelle:string;
    rubrique:Rubrique;
    displayName:boolean;
    ordre:number;
    sujetDeQuestion?: string;
    displaySubject?:boolean;
    displayType:string;
    reponses:Reponse[];
}
export interface Reponse{
    id?:number;
    ordre:number;
    libelle:string;
}
export const typesAffichage:string[]=["Texte", "Tableau"];
const GroupeQuestions = () => {
    const [selectedGroupeQuestion, setSelectedGroupeQuestion] = useState<GroupeQuestion | null>(null);
    const handleEditGroupeQuestion = (groupeQuestion: GroupeQuestion) => {
        setSelectedGroupeQuestion(groupeQuestion);
    }

    const handleAddGroupeQuestion = () => {
        setSelectedGroupeQuestion(null);
    }
    return (
        <>
            <Breadcrumb pageName="Groupe de questions" />
            <Table data={groupequestions} onCreate={handleAddGroupeQuestion} onEdit={handleEditGroupeQuestion}/>

            <FormCreateUpdate groupeQuestion={selectedGroupeQuestion}/>
            <FormDelete groupeQuestion={selectedGroupeQuestion}/>

        </>
    );
};

export default GroupeQuestions;
export const rubrique1:Rubrique={
    id:1,
    code:"R1",
    libelle:"Profil",
    ordre : 1
}
export const rubrique2:Rubrique={
    id:2,
    code:"R2",
    libelle:"Organisation de la formation",
    ordre : 2
}
export const rubrique3:Rubrique={
    id:3,
    code:"R3",
    libelle:"Contenus pédagogiques et annimation de la formation",
    ordre : 3
}
export const reponsesR21:Reponse[]=[
    {
        id:1,
        ordre:1,
        libelle:"Oui absolument",
    },
    {
        id:2,
        ordre:2,
        libelle:"Oui partiellement",
    },
    {
        id:3,
        ordre:3,
        libelle:"Pas du tout",
    }
]
export const reponsesR31:Reponse[]=[
    {
        id:1,
        ordre:1,
        libelle:"Très satisfait",
    },
    {
        id:2,
        ordre:2,
        libelle:"Satisfait",
    },
    {
        id:3,
        ordre:3,
        libelle:"Moyennement satisfait",
    },
    {
        id:4,
        ordre:4,
        libelle:"Peu satisfait",
    },
    {
        id:5,
        ordre:5,
        libelle:"Insatisfait",
    }
]
export const reponsesR32:Reponse[]=[
    {
        id:1,
        ordre:1,
        libelle:"J'ai très bien compris",
    },
    {
        id:2,
        ordre:2,
        libelle:"J'ai bien compris",
    },
    {
        id:3,
        ordre:3,
        libelle:"Je n'ai compris que partiellement",
    },
    {
        id:4,
        ordre:4,
        libelle:"Je n'ai pas compris",
    },
]
export const groupequestions: GroupeQuestion[] = [
    {
        id:1,
        code:"R2G1",
        libelle:"S'agissant de la programmation des cours, quel est votre degré de satisfaction concernant :",
        displayName:false,
        rubrique:rubrique2,
        ordre:1,
        displayType:"Tableau",
        reponses:reponsesR21,
    },
    {
        id:1,
        code:"R3G1",
        libelle:"Quel est votre degré de satisfaction concernant : ",
        displayName:true,
        rubrique:rubrique3,
        ordre:1,
        displayType:"Tableau",
        reponses:reponsesR31,
    },
    {
        id:2,
        code:"R3G2",
        libelle:"S'agissant spécifiquement des objectifs de la formation, quel est votre degré de compréhension : ",
        displayName:true,
        rubrique:rubrique3,
        ordre:2,
        displayType:"Tableau",
        sujetDeQuestion: "Compréhension des objectifs de formation",
        displaySubject:true,
        reponses:reponsesR32
    },
];
