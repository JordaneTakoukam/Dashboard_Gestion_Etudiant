import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";
import TableDisciplineEtudiant from "../../components/Tables/TablesDisciplineEtudiants/TableDisciplineEdudiants";
import { useState } from "react";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdate";
import { Enseignant } from "./ListeEnseignants";
import { useTranslation } from "react-i18next";


const DisciplineEtudiants = () => {
    const {t}=useTranslation();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [selectedEtudiant, setSelectedEtudiant] = useState<EtudiantType | Enseignant | null>(null);
    const [isHourRemove, setHourRemove] = useState(false);
    const handleEditHourEtudiant = (etudiant: EtudiantType, remove:boolean) => {
        setSelectedEtudiant(etudiant);
        setHourRemove(remove);
    }

    
    return (
        <>
            {/* <Breadcrumb pageName={`Disciplines ${roles.teacher === userRole ? "des étudiants" : roles.student === userRole ? "" : ""}`} /> */}
            <Breadcrumb pageName={t('sub_menu.discipline')} />
            {/* <TableDisciplineEtudiant data={listTest} onEdit={handleEditHourEtudiant}/> */}


            {/* Boite de dialogue */}
            <FormCreateUpdate user={selectedEtudiant} isHourRemove={isHourRemove} /> 
            
        </>
    );
};

export default DisciplineEtudiants;