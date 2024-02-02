import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableMatiere/Table";

export interface Matiere {
    code: string;
    libelle: string;
    objectifPedagogique: string;
    prerequis: string;
    evaluationDesAcquis: string;
    niveau: string;
    approchePedagogique: string;
    nbChapitre: number;
    volumeHoraire: number;
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
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG2",
        libelle: "Elaboration du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG3",
        libelle: "Management des organisations publiques",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 6,
        volumeHoraire:30,
    },
    {
        code: "CG4",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG5",
        libelle: "Elaboration du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG6",
        libelle: "Management des organisations publiques",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 6,
        volumeHoraire:30,
    },
    {
        code: "CG7",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG8",
        libelle: "Elaboration du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    },
    {
        code: "CG9",
        libelle: "Management des organisations publiques",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 6,
        volumeHoraire:30,
    },
    {
        code: "CG10",
        libelle: "Elaboration, exécution et contrôle du budget de l'Etat",
        objectifPedagogique: "",
        prerequis: "",
        evaluationDesAcquis: "Contrôle continu, Examen écrit",
        niveau: "1ère année",
        approchePedagogique: "APC",
        nbChapitre: 4,
        volumeHoraire:20,
    }
];
