import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalSalleCours/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalSalleCours/FormDelete";
import Table from "../../components/Tables/TableSalleCours/Table";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface SalleCours{
    id?:number;
    code:string;
    nom:string;
    nbPlace:number;
}

const SallesDeCours = () => {
    const {t}=useTranslation();
    const [selectedSalleCours, setSelectedSalleCours] = useState<SalleDeCoursProps | null>(null);
    const handleEditSection = (salleCours : SalleDeCoursProps) => {
        setSelectedSalleCours(salleCours);
    }

    const handleAddSection = () => {
        setSelectedSalleCours(null);
    }
    const sallesDecours = useSelector((state: RootState) => state.dataSetting.dataSetting.salleDeCours);
    return (
        <>
            <Breadcrumb pageName={t('menu.salles')} />
            <Table data={sallesDecours} onCreate={handleAddSection} onEdit={handleEditSection}/>

            <FormCreateUpdate salleDeCours={selectedSalleCours}/>
            <FormDelete salleDeCours={selectedSalleCours}/>

        </>
    );
};

export default SallesDeCours;
export const sallesCours: SalleCours[] = [];