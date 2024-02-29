import { useTranslation } from "react-i18next";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Tables/TableProgressionMatiere/Table";
import { matieres } from "./ListeMatieres";


const ProgressionMatiere = () => {
    const {t}=useTranslation();
    return (
        <>
            <Breadcrumb pageName={t('sub_menu.progression')} />
            <Table data={matieres[0]}/>
        </>
    );
};

export default ProgressionMatiere;
