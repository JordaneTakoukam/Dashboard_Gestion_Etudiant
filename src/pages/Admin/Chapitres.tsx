import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalChapitre/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalChapitre/FormDelete";
import Table from "../../components/Tables/TableChapitre/Table";
import { Matiere } from "./ListeMatieres";
import { useTranslation } from "react-i18next";



interface ChapitresProps {
    matiereSelectionnee?: MatiereType | null; 
    returnWithMatiere?:()=>void;
    
}

const Chapitres = ({ matiereSelectionnee, returnWithMatiere }: ChapitresProps) => {
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);
    const [matiereChapitres, setMatiereChapitres] = useState<ChapitreType[]>([]); // État pour les chapitres de la matière
    const handleEditCycle = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
    }
    const {t}=useTranslation();
    const handleAddChapitre = () => {
        setSelectedChapitre(null);
    }

   
    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.chapitres')} isMatiere={true} returnWithMatiere={returnWithMatiere}/>
            <Table data={matiereSelectionnee?.chapitres}  onCreate={handleAddChapitre} onEdit={handleEditCycle} matiere={matiereSelectionnee}/>

            <FormCreateUpdate chapitre={selectedChapitre} matiere={matiereSelectionnee}/>
            <FormDelete chapitre={selectedChapitre}  matiere={matiereSelectionnee}/>

        </>
    );
};

export default Chapitres;

// export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

