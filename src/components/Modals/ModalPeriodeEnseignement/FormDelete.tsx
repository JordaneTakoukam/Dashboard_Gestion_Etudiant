import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { ReponseApiPros } from '../../../api/interface_reponse';
import createToast from '../../../hooks/toastify';
import { deletePeriodeEnseignement } from '../../../_redux/features/periode_enseignement_slice';
import { apiDeletePeriodeEnseignement } from '../../../api/api_periode_enseignement';



function ModalDelete({ periodeEnseignement }: { periodeEnseignement : PeriodeEnseignementType|null}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };


    const handleDelete = async () => {
        if (periodeEnseignement?._id != undefined) {
            await apiDeletePeriodeEnseignement(periodeEnseignement._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);

                    if (periodeEnseignement._id) {
                        dispatch(deletePeriodeEnseignement({ id: periodeEnseignement._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);

            })
        }
    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
            >
                <h1>{t('form_delete.suppression')+t('form_delete.periodeEnseignement')} : {periodeEnseignement ? (lang === 'fr' ? periodeEnseignement.periodeFr : periodeEnseignement.periodeEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



