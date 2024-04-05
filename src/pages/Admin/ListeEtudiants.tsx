import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import ModalDeleteEtudiant from "../../components/Modals/ModalEtudiant/DialogDeleteEtudiant";
import TableEtudiant from "../../components/Tables/TablesEtudiants/TableEdudiants";
import { Niveau } from "./Niveaux";
import { Abscences, absencesEtudiant } from "../CommonPage/Abscences";
import { Grade } from "./Grades";
import { Categorie } from "./Categories";
import { Commune } from "./Communes";
import { useTranslation } from "react-i18next";

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
    region?:CommonSettingProps;
    commune?:Commune;
    dateEntreeAdmin?:string;
    abscences:Abscences[];
}




const ListeDesEtudiants = () => {
    const {t}=useTranslation();
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
            <Breadcrumb pageName={t('sub_menu.liste_etudiant')} />
            <TableEtudiant data={listTest} onCreate={handleAddEtudiant} onEdit={handleEditEtudiant} />

            {/* Boite de dialogue */}
            {/* <ModalCreateEtudiant etudiant={selectedEtudiant} />  */}
            <ModalDeleteEtudiant etudiant={selectedEtudiant}/>{/*Supprimer un étudiant */}
        </>
    );
};

export default ListeDesEtudiants;

export const etudiant:Etudiant={
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
            
        },
    },
    
    abscences:absencesEtudiant,
}

export const listTest: Etudiant[] = [];


