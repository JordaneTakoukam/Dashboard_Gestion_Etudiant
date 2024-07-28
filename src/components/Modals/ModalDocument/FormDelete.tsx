import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { apiDeleteDocumentUpload } from '../../../api/api_document_upload';
import { deleteDocumentUpload } from '../../../_redux/features/document_upload_slice';


function ModalDelete({ documentUpload }: {documentUpload:DocumentUploadType | null}) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };
    const {t}=useTranslation();

    const handleDelete = async () => {
        if(documentUpload && documentUpload._id){
            await apiDeleteDocumentUpload(documentUpload._id).then((e: ReponseApiPros) => {
                if (e.success) {
                    if(documentUpload._id){
                        dispatch(deleteDocumentUpload({ id: documentUpload._id }));
                    }
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);

                }
            }).catch((e) => {
                console.log(e);
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
                <h1>{t('form_delete.suppression')+t('form_delete.document')} : {documentUpload? lang === 'fr' ? documentUpload.nomFr: documentUpload.nomEn:""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default ModalDelete



