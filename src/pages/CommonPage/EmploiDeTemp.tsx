import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableEmploieDeTemps/Table";
import { Matiere, TypeEnseignement, cm, matieres, td, tp } from "../Admin/ListeMatieres";
import {niveau } from "../Admin/Niveaux";
import { SalleCours, sallesCours } from "../Admin/SallesDeCours";
import FormCreateUpdate from "../../components/Modals/ModalEmploiTemps/FormCreateUpdate";

export interface PeriodeCours{
    id?:number;
    jour:Jour;
    heureDebut:string;
    heureFin:string;
    salle:SalleCours;
    matiere:Matiere;
    typeUE:TypeEnseignement;
    semestre:number;
    annee:number;
}

export interface Jour{
    ordre:number;
    libelle:string;
}

const EmploiDeTemp = () => {
    const [selectedPeriode, setSelectedPeriode] = useState<PeriodeCours | null>(null);
    const handleEditPeriode = (periode : PeriodeCours) => {
        setSelectedPeriode(periode);
    }

    const handleAddPeriode = () => {
        setSelectedPeriode(null);
    }
  
    return (
        <>
            <Breadcrumb pageName={`Emplois de temps`} />
            <Table data={listPeriode} onCreate={handleAddPeriode} onEdit={handleEditPeriode}/>
            <FormCreateUpdate periodecours={selectedPeriode}/>

        </>
    );
};

export default EmploiDeTemp;
export const semestres = [1, 2];
export const lundi:Jour={ordre:1,libelle:"Lundi"}
export const mardi:Jour={ordre:2,libelle:"Mardi"}
export const mercredi:Jour={ordre:3,libelle:"Mercredi"}
export const jeudi:Jour={ordre:4,libelle:"Jeudi"}
export const vendredi:Jour={ordre:5,libelle:"Vendredi"}
export const samedi:Jour={ordre:6,libelle:"Samedi"}
export const dimanche:Jour={ordre:7,libelle:"Dimanche"}
export const jours:Jour[]=[lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche];
export const listPeriode:PeriodeCours[]=[
    {
        id:1,
        jour:lundi,
        heureDebut:"07:00",
        heureFin:"09:55",
        salle:sallesCours[0],
        matiere:matieres[0],
        typeUE:cm,
        semestre:1,
        annee:2022
    },
    {
        id:2,
        jour:lundi,
        heureDebut:"10:05",
        heureFin:"12:55",
        salle:sallesCours[1],
        matiere:matieres[1],
        typeUE:tp,
        semestre:1,
        annee:2022
    },
    {
        id:3,
        jour:mardi,
        heureDebut:"13:05",
        heureFin:"15:55",
        salle:sallesCours[0],
        matiere:matieres[2],
        typeUE:cm,
        semestre:1,
        annee:2022
    },
    {
        id:4,
        jour:mercredi,
        heureDebut:"16:05",
        heureFin:"18:55",
        salle:sallesCours[0],
        matiere:matieres[3],
        typeUE:td,
        semestre:1,
        annee:2022
    },
    {
        id:5,
        jour:jeudi,
        heureDebut:"07:05",
        heureFin:"09:55",
        salle:sallesCours[0],
        matiere:matieres[3],
        typeUE:tp,
        semestre:1,
        annee:2022
    },
    {
        id:6,
        jour:vendredi,
        heureDebut:"13:05",
        heureFin:"15:55",
        salle:sallesCours[0],
        matiere:matieres[0],
        typeUE:tp,
        semestre:1,
        annee:2022
    },
    {
        id:7,
        jour:samedi,
        heureDebut:"10:05",
        heureFin:"13:55",
        salle:sallesCours[3],
        matiere:matieres[1],
        typeUE:tp,
        semestre:1,
        annee:2022
    },
    {
        id:8,
        jour:vendredi,
        heureDebut:"13:05",
        heureFin:"15:55",
        salle:sallesCours[1],
        matiere:matieres[2],
        typeUE:td,
        semestre:1,
        annee:2022
    },
    {
        id:9,
        jour:dimanche,
        heureDebut:"10:05",
        heureFin:"13:55",
        salle:sallesCours[0],
        matiere:matieres[3],
        typeUE:td,
        semestre:1,
        annee:2022
    }

];
