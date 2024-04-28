import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import { setShowModal } from "../../../../_redux/features/setting";
import Breadcrumb from "../../../../components/Breadcrumb";
import LoadingTable from "../../../../components/Tables/common/LoadingTable";
import { PageErreur } from "../../../../components/_Global/PageErreur";
import { PageNoData } from "../../../../components/_Global/PageNoData";
import io from 'socket.io-client';
import { socket_url } from "../../../../config";
import { addSignalementAbsenceEnseignant, setListSignalementAbsenceEnseignant, setSignalementAbsenceEnseignantError } from "../../../../_redux/features/absence/signalement_absence_enseignant";



const AbsenceSignalerEnseignant = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const listAbsenceSignaler = useSelector((state: RootState) => state.signalementAbsenceEnseignant.data);



    const pageIsLoading = useSelector((state: RootState) => state.signalementAbsenceEnseignant.pageIsLoading);
    const pageError = useSelector((state: RootState) => state.signalementAbsenceEnseignant.pageError);


    const handleRefresh = async () => {
        // dispatch(setLoadingDataSetting(true));
        // try {
        //     const settingsData = await apiGetAllSettings();
        //     dispatch(setDataSetting(settingsData));
        //     dispatch(setErrorDataSetting(null))

        // } catch (error) { dispatch(setErrorDataSetting('une erreur est survenue')) }
        // finally { dispatch(setLoadingDataSetting(false)); }
    }


    useEffect(() => {
        // Établit une connexion avec le serveur Socket.io
        const socket = io(socket_url); // Remplace l'URL par celle de ton serveur

        socket.on('message', (data: { message: SignalementAbsence }) => {

            console.log(data.message);
            dispatch(addSignalementAbsenceEnseignant(data.message));

            // setMessages(prevMessages => [...prevMessages, data.message]);
        });

        // Nettoie la connexion lorsque le composant est démonté
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Breadcrumb pageName={t('sub_menu.absence_reporting')} />

            {
                pageIsLoading ?
                    <LoadingTable /> :
                    pageError ?
                        <PageErreur onRefresh={handleRefresh} /> :
                        listAbsenceSignaler.length === 0 ?
                            <PageNoData
                                afficherBoutonCreer={false}
                                titrePage={t('aucun.absence_signaler')}
                                showModalCreate={() => { }}
                                refreshFunction={handleRefresh} />
                            : <div>
                                {
                                    listAbsenceSignaler.map((e, index) => (
                                        <li key={index}>{e.nom}</li>
                                    ))
                                }

                            </div>
                // <Table
                //     data={sections}
                //     onCreate={handleAddSection}
                //     onEdit={handleEditSection} />

            }

            {/* <FormCreateUpdate section={selectedSection} />
            <FormDelete section={selectedSection} /> */}

        </>
    );
};

export default AbsenceSignalerEnseignant;
