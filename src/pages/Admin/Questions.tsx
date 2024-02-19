import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalQuestion/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalQuestion/FormDelete";
import Table from "../../components/Tables/TableQuestion/Table";
import { GroupeQuestion, Reponse } from "./GroupeQuestions";
import { Rubrique } from "./Rubriques";

export interface Question{
    id?:number;
    code:string;
    libelle:string;
    ordre : number;
    groupeQuestion: GroupeQuestion;
}


const Questions = () => {
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const handleEditGroupeQuestion = (question: Question) => {
        setSelectedQuestion(question);
    }

    const handleAddGroupeQuestion = () => {
        setSelectedQuestion(null);
    }
    return (
        <>
            <Breadcrumb pageName="Questions" />
            <Table data={questions}  onCreate={handleAddGroupeQuestion} onEdit={handleEditGroupeQuestion}/>

            <FormCreateUpdate question={selectedQuestion}/>
            <FormDelete question={selectedQuestion}/>

        </>
    );
};

export default Questions;
export const rubrique2:Rubrique={
    id:1,
    code:"R2",
    libelle:"Organisation de la formation",
    ordre : 1
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
export const groupeQuestion:GroupeQuestion={
    id:1,
    code:"R2G1",
    libelle:"S'agissant de la programmation des cours, quel est votre degré de satisfaction concernant :",
    displayName:false,
    rubrique:rubrique2,
    ordre:1,
    displayType:"Tableau",
    reponses:reponsesR21,
}
export const questions: Question[] = [
    {
        id:1,
        code:"Q1",
        libelle:"L'emploi du temps est il convenable et respecté ?",
        ordre:1,
        groupeQuestion:groupeQuestion,
    },
    {
        id:2,
        code:"Q2",
        libelle:"Le volume des devoirs à faire à la maison est il convenable ?",
        ordre:2,
        groupeQuestion:groupeQuestion,
    },
    {
        id:3,
        code:"Q3",
        libelle:"Le temps pour les révisions est-il suffisant ?",
        ordre:3,
        groupeQuestion:groupeQuestion,
    },
];
