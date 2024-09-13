import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../_redux/store';
import createToast from '../../../hooks/toastify';
import { setShowModalNotificationDetails } from '../../../_redux/features/setting';
import { config } from '../../../config';
import { jours } from '../../../pages/CommonPage/EmploiDeTemp';
import { apiUpdateStatutChap } from '../../../api/api_chapitre';
import { updateChapitre } from '../../../_redux/features/chapitre_slice';
import { apiUpdateStatutObj } from '../../../api/api_objectif';
import { updateObjectif } from '../../../_redux/features/objectif_slice';
import { apiDownloadPiecesJointes } from '../../../api/api_document_upload';

interface ModalNotificationDetailsProps {
    notification: NotificationType | null;
}

function ModalNotificationDetails({ notification }: ModalNotificationDetailsProps) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.notificationDetails);
    const closeModal = () => { dispatch(setShowModalNotificationDetails()); };
    const { t } = useTranslation();

    
    
    async function handleAcknowledge(): Promise<void> {
        
        if(notification && notification.type === config.typeNotifications.approbation_chap && notification.chapitre?._id){
            console.log("if");
            await apiUpdateStatutChap({chapitre:notification.chapitre?._id}
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    dispatch(
                        updateChapitre({
                            id: e.data._id,
                            chapitreData: {
                                _id: e.data._id,
                                annee:e.data.annee,
                                semestre:e.data.semestre,
                                code:e.data.code,
                                libelleFr:e.data.libelleFr,
                                libelleEn:e.data.libelleEn,
                                matiere:e.data.matiere,
                                statut:e.data.statut,
                                typesEnseignement: e.data.typesEnseignement,
                            }
                        }));
                    // dispatch(modifierChapitre({...e.data}))
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        }else if(notification && notification.type === config.typeNotifications.approbation_obj && notification.objectif?._id){
            console.log("else if");
            await apiUpdateStatutObj({objectif : notification.objectif?._id}).then((e: ReponseApiPros) => {
                if (e.success) {
                    
                    dispatch(
                        updateObjectif({
                            id: e.data._id,
                            objectifData: {
                                _id: e.data._id,
                                annee:e.data.annee,
                                semestre:e.data.semestre,
                                code:e.data.code,
                                libelleFr:e.data.libelleFr,
                                libelleEn:e.data.libelleEn,
                                etat:e.data.etat,
                                statut:e.data.statut,
                                matiere:e.data.matiere,
                            }
                        }));
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.responsmatiere.message[lang as keyof typeof e.responsmatiere.message], '', 2);
            })
        }else{
            
            closeModal()
        }
        
    }

    return (
        <>
            <CustomDialogModal
                title={t('notification_details.title')}
                isModalOpen={isModalOpen}
                isUnique={true}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleAcknowledge}
            >
                {notification && (
                    <>
                        <p>{t('notification_details.type')}: {notification.type===config.typeNotifications.absence?t('notification_details.sig_type'):notification.type===config.typeNotifications.approbation_obj?t('notification_details.obj_type'):t('notification_details.chap_type')}</p>
                        {notification.type === config.typeNotifications.absence && notification.signalementAbsence && (
                            <p>
                                {t('notification_details.user')}: {notification.user ? `${notification.user.nom} ${notification.user.prenom}` : ""}
                                <br />
                                {t('notification_details.heure_debut_absence')}: {notification.signalementAbsence.heure_debut_absence}
                                <br />
                                {t('notification_details.heure_fin_absence')}: {notification.signalementAbsence.heure_fin_absence}
                                <br />
                                {t('notification_details.jour_absence')}: {lang === 'fr' ? jours.find(jour => jour.ordre == notification.signalementAbsence?.jour_absence)?.libelleFr : jours.find(jour => jour.ordre == notification.signalementAbsence?.jour_absence)?.libelleEn}
                                <br />
                                {notification.signalementAbsence.file_paths && notification.signalementAbsence.file_paths.length> 0 && (
                                    <p>
                                        {t('notification_details.filePaths')}:{" "}
                                        
                                        <button onClick={async ()=> notification.signalementAbsence && notification.signalementAbsence.file_paths && await apiDownloadPiecesJointes(notification.signalementAbsence.file_paths)}>
                                            {t('notification_details.download_file')} {notification.signalementAbsence.file_paths.length}
                                        </button>
                                        {/* {(notification.signalementAbsence && notification.signalementAbsence.file_paths) && (index < notification.signalementAbsence.file_paths.length - 1 && ", ")} */}
                                            
                                    </p>
                                )}
                            </p>
                        )}
                        {notification.type === config.typeNotifications.approbation_chap && (
                            <p>
                                {t('notification_details.user')}: {notification.user ? `${notification.user.nom} ${notification.user.prenom}` : ""}
                                <br />
                                {t('notification_details.chapitre')}: {notification.chapitre ? `${lang==='fr'?notification.chapitre.libelleFr:notification.chapitre.libelleEn}` : ""}
                                <br />
                                {t('notification_details.matiere')}: {notification.chapitre && notification.chapitre.matiere ? `${lang==='fr'?notification.chapitre.matiere.libelleFr:notification.chapitre.matiere.libelleEn}` : ""}
                            </p>
                        )}
                        {notification.type === config.typeNotifications.approbation_obj && (
                            <p>
                                {t('notification_details.user')}: {notification.user ? `${notification.user.nom} ${notification.user.prenom}` : ""}
                                <br />
                                {t('notification_details.objectif')}: {notification.objectif ? `${lang==='fr'?notification.objectif.libelleFr:notification.objectif.libelleEn}` : ""}
                                <br />
                                {t('notification_details.matiere')}: {notification.objectif && notification.objectif.matiere ? `${lang==='fr'?notification.objectif.matiere.libelleFr:notification.objectif.matiere.libelleEn}` : ""}
                            </p>
                        )}
                    </>
                )}
            </CustomDialogModal>
        </>
    );
}

export default ModalNotificationDetails;
