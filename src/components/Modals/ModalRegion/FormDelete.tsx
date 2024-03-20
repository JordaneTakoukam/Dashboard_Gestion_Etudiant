import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { deleteSettingItem } from '../../../_redux/features/data_setting_slice';
import { apiDeleteRegion } from '../../../api/settings/api_region';
import createToast from '../../../hooks/toastify';
import { ReponseApiPros } from '../../../api/interface_reponse';
import { CommonSettingProps } from '../../../_types/data_setting_interface';


function ModalDelete({ region }: { region: CommonSettingProps | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (region) {
            await apiDeleteRegion(region._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    // dispatch(setShowModalDelete());
                    dispatch(deleteSettingItem({ tableName: 'region', itemId: region._id }));

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            })
        }

        closeModal();
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
                <h1>{t('form_delete.suppression') + t('form_delete.region')} : {region ? (lang == "fr" ? region.libelleFr : region.libelleEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



