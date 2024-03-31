import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalChapitre/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalChapitre/FormDelete";
import Table from "../../components/Tables/TableChapitre/Table";
import { Matiere } from "./ListeMatieres";
import { useTranslation } from "react-i18next";

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
    typesEnseignement:TypeEnseignement[];
    competences?:Competence[];
}

export interface TypeEnseignement{
    id?:number;
    code:string;
    libelle:string;
    volumeHoraire?: number;
}

export interface Competence{
    id?:number;
    code:string;
    libelle:string;
}

interface ChapitresProps {
    matiereSelectionnee?: MatiereType | null; 
    returnWithMatiere?:()=>void;
}

const Chapitres = ({ matiereSelectionnee, returnWithMatiere }: ChapitresProps) => {
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);
    const handleEditCycle = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
    }
    const {t}=useTranslation();
    const handleAddChapitre = () => {
        setSelectedChapitre(null);
    }

    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.chapitres')} isMatiere={true} returnWithMatiere={returnWithMatiere}/>
            <Table data={matiereSelectionnee?.chapitres}  onCreate={handleAddChapitre} onEdit={handleEditCycle} matiere={matiereSelectionnee}/>

            <FormCreateUpdate chapitre={selectedChapitre}/>
            <FormDelete chapitre={selectedChapitre}/>

        </>
    );
};

export default Chapitres;
export const cm:TypeEnseignement={id:1, code:"CM", libelle:"Cours magistral", volumeHoraire:0};
export const td:TypeEnseignement={id:2, code:"TD", libelle:"Travaux dirigés", volumeHoraire:0};
export const tp:TypeEnseignement={id:3, code:"TP", libelle:"Travaux pratiques", volumeHoraire:0};
export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

