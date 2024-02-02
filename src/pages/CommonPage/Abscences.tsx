import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import Table from "../../components/Tables/TableAbsences/Table";

export interface Abscences{
    dateAbs:string;
    debutPeriode:string;
    finPeriode:string;
    totalAbscences:number;
}

const Abscences = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return (
        <>
            <Breadcrumb pageName={`Abscences ${roles.teacher === userRole ? "de l'enseignant" : roles.student === userRole ? "" : ""}`} />
            <Table data={listAbsence}/>
        </>
    );
};

export default Abscences;
export const listAbsence:Abscences[]=[
    {
        dateAbs:"01/01/2023",
        debutPeriode:"7h30",
        finPeriode:"9h30",
        totalAbscences:2
    },
    {
        dateAbs:"10/01/2023",
        debutPeriode:"7h30",
        finPeriode:"9h30",
        totalAbscences:2
    },
    {
        dateAbs:"15/01/2023",
        debutPeriode:"12h30",
        finPeriode:"16h30",
        totalAbscences:4
    },
    {
        dateAbs:"17/02/2023",
        debutPeriode:"10h30",
        finPeriode:"12h30",
        totalAbscences:2
    },
]
