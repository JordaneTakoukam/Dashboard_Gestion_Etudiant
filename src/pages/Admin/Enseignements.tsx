import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableEnseignementMatiere/Table";
import FormCreateUpdate from "../../components/Modals/ModalEnseignementMatiere/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEnseignementMatiere/FormDelete";


interface EnseignementsProps {
    matiereSelectionnee?: MatiereType | null; 
    onEditMatiere: (matiere : MatiereType) => void;
    returnWithMatiere?:()=>void;
}

const Enseignements = ({ matiereSelectionnee, returnWithMatiere, onEditMatiere }: EnseignementsProps) => {
    const [selectedEnseignement, setSelectedEnseignement] = useState<EnseignementType | null>(null);
    const handleEditEnseignement = (enseignement: EnseignementType) => {
        setSelectedEnseignement(enseignement);
    }
    const {t}=useTranslation();
    const handleAddEnseignement = () => {
        setSelectedEnseignement(null);
    }

    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.enseignements')} isEnseignement={true} returnWithMatiere={returnWithMatiere}/>
            <Table data={matiereSelectionnee?.typesEnseignement}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement} matiere={matiereSelectionnee} onEditMatiere={onEditMatiere}/>

            <FormCreateUpdate enseignement={selectedEnseignement} matiere={matiereSelectionnee}/>
            <FormDelete enseignement={selectedEnseignement} matiere={matiereSelectionnee}/>

        </>
    );
};

export default Enseignements;

