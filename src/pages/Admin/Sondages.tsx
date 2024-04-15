import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableSondage/Table";
import { Niveau } from "./Niveaux";
import FormCreateUpdate from "../../components/Modals/ModalSondage/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSondage/FormDelete";
import { Rubrique } from "./Rubriques";
import { Matiere } from "./ListeMatieres";
import { Cycle } from "./Cycles";
import FormSondage from "../../components/Modals/ModalSondage/FormSondage";

export interface Sondage {
    id? : number;
    code: string;
    libelle: string;
    cycle: Cycle;
    rubriques : Rubrique[];
    matiere:Matiere;
}




const ListeDesSondages = () => {
    const [selectedSondage, setSelectedSondage] = useState<Sondage | null>(null);
    const handleEditSondage = (sondage : Sondage) => {
        setSelectedSondage(sondage);
    }

    const handletoDoSondage = (sondage : Sondage) => {
        setSelectedSondage(sondage);
    }


    const handleAddSondage = () => {
        console.log("is call");
        setSelectedSondage(null);
    }

    const handleOpenRubriques = (sondage: Sondage) => {
        setSelectedSondage(sondage);
    };
    return (
        <>
            <Breadcrumb pageName="Liste des matières" />
            {/* <Table data={sondages} onCreate={handleAddSondage} onEdit={handleEditSondage} toDo={handletoDoSondage} /> */}
            
            {/* <FormCreateUpdate sondage={selectedSondage}/> */}
            <FormSondage sondage={selectedSondage}/>
            <FormDelete sondage={selectedSondage}/>
        </>
    );
};

export default ListeDesSondages;




