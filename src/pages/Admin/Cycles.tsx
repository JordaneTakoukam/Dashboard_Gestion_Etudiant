import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableCycle/Table";
import FormCreateUpdate from "../../components/Modals/ModalCycle/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalCycle/FormDelete";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

export interface Cycle{
    id?:number,
    code:string;
    libelle:string;
    // section:Section;
}

const Cycles = () => {
    const {t}=useTranslation();
    const [selectedCycle, setSelectedCycle] = useState<CycleProps | null>(null);
    const cycles = useSelector((state: RootState) => state.dataSetting.dataSetting.cycle);
    const handleEditCycle = (cycle: CycleProps) => {
        setSelectedCycle(cycle);
    }

    const handleAddCycle = () => {
        setSelectedCycle(null);
    }
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.cycles')} />
            <Table data={cycles} onCreate={handleAddCycle} onEdit={handleEditCycle}/>

            <FormCreateUpdate cycle={selectedCycle}/>
            <FormDelete cycle={selectedCycle}/>

        </>
    );
};

export default Cycles;
export const cycles: Cycle[] = []