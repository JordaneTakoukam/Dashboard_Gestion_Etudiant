import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalNiveau/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalNiveau/FormDelete";
import Table from "../../components/Tables/TableNiveau/Table";
import { Cycle } from "./Cycles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface Niveau{
    id?:number;
    code:string;
    libelle:string;
    cycle: Cycle;
}

const Niveaux = () => {
    const {t}=useTranslation();
    const [selectedNiveau, setSelectedNiveau] = useState<NiveauProps | null>(null);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveau);
    const handleEditNiveau = (niveau: NiveauProps) => {
        setSelectedNiveau(niveau);
    }

    const handleAddNiveau = () => {
        setSelectedNiveau(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.niveaux')} />
            <Table data={niveaux}  onCreate={handleAddNiveau} onEdit={handleEditNiveau}/>

            <FormCreateUpdate niveau={selectedNiveau}/>
            <FormDelete niveau={selectedNiveau}/>

        </>
    );
};

export default Niveaux;
export const niveau:Niveau={
    id:1,
    code:"N1",
    libelle:"1ère année",
    cycle:{
        id:1,
        code:"CA",
        libelle:"Cycle A",
        
    },
}
export const niveaux: Niveau[] = [];
