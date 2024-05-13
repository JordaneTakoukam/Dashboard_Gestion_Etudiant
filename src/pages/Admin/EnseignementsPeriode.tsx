import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableEnseignement/Table";
import FormCreateUpdate from "../../components/Modals/ModalEnseignement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEnseignement/FormDelete";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useNavigate } from "react-router-dom";


const EnseignementsPeriode = () => {
    const [selectedEnseignement, setSelectedEnseignement] = useState<MatiereEnseignement | null>(null);
    const selectedPeriode = useSelector((state: RootState) => state.periodeEnseignementSlice.selectedPeriode);
    const handleEditEnseignement = (enseignement: MatiereEnseignement) => {
        setSelectedEnseignement(enseignement);
    }
    const {t}=useTranslation();
    const handleAddEnseignement = () => {
        setSelectedEnseignement(null);
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedPeriode === undefined) {
            navigate('/subjects/periodes_enseignement')
        }
    }, [selectedPeriode])
    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.enseignement_periode')} isPeriodeEnseignement={true}/>
            <Table data={selectedPeriode?.enseignements}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement}/>

            <FormCreateUpdate enseignement={selectedEnseignement} periodeEnseignement={selectedPeriode}/>
            <FormDelete enseignement={selectedEnseignement} periodeEnseignement={selectedPeriode}/>

        </>
    );
};

export default EnseignementsPeriode;


// interface EnseignementsPeriodeProps {
//     periodeSelectionnee?: PeriodeEnseignementType | null; 
//     returnWithPeriodeEnseignement?:()=>void;
//     onEditPeriode: (periodeEnseignement : PeriodeEnseignementType) => void;
// }

// const EnseignementsPeriode = ({ periodeSelectionnee, returnWithPeriodeEnseignement, onEditPeriode }: EnseignementsPeriodeProps) => {
//     const [selectedEnseignement, setSelectedEnseignement] = useState<MatiereEnseignement | null>(null);
//     const handleEditEnseignement = (enseignement: MatiereEnseignement) => {
//         setSelectedEnseignement(enseignement);
//     }
//     const {t}=useTranslation();
//     const handleAddEnseignement = () => {
//         setSelectedEnseignement(null);
//     }

    
    
//     return (
//         <>
//             <Breadcrumb pageName={t('sub_menu.enseignement_periode')} isPeriodeEnseignement={true} returnWithPeriodeEnseignement={returnWithPeriodeEnseignement}/>
//             <Table data={periodeSelectionnee?.enseignements}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement} periodeEnseignement={periodeSelectionnee} onEditPeriode={onEditPeriode}/>

//             <FormCreateUpdate enseignement={selectedEnseignement} periodeEnseignement={periodeSelectionnee}/>
//             <FormDelete enseignement={selectedEnseignement} periodeEnseignement={periodeSelectionnee}/>

//         </>
//     );
// };

// export default EnseignementsPeriode;


