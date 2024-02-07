import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TablesDisciplineEnseignants/Table";
import { Enseignant, enseignants } from "./ListeEnseignants";
import { Etudiant } from "./ListeEtudiants";
import FormCreateUpdate from "../../components/Modals/ModalAbsence/FormCreateUpdate";


const DisciplineDesEnseignants = () => {
    const [selectedEnseignant, setSelectedEnseignant] = useState<Etudiant | Enseignant | null>(null);
    const [isHourRemove, setHourRemove] = useState(false);
    const handleEditHourEnseignant = (enseignant:Enseignant, isHourRemove:boolean) => {
        console.log("handleEditHour");
        setSelectedEnseignant(enseignant);
        setHourRemove(isHourRemove);
    }
    

    
    return (
        <>
            <Breadcrumb pageName="Discipline des enseignants" />
            <Table data={enseignants} onEdit={handleEditHourEnseignant}/>

            {/* Boite de dialogue */}
            <FormCreateUpdate user={selectedEnseignant} isHourRemove={isHourRemove} /> 
        </>
    );
};

export default DisciplineDesEnseignants;
