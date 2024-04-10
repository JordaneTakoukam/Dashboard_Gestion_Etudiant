import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import Table from "../../components/Tables/TableEnseignement/Table";
import FormCreateUpdate from "../../components/Modals/ModalEnseignement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalEnseignement/FormDelete";



interface EnseignementsPeriodeProps {
    periodeSelectionnee?: PeriodeEnseignementType | null; 
    returnWithPeriodeEnseignement?:()=>void;
}

const EnseignementsPeriode = ({ periodeSelectionnee, returnWithPeriodeEnseignement }: EnseignementsPeriodeProps) => {
    const [selectedEnseignement, setSelectedEnseignement] = useState<MatiereEnseignement | null>(null);
    const handleEditEnseignement = (chapitre: MatiereEnseignement) => {
        setSelectedEnseignement(chapitre);
    }
    const {t}=useTranslation();
    const handleAddEnseignement = () => {
        setSelectedEnseignement(null);
    }

    
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.enseignement_periode')} isPeriodeEnseignement={true} returnWithPeriodeEnseignement={returnWithPeriodeEnseignement}/>
            <Table data={periodeSelectionnee?.enseignements}  onCreate={handleAddEnseignement} onEdit={handleEditEnseignement} periodeEnseignement={periodeSelectionnee}/>

            <FormCreateUpdate enseignement={selectedEnseignement} periodeEnseignement={periodeSelectionnee}/>
            <FormDelete enseignement={selectedEnseignement}/>

        </>
    );
};

export default EnseignementsPeriode;


