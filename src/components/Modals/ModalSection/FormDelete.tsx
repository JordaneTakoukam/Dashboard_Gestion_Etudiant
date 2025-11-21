import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { apiDeleteSection } from '../../../api/settings/api_section';
import { deleteSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';
import { useState } from 'react';



function ModalDelete({ section }: { section: SectionProps | null }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const lang = useSelector((state: RootState) => state.setting.language);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const handleDelete = async () => {
        if (section?._id != undefined) {
            setIsLoading(true)
            await apiDeleteSection(section._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    try { createToast(e.message[lang as keyof typeof e.message], '', 0); }
                    catch (e) { throw e; }
                    if (section._id) {
                        dispatch(deleteSettingItem({ tableName: 'sections', itemId: section._id }));
                    }

                    closeModal();
                } else {
                    try { createToast(e.message[lang as keyof typeof e.message], '', 2); }
                    catch (e) { throw e; }
                }
            }).catch((e) => {
                try { createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2); }
                catch (e) { throw e; }
            }).finally(() => {
                setIsLoading(false);
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
                isLoading={isLoading}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.section')} : {section ? (lang === 'fr' ? section.libelleFr : section.libelleEn) : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



