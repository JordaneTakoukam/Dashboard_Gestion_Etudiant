import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableFonction/Table";
import FormCreateUpdate from "../../components/Modals/ModalFonction/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalFonction/FormDelete";
import { useTranslation } from "react-i18next";

export interface Fonction{
    id?:number;
    code:string;
    libelle:string;
}

const Fonctions = () => {
    const {t}=useTranslation();
    const [selectedFonction, setSelectedFonction] = useState<Fonction | null>(null);
    const handleEditFonction = (fonction : Fonction) => {
        setSelectedFonction(fonction);
    }

    const handleAddFonction = () => {
        setSelectedFonction(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.fonctions')} />
            <Table data={fonctions} onCreate={handleAddFonction} onEdit={handleEditFonction}/>

            <FormCreateUpdate fonction={selectedFonction}/>
            <FormDelete fonction={selectedFonction}/>

        </>
    );
};


export default Fonctions;
export const fonctions : Fonction[]=[];