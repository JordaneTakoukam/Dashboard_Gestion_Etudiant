import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableGrade/Table";
import FormCreateUpdate from "../../components/Modals/ModalGrade/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalGrade/FormDelete";
import { useTranslation } from "react-i18next";

export interface Grade{
    id?:number;
    code:string;
    libelle:string;
}

const Grades = () => {
    const {t}=useTranslation();
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const handleEditGrade = (grade : Grade) => {
        setSelectedGrade(grade);
    }

    const handleAddGrade = () => {
        setSelectedGrade(null);
    }
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
export const grades : Grade[]=[
    {
        id : 1,
        code : "A",
        libelle : "A"
    },
    {
        id : 2,
        code : "B",
        libelle : "B"
    },
    {
        id : 3,
        code : "C",
        libelle : "C"
    }
];
