import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableGrade/Table";
import FormCreateUpdate from "../../components/Modals/ModalGrade/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalGrade/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface Grade{
    id?:number;
    code:string;
    libelle:string;
}

const Grades = () => {
    const {t}=useTranslation();
    const [selectedGrade, setSelectedGrade] = useState<CommonSettingProps | null>(null);
    const handleEditGrade = (grade : CommonSettingProps | null) => {
        setSelectedGrade(grade);
    }

    const handleAddGrade = () => {
        setSelectedGrade(null);
    }
    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades);
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.grades')} />
            <Table data={grades} onCreate={handleAddGrade} onEdit={handleEditGrade}/>

            <FormCreateUpdate grade={selectedGrade}/>
            <FormDelete grade={selectedGrade}/>

        </>
    );
};

export default Grades;
