import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import { useState } from "react";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdateSignaler";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableAbsences/Table";

export interface Abscences{
    id?:number;
    date:string;
    debutPeriode:string;
    finPeriode:string;
    semestre:number;
}


const Abscences = () => {
    const {t}=useTranslation();
    const [selectedUser, setSelectedUser] = useState<UserState | null>();

    const handleEditHourUser = (user: UserState | null) => {
        setSelectedUser(user);
    }

    const userRole = useSelector((state: RootState) => state.user.role);
    const currentUser = useSelector((state: RootState) => state.user);
    const roles = config.roles;

    
    return (
        <>
            <Breadcrumb pageName={`Abscences ${roles.enseignant === userRole ? "de l'enseignant" : roles.etudiant === userRole ? "" : ""}`} />
            {/* <Breadcrumb pageName={t('menu.absences')} /> */}
            {(userRole===roles.etudiant || userRole===roles.delegue) && <Table data={currentUser.absences} onEdit={handleEditHourUser}/>} 
            {userRole===roles.enseignant && <Table data={currentUser.absences} onEdit={handleEditHourUser}/>}

            <FormCreateUpdate user={currentUser} isSignaled={true} isHourRemove={false} />
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
