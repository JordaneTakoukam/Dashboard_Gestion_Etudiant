import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableFonction/Table";
import FormCreateUpdate from "../../components/Modals/ModalFonction/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalFonction/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";


const Fonctions = () => {
    const {t}=useTranslation();
    const [selectedFonction, setSelectedFonction] = useState<CommonSettingProps | null>(null);
    const handleEditFonction = (fonction : CommonSettingProps) => {
        setSelectedFonction(fonction);
    }

    const handleAddFonction = () => {
        setSelectedFonction(null);
    }
    const fonctions = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions);
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
