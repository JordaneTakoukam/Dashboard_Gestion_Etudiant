import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableObjectif/Table";
import FormCreateUpdate from "../../components/Modals/ModalObjectif/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalObjectif/FormDelete";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";




const Objectifs = () => {
    const [selectedObjectif, setSelectedObjectif] = useState<ObjectifType | null>(null);
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);
    const handleEditObejctif = (objectif: ObjectifType) => {
        setSelectedObjectif(objectif);
    }
    const {t}=useTranslation();
    const handleAddObjectif = () => {
        setSelectedObjectif(null);
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedMatiere === undefined) {
            navigate('subjects/subject-list')
        }
    }, [selectedMatiere])
    
    
    return (
        <>
            {/* <Breadcrumb pageName={t('sub_menu.objectifs')} isObjectif={true} isChapitre={false} returnWithChapitre={returnWithChapitre}/>
            <Table data={chapitreSelectionnee?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} chapitre={chapitreSelectionnee} onEditMatiere={onEditMatiere} onEditChapitre={onEditChapitre}/> */}
            <Breadcrumb isObjectif={true} pageName={t('sub_menu.objectifs')}/>
            <Table data={selectedMatiere?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} />

            <FormCreateUpdate objectif={selectedObjectif} matiere={selectedMatiere}/>
            <FormDelete objectif={selectedObjectif}  matiere={selectedMatiere}/>

        </>
    );
};
// interface ObjectifsProps {
//     chapitreSelectionnee?: ChapitreType | null; 
//     matiereCourant?:MatiereType|null;
//     returnWithChapitre?:()=>void;
//     onEditMatiere: (matiere : MatiereType) => void;
//     onEditChapitre: (chapitre : ChapitreType) => void;
// }

// const Objectifs = ({ chapitreSelectionnee, matiereCourant, returnWithChapitre, onEditMatiere, onEditChapitre }: ObjectifsProps) => {
//     const [selectedObjectif, setSelectedObjectif] = useState<ObjectifType | null>(null);
//     const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);
//     const handleEditObejctif = (objectif: ObjectifType) => {
//         setSelectedObjectif(objectif);
//     }
//     const {t}=useTranslation();
//     const handleAddObjectif = () => {
//         setSelectedObjectif(null);
//     }
//     const navigate = useNavigate();
//     useEffect(() => {
//         if (selectedMatiere === undefined) {
//             navigate('/subjects/list-subjects/')
//         }
//     }, [selectedMatiere])
    
    
//     return (
//         <>
//             {/* <Breadcrumb pageName={t('sub_menu.objectifs')} isObjectif={true} isChapitre={false} returnWithChapitre={returnWithChapitre}/>
//             <Table data={chapitreSelectionnee?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} chapitre={chapitreSelectionnee} onEditMatiere={onEditMatiere} onEditChapitre={onEditChapitre}/> */}
//             <Breadcrumb pageName={t('sub_menu.objectifs')}/>
//             <Table data={chapitreSelectionnee?.objectifs}  onCreate={handleAddObjectif} onEdit={handleEditObejctif} onEditMatiere={onEditMatiere} />

//             <FormCreateUpdate objectif={selectedObjectif} chapitre={chapitreSelectionnee} matiere={matiereCourant}/>
//             <FormDelete objectif={selectedObjectif}  chapitre={chapitreSelectionnee} matiere={matiereCourant}/>

//         </>
//     );
// };

export default Objectifs;
