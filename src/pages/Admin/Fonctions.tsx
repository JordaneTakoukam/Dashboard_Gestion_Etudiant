import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableFonction/Table";
import FormCreateUpdate from "../../components/Modals/ModalFonction/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalFonction/FormDelete";

export interface Fonction{
    id?:number;
    code:string;
    libelle:string;
}

const Fonctions = () => {
    const [selectedFonction, setSelectedFonction] = useState<Fonction | null>(null);
    const handleEditFonction = (fonction : Fonction) => {
        setSelectedFonction(fonction);
    }

    const handleAddFonction = () => {
        setSelectedFonction(null);
    }
    return (
        <>
            <Breadcrumb pageName="Fonctions" />
            <Table data={fonctions} onCreate={handleAddFonction} onEdit={handleEditFonction}/>

            <FormCreateUpdate fonction={selectedFonction}/>
            <FormDelete fonction={selectedFonction}/>

        </>
    );
};


export default Fonctions;
export const fonctions : Fonction[]=[];