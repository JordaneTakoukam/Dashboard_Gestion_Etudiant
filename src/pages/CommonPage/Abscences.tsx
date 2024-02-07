import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import { Etudiant, etudiant, listTest } from "../Admin/ListeEtudiants";
import { Enseignant, enseignant, enseignants } from "../Admin/ListeEnseignants";
import Table from "../../components/Tables/TableAbsences/Table";

export interface Abscences{
    id?:number;
    date:string;
    debutPeriode:string;
    finPeriode:string;
    semestre:number;
}

const Abscences = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return (
        <>
            <Breadcrumb pageName={`Abscences ${roles.teacher === userRole ? "de l'enseignant" : roles.student === userRole ? "" : ""}`} />
            {(userRole===roles.student || userRole===roles.delegate) && <Table data={etudiant}/>}
            {userRole===roles.teacher && <Table data={enseignant}/>}
        </>
    );
};

export default Abscences;
export const absencesEtudiant:Abscences[]=[
    {
        id:1,
        date:"01/01/2023",
        debutPeriode:"07:30",
        finPeriode:"09:30",
        semestre:1,
    },
    {
        id:2,
        date:"10/01/2023",
        debutPeriode:"07:30",
        finPeriode:"09:30",
        semestre:1,
    },
    {
        id:3,
        date:"15/01/2023",
        debutPeriode:"12:30",
        finPeriode:"16:30",
        semestre:1,
    },
    {
        id:4,
        date:"17/02/2023",
        debutPeriode:"10:30",
        finPeriode:"12:30",
        semestre:1,
    },
]
export const absencesEnseignant:Abscences[]=[
    {
        id:1,
        date:"01/01/2023",
        debutPeriode:"07:30",
        finPeriode:"09:30",
        semestre:1,
    },
    {
        id:2,
        date:"10/01/2023",
        debutPeriode:"07:30",
        finPeriode:"09:30",
        semestre:1,
    },
    {
        id:3,
        date:"15/01/2023",
        debutPeriode:"12:30",
        finPeriode:"16:30",
        semestre:1,
    },
    {
        id:4,
        date:"17/02/2023",
        debutPeriode:"10:30",
        finPeriode:"12:30",
        semestre:1,
    },
]
