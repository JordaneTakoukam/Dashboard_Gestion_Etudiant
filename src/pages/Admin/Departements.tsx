import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableDepartement/Table";
import FormCreateUpdate from "../../components/Modals/ModalDepartement/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalDepartement/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { DepartementProps } from "../../_types/data_setting_type";


export const Departements = () => {
    const { t } = useTranslation();
    const departements = useSelector((state: RootState) => state.dataSetting.dataSetting.departement);

    const [selectedDepartement, setSelectedDepartement] = useState<DepartementProps | null>(null);

    const handleEditDepartement = (departement: DepartementProps) => { setSelectedDepartement(departement) }
    const handleAddDepartement = () => { setSelectedDepartement(null) }
    
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.departements')} />
            <Table data={departements} onCreate={handleAddDepartement} onEdit={handleEditDepartement} />

            <FormCreateUpdate departement={selectedDepartement} />
            <FormDelete departement={selectedDepartement} />

        </>
    );
};


