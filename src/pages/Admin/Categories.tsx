import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCategorie/Table";
import FormCreateUpdate from "../../components/Modals/ModalCategorie/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCategorie/FormDelete";

export interface Categorie{
    id?:number;
    code:string;
    libelle:string;
}

const Categories = () => {
    const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
    const handleEditCategorie = (categorie : Categorie) => {
        setSelectedCategorie(categorie);
    }

    const handleAddCategorie = () => {
        setSelectedCategorie(null);
    }
    return (
        <>
            <Breadcrumb pageName="Catégories" />
            <Table data={categories} onCreate={handleAddCategorie} onEdit={handleEditCategorie}/>

            <FormCreateUpdate categorie={selectedCategorie}/>
            <FormDelete categorie={selectedCategorie}/>

        </>
    );
};

export default Categories;
export const categories: Categorie[] = [
    {
        id:1,
        code:"C1",
        libelle:"1",
    },
    {
        id:2,
        code:"C2",
        libelle:"2",
    },
    {
        id:3,
        code:"C3",
        libelle:"3",
    },
];
