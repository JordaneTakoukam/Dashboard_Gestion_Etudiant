import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableEvenement/Table";

export interface Evenement{
    nbEvenement:number;
    libelle:string;
    periode:string;
    personnel:string;
    description:string;
}

const CalendrierAcademique = () => {
    return (
        <>
            <Breadcrumb pageName="Calendrier académique" />
            <Table data={listEvenement}/>
        </>
    );
};

export default CalendrierAcademique;
export const listEvenement: Evenement[] = [
    {
        nbEvenement:1,
        libelle:"Acceuil des nouveaux promus",
        periode: "Mardi 27 décembre 2022",
        personnel:"Administration, Nouveaux promus, Corp enseignants",
        description:""
    },
    {
        nbEvenement:2,
        libelle:"Visites médicales en vue de la préparation Militaire Supérieure",
        periode: "Dès le Mercredi 10 Janvier 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        nbEvenement:3,
        libelle:"Préparation Militaire Supérieure",
        periode: "du 14 Janvier au 14 Mars 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        nbEvenement:4,
        libelle:"Visite à mi-parcours de la Préparation Militaire Supérieur",
        periode: "Du 23 au 24 Février 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        nbEvenement:5,
        libelle:"Fin de la PMS",
        periode: "Mardi 14 mars 2023",
        personnel:"Etudiants",
        description:""
    },
    {
        nbEvenement:6,
        libelle:"Trêve post PMS",
        periode: "Du Mercredi 15 mars au vendredi 31 mars 2023",
        personnel:"Etudiants",
        description:""
    },
    
];