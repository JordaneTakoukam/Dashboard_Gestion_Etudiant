import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import Breadcrumb from "../../../../components/Breadcrumb";
import LoadingTable from "../../../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../../../components/_Global/PageErreur";
import { PageNoData } from "../../../../components/_Global/PageNoData";
import TableSignalementAbsence from "../../../../components/Tables/TablesDisciplineEnseignants/Table_signalement_absence";
import { r_etud } from "../../../../config";



const AbsenceSignalerEtudiant = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const listAbsenceSignaler = useSelector((state: RootState) => state.signalementAbsence.data);

    const listAbsenceSignalerEtudiant = listAbsenceSignaler.filter((e) => e.role === r_etud);



    const pageIsLoading = useSelector((state: RootState) => state.signalementAbsence.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.signalementAbsence.pageError);


    const handleRefresh = async () => {
        // dispatch(setLoadingDataSetting(true));
        // try {
        //     const settingsData = await apiGetAllSettings();
        //     dispatch(setDataSetting(settingsData));
        //     dispatch(setErrorDataSetting(null))

        // } catch (error) { dispatch(setErrorDataSetting('une erreur est survenue')) }
        // finally { dispatch(setLoadingDataSetting(false)); }
    }



    return (
        <>
            <Breadcrumb pageName={t('sub_menu.absence_reporting')} />

            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        listAbsenceSignalerEtudiant.length === 0 ?
                            <PageNoData
                                afficherBoutonCreer={false}
                                titrePage={t('aucun.absence_signaler')}
                                showModalCreate={() => { }}
                                refreshFunction={handleRefresh} />
                            : <div>
                                <TableSignalementAbsence listData={listAbsenceSignalerEtudiant} type="etudiant" />

                            </div>
            }


        </>
    );
};

export default AbsenceSignalerEtudiant;

