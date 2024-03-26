import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCategorie/Table";
import FormCreateUpdate from "../../components/Modals/ModalCategorie/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCategorie/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface Categorie{
    id?:number;
    code:string;
    libelle:string;
}

const Categories = () => {
    const [selectedCategorie, setSelectedCategorie] = useState<CommonSettingProps | null>(null);
    const { t } = useTranslation();
    const handleEditCategorie = (categorie : CommonSettingProps) => {
        setSelectedCategorie(categorie);
    }
    const categories = useSelector((state: RootState) => state.dataSetting.dataSetting.categories);
    const handleAddCategorie = () => {
        setSelectedCategorie(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.categories')} />
            <Table data={categories} onCreate={handleAddCategorie} onEdit={handleEditCategorie}/>

            <FormCreateUpdate categorie={selectedCategorie}/>
            <FormDelete categorie={selectedCategorie}/>

        </>
    );
};

export default Categories;
