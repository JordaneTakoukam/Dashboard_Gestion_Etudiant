import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import { useEffect, useState } from "react";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdateSignaler";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableAbsences/Table";
import { updateUserAbsences } from "../../_redux/features/user_slice";
import { apiGetAbsencesByUserAndFilter } from "../../api/discipline/api_discipline";


const Abscences = () => {
    const {t}=useTranslation();
    const [selectedUser, setSelectedUser] = useState<UserState | null>();
    const dispatch = useDispatch();
    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2024; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;
    const [absences, setAbsences]=useState<AbsenceType[]>([]);
    const handleEditHourUser = (user: UserState | null) => {
        setSelectedUser(user);
    }

    const userRole = useSelector((state: RootState) => state.user.role);
    const currentUser = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    const handleAbsencesChange=(absences:AbsenceType[])=>{
        setAbsences(absences);
        console.log(absences)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const absences = await apiGetAbsencesByUserAndFilter({ userId: currentUser._id, annee: currentYear, semestre: currentSemester });
                console.log("iscall")
                if (absences) {
                    dispatch(updateUserAbsences(absences));
                    setAbsences(absences)
                }else{
                    setAbsences([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // if (currentUser._id) {
            fetchData();
        // }
    }, [dispatch, currentYear, currentSemester, t]);
    
    return (
        <>
            <Breadcrumb pageName={`Abscences ${roles.enseignant === userRole ? "de l'enseignant" : roles.etudiant === userRole ? "" : ""}`} />
            {/* <Breadcrumb pageName={t('menu.absences')} /> */}
            {(userRole===roles.etudiant || userRole===roles.delegue) && <Table data={currentUser} absences={absences} onEdit={handleEditHourUser} handleAbsencesChange={handleAbsencesChange}/>} 
            {userRole===roles.enseignant && <Table data={currentUser} absences={absences} onEdit={handleEditHourUser} handleAbsencesChange={handleAbsencesChange}/>}

            <FormCreateUpdate user={currentUser} isSignaled={true} isHourRemove={false} />
        </>
    );
};

export default Abscences;