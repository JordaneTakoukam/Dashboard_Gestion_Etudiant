import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableEmploieDeTemps/Table";
import { Matiere } from "../Admin/ListeMatieres";

export interface PeriodeCours{
    jour:number;
    heureDebut:string;
    heureFin:string;
    salle:string;
    enseignant:string;
    enseignantSup:string;
    matiere:Matiere;
    typeUE:string;
    semestre:number;
    niveau:string;
    annee:number;
}

const EmploiDeTemp = () => {
  
    return (
        <>
            <Breadcrumb pageName={`Emplois de temps`} />
            <Table data={listPeriode}/>


        </>
    );
};

export default EmploiDeTemp;
export const listPeriode:PeriodeCours[]=[
    {
        jour:1,
        heureDebut:"07h00",
        heureFin:"09h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG3",
                libelle:"Management des organisations publiques",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 6,
                volumeHoraire:30,
                },
        typeUE:"CM",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:1,
        heureDebut:"10h05",
        heureFin:"12h55",
        salle:"S02",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG3",
                libelle:"Management des organisations publiques",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 6,
                volumeHoraire:30,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:2,
        heureDebut:"13h05",
        heureFin:"15h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"CM",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:3,
        heureDebut:"16h05",
        heureFin:"18h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:4,
        heureDebut:"07h05",
        heureFin:"09h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:5,
        heureDebut:"13h05",
        heureFin:"15h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:5,
        heureDebut:"10h05",
        heureFin:"13h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:6,
        heureDebut:"13h05",
        heureFin:"15h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    },
    {
        jour:7,
        heureDebut:"10h05",
        heureFin:"13h55",
        salle:"S01",
        enseignant:"Arnold Julio",
        enseignantSup:"Anderson Enrick",
        matiere:{code:"CG1",
                libelle:"Elaboration, exécution et contrôle du budget de l'Etat",
                objectifPedagogique: "",
                prerequis: "",
                evaluationDesAcquis: "Contrôle continu, Examen écrit",
                niveau: "1ère année",
                approchePedagogique: "APC",
                nbChapitre: 4,
                volumeHoraire:20,
                },
        typeUE:"TP",
        semestre:1,
        niveau:"1ère année",
        annee:2022
    }

];
