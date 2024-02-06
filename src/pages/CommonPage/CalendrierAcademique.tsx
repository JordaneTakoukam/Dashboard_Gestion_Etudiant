import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCalendrier/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCalendrier/FormDelete";
import Table from "../../components/Tables/TableEvenement/Table";

export interface Evenement{
    id?:number;
    numEvenement:number;
    libelle:string;
    periode:string;
    personnel?:string;
    description?:string;
}

const CalendrierAcademique = () => {
    const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(null);
    const handleEditSection = (evenement : Evenement) => {
        setSelectedEvenement(evenement);
    }

    const handleAddSection = () => {
        setSelectedEvenement(null);
    }
    return (
        <>
            <Breadcrumb pageName="Calendrier académique" />
            <Table data={evenements} onCreate={handleAddSection} onEdit={handleEditSection}/>

            <FormCreateUpdate evenement={selectedEvenement}/>
            <FormDelete evenement={selectedEvenement}/>
        </>
    );
};

export default CalendrierAcademique;
export const evenements: Evenement[] = [
    {
        id:1,
        numEvenement:1,
        libelle:"Acceuil des nouveaux promus",
        periode: "Mardi 27 décembre 2022",
        personnel:"Administration, Nouveaux promus, Corp enseignants",
        description:""
    },
    {
        id:2,
        numEvenement:2,
        libelle:"Visites médicales en vue de la préparation Militaire Supérieure",
        periode: "Dès le Mercredi 10 Janvier 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        id:3,
        numEvenement:3,
        libelle:"Préparation Militaire Supérieure",
        periode: "du 14 Janvier au 14 Mars 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        id:4,
        numEvenement:4,
        libelle:"Visite à mi-parcours de la Préparation Militaire Supérieur",
        periode: "Du 23 au 24 Février 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        id:5,
        numEvenement:5,
        libelle:"Fin de la PMS",
        periode: "Mardi 14 mars 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        id:6,
        numEvenement:6,
        libelle:"Trêve post PMS",
        periode: "Du Mercredi 15 mars au vendredi 31 mars 2023",
        personnel:"Etudiants",
        description:""
    },
    
];