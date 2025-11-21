import { useDispatch, useSelector } from 'react-redux';
import { setShowModal} from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { createDocumentUpload } from '../../../_redux/features/document_upload_slice';
import { apiSaveDocumentUpload } from '../../../api/api_document_upload';


function ModalCreateUpdate({file, handleSetFile }: {file:File|null, handleSetFile: () => void;}) {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        // if (documentupload) {
        //     setModalTitle(t('form_update.enregistrer')+t('form_update.documentupload'));
        //     setNomFr(documentupload.nomFr);
        //     setNomEn(documentupload.nomEn);
            
        // } else {
            setModalTitle(t('form_save.enregistrer')+t('form_save.document'));
            setNomFr("");
            setNomEn("");
        // }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("");
            setIsFirstRender(false);
        }
    }, [isFirstRender, t]);

    const closeModal = () => { 
        setErrorNomFr("");
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal()); 
    };


    const handleCreateUpdate = async () => {
        // create
        
        if (!nomFr || !nomEn || !file) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            return; 
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('nomFr', nomFr);
        formData.append('nomEn', nomEn);

        try {
            setIsLoading(true)
            await apiSaveDocumentUpload({ formData}).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(createDocumentUpload({
                            
                        documentUpload: {
                            _id: e.data._id,
                            nomFr: e.data.libelleFr,
                            nomEn: e.data.libelleEn,
                            date_creation: e.data.date_creation
                        }
                        
                    }));
                    handleSetFile();
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                };
            });

        } catch (error) {
            console.error('Error uploading documentupload:', error);
        }finally  {
            setIsLoading(false)
        }

    }    

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) =>{setNomFr(e.target.value); setErrorNomFr("");} }
                />
                {errorNomFr && <p className="text-red-500">{errorNomFr}</p>}
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) =>{setNomEn(e.target.value); setErrorNomEn("");} }
                />
                {errorNomEn && <p className="text-red-500">{errorNomEn}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
