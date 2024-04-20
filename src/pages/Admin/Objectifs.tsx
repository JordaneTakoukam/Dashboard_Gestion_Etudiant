import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableObjectif/Table";
import FormCreateUpdate from "../../components/Modals/ModalObjectif/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalObjectif/FormDelete";



interface ObjectifsProps {
    chapitreSelectionnee?: ChapitreType | null; 
    matiereCourant?:MatiereType|null;
    returnWithChapitre?:()=>void;
    onEditMatiere: (matiere : MatiereType) => void;
    onEditChapitre: (chapitre : ChapitreType) => void;
}

const Objectifs = ({ chapitreSelectionnee, matiereCourant, returnWithChapitre, onEditMatiere, onEditChapitre }: ObjectifsProps) => {
    const [selectedObjectif, setSelectedObjectif] = useState<ObjectifType | null>(null);
    const handleEditObejctif = (objectif: ObjectifType) => {
        setSelectedObjectif(objectif);
    }
    const {t}=useTranslation();
    const handleAddObjectif = () => {
        setSelectedObjectif(null);
    }

   
    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.objectifs')} isObjectif={true} isChapitre={false} returnWithChapitre={returnWithChapitre}/>
            <Table data={chapitreSelectionnee?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} chapitre={chapitreSelectionnee} onEditMatiere={onEditMatiere} onEditChapitre={onEditChapitre}/>

            <FormCreateUpdate objectif={selectedObjectif} chapitre={chapitreSelectionnee} matiere={matiereCourant}/>
            <FormDelete objectif={selectedObjectif}  chapitre={chapitreSelectionnee} matiere={matiereCourant}/>

        </>
    );
};

export default Objectifs;

// export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

