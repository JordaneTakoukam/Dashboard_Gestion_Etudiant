import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import { Etudiant, etudiant, listTest } from "../Admin/ListeEtudiants";
import { Enseignant, enseignant, enseignants } from "../Admin/ListeEnseignants";
import Table from "../../components/Tables/TableAbsences/Table";
import { useState } from "react";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdate";
import { useTranslation } from "react-i18next";

export interface Abscences{
    id?:number;
    date:string;
    debutPeriode:string;
    finPeriode:string;
    semestre:number;
}


const Abscences = () => {
    const {t}=useTranslation();
    const [selectedUser, setSelectedUser] = useState<Etudiant | Enseignant | null>(null);
    const handleEditHourUser = (user: Etudiant | Enseignant | null) => {
        setSelectedUser(user);
    }
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return (
        <>
            {/* <Breadcrumb pageName={`Abscences ${roles.teacher === userRole ? "de l'enseignant" : roles.student === userRole ? "" : ""}`} /> */}
            <Breadcrumb pageName={t('menu.absences')} />
            {(userRole===roles.etudiant || userRole===roles.delegue) && <Table data={etudiant} onEdit={handleEditHourUser}/>}
            {userRole===roles.enseignant && <Table data={enseignant} onEdit={handleEditHourUser}/>}

            <FormCreateUpdate user={selectedUser} isSignaled={true} isHourRemove={false} /> 
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
