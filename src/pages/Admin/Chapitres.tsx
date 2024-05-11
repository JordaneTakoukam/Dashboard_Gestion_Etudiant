import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalChapitre/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalChapitre/FormDelete";
import Table from "../../components/Tables/TableChapitre/Table";
import { useTranslation } from "react-i18next";
import Objectifs from "./Objectifs";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";



interface ChapitresProps {
    matiereSelectionnee?: MatiereType | null; 
    onEditMatiere?: (matiere : MatiereType) => void;
    returnWithMatiere?:()=>void;
    
}

const Chapitres = ({ matiereSelectionnee, returnWithMatiere, onEditMatiere }: ChapitresProps) => {
    const [selectedChapitre, setSelectedChapitre] = useState<ChapitreType | null>(null);
    const [matiereChapitres, setMatiereChapitres] = useState<ChapitreType[]>([]); // État pour les chapitres de la matière
    const [openObjectifs, setOpenObjectifs] = useState(false);
    const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    const handleEditChapitre = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
        setOpenObjectifs(false);
    }
    const handleUpdateChapitre = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
    }
    const {t}=useTranslation();
    const handleAddChapitre = () => {
        setSelectedChapitre(null);
        setOpenObjectifs(false);
    }

    const handleOpenObjectifs = (chapitre: ChapitreType) => {
        setSelectedChapitre(chapitre);
        setOpenObjectifs(true);
    };


    
    
    
    return (
        <>
            {!openObjectifs && <Breadcrumb pageName={t('sub_menu.chapitres')} isChapitre={true} isObjectif={false} returnWithMatiere={returnWithMatiere}/>}
            {!openObjectifs && <Table data={matiereSelectionnee?.chapitres}  onCreate={handleAddChapitre} onEdit={handleEditChapitre} onAddObj={handleOpenObjectifs} matiere={matiereSelectionnee} onEditMatiere={onEditMatiere}/>}

            {!openObjectifs && <FormCreateUpdate chapitre={selectedChapitre} matiere={matiereSelectionnee}/>}
            {!openObjectifs && <FormDelete chapitre={selectedChapitre}  matiere={matiereSelectionnee}/>}
            {/* {openObjectifs && <Objectifs chapitreSelectionnee={selectedChapitre} returnWithChapitre={handleAddChapitre} onEditMatiere={onEditMatiere} onEditChapitre={handleUpdateChapitre} matiereCourant={matiereSelectionnee}/>} */}

        </>
    );
};

export default Chapitres;

// export const typesEnseignement:TypeEnseignement[]=[cm, td, tp];

