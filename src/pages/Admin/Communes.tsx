import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalCommune/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCommune/FormDelete";
import Table from "../../components/Tables/TableCommune/Table";
// import { Commune } from "./Communes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface Commune {
    id?: number;
    code: string;
    libelle: string;
    commune: Commune;
}

const Communes = () => {
    // const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
    const { t } = useTranslation();
    // const handleEditCommune = (commune: Commune) => {
    //     setSelectedCommune(commune);
    // }

    // const handleAddCommune = () => {
    //     setSelectedCommune(null);
    // }
    const communes = useSelector((state: RootState) => state.dataSetting.dataSetting.communes);

    const [selectedCommune, setSelectedCommune] = useState<CommuneProps | null>(null);

    const handleEditCommune = (commune: CommuneProps) => { setSelectedCommune(commune) }
    const handleAddCommune = () => { setSelectedCommune(null) }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.communes')} />
            <Table data={communes} onCreate={handleAddCommune} onEdit={handleEditCommune} />

            <FormCreateUpdate commune={selectedCommune} />
            <FormDelete commune={selectedCommune} />

        </>
    );
};

export default Communes;

