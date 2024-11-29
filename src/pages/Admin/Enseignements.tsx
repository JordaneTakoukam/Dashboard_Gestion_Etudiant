import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableEnseignementMatiere/Table";
import FormCreateUpdate from "../../components/Modals/ModalEnseignementMatiere/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEnseignementMatiere/FormDelete";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";


const Enseignements = () => {
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);
    const [selectedEnseignement, setSelectedEnseignement] = useState<string | null>(null);
    const handleEditEnseignement = (enseignement: string) => {
        setSelectedEnseignement(enseignement);
    }
    const {t}=useTranslation();
    const handleAddEnseignement = () => {
        setSelectedEnseignement(null);
    }

    const navigate = useNavigate();
    useEffect(() => {
        if (selectedMatiere === undefined) {
            navigate('/subjects/subject-list')
        }
    }, [selectedMatiere])
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.type_ens')} isEnseignement={true} />
            <Table data={selectedMatiere?.typesEnseignement}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement} />

            <FormCreateUpdate enseignement={selectedEnseignement} matiere={selectedMatiere}/>
            <FormDelete enseignement={selectedEnseignement} matiere={selectedMatiere}/>

        </>
    );
};

export default Enseignements;


// interface EnseignementsProps {
//     matiereSelectionnee?: MatiereType | null; 
//     onEditMatiere: (matiere : MatiereType) => void;
//     returnWithMatiere?:()=>void;
// }

// const Enseignements = ({ matiereSelectionnee, returnWithMatiere, onEditMatiere }: EnseignementsProps) => {
//     const [selectedEnseignement, setSelectedEnseignement] = useState<EnseignementType | null>(null);
//     const handleEditEnseignement = (enseignement: EnseignementType) => {
//         setSelectedEnseignement(enseignement);
//     }
//     const {t}=useTranslation();
//     const handleAddEnseignement = () => {
//         setSelectedEnseignement(null);
//     }

    
    
//     return (
//         <>
//             <Breadcrumb pageName={t('sub_menu.enseignements')} isEnseignement={true} returnWithMatiere={returnWithMatiere}/>
//             <Table data={matiereSelectionnee?.typesEnseignement}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement} matiere={matiereSelectionnee} onEditMatiere={onEditMatiere}/>

//             <FormCreateUpdate enseignement={selectedEnseignement} matiere={matiereSelectionnee}/>
//             <FormDelete enseignement={selectedEnseignement} matiere={matiereSelectionnee}/>

//         </>
//     );
// };

// export default Enseignements;

