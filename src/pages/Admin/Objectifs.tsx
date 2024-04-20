import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableObjectif/Table";
import FormCreateUpdate from "../../components/Modals/ModalObjectif/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalObjectif/FormDelete";



interface ObjectifsProps {
    chapitreSelectionnee?: ChapitreType | null; 
    returnWithChapitre?:()=>void;
    
}

const Objectifs = ({ chapitreSelectionnee, returnWithChapitre }: ObjectifsProps) => {
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
            <Table data={chapitreSelectionnee?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} chapitre={chapitreSelectionnee}/>

            <FormCreateUpdate objectif={selectedObjectif} chapitre={chapitreSelectionnee}/>
            <FormDelete objectif={selectedObjectif}  chapitre={chapitreSelectionnee}/>

        </>
    );
};

export default Objectifs;

// export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

