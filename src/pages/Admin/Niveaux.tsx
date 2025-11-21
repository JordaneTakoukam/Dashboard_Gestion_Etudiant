import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import FormCreateUpdate from "../../components/Modals/ModalNiveau/FormCreateUpdate";
import FormDelete from "../../components/Modals/ModalNiveau/FormDelete";
import Table from "../../components/Tables/TableNiveau/Table";
import { Cycle } from "./Cycles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setShowModal } from "../../_redux/features/setting";
import { setDataSetting, setErrorDataSetting, setLoadingDataSetting } from "../../_redux/features/data_setting_slice";
import { apiGetAllSettings } from "../../api/settings/api_data_setting";
import { PageNoData } from "../../components/_Global/PageNoData";
import { PageErreur } from "../../components/_Global/PageErreur";
import LoadingTable from "../../components/Tables/common/LoadingTable";
import Loading from "../../components/ui/loading";

export interface Niveau {
    id?: number;
    code: string;
    libelle: string;
    cycle: Cycle;
}

const Niveaux = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedNiveau, setSelectedNiveau] = useState<NiveauProps | null>(null);
    const niveaux = useSelector((state: RootState) => state.dataSetting.dataSetting.niveaux);
    
    const handleEditNiveau = (niveau: NiveauProps) => {
        setSelectedNiveau(niveau);
    }

    const handleAddNiveau = () => {
        setSelectedNiveau(null);
    }


    const pageIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const pageError = useSelector((state: RootState) => state.dataSetting.error);

    const handleCreate = () => {
        handleAddNiveau();
        dispatch(setShowModal())
    }
    const handleRefresh = async () => {
        dispatch(setLoadingDataSetting(true));
        try {
            const settingsData = await apiGetAllSettings();
            dispatch(setDataSetting(settingsData));
            dispatch(setErrorDataSetting(null))
        } catch (error) { dispatch(setErrorDataSetting(t('message.erreur_recuperation'))); }
        finally { dispatch(setLoadingDataSetting(false)); }


    }

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.niveaux')} />

            {
                pageIsLoading ?
                <Loading /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        niveaux.length === 0 ?
                            <PageNoData
                                titrePage={t('aucun.service')}
                                titreBouton={t('ajouter_votre_premier.service')}
                                showModalCreate={handleCreate}
                                refreshFunction={handleRefresh} />
                            : <Table
                                data={niveaux}
                                onCreate={handleAddNiveau}
                                onEdit={handleEditNiveau} />

            }
            <FormCreateUpdate niveau={selectedNiveau} />
            <FormDelete niveau={selectedNiveau} />

        </>
    );
};

export default Niveaux;

export const niveau: Niveau = {
    id: 1,
    code: "N1",
    libelle: "1ère année",
    cycle: {
        id: 1,
        code: "CA",
        libelle: "Cycle A",

    },
}
export const niveaux: Niveau[] = [];
