// src/components/DocumentUpload.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { apiGetDocuments, apiSaveDocument } from '../../api/api_document';
import createToast from '../../hooks/toastify';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from 'react-icons/fa'; // Import des icônes
import { setDocumentLoading, setErrorPageDocument } from '../../_redux/features/document_slice';
import { useDispatch } from 'react-redux';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo en octets

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [nomFr, setNomFr] = useState<string>('');
  const [nomEn, setNomEn] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fetchDocuments = async () => {
    dispatch(setDocumentLoading(true)); // Définissez le loading à true avant le chargement
    try {
        const emptyCalendrier:DocumentReturnGetType={
            documents: [],
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            pageSize: 0
        }
       
        const fetchedDocuments = await apiGetDocuments({page: 1});
        // Mettez à jour l'état Redux avec les données récupérées
        // dispatch(setDocuments(fetchedDocuments));
        if(fetchedDocuments){
            setDocuments(fetchedDocuments.documents);
        }
        
        dispatch(setErrorPageDocument(null)); // Réinitialisez les erreurs s'il y en a
        
    } catch (error) {
        dispatch(setErrorPageDocument(t('message.erreur')));
    } finally {
        dispatch(setDocumentLoading(false));
    }
};

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        const msg = t('Le fichier est trop grand. La taille maximale est de 2MB.');
        createToast(msg, '', 2);
        setError(msg);
        setFile(null); // Clear the file
      } else {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !nomFr || !nomEn) {
      console.log('File or names are missing');
      return;
    }
    // console.log(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiSaveDocument({ formData, nomFr, nomEn });
      console.log(response);
      fetchDocuments(); // Rafraîchit la liste des documents après l'upload
      setNomFr(''); // Réinitialiser les champs après l'upload
      setNomEn('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const getFileIcon = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <FaFilePdf className="h-10 w-10 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="h-10 w-10 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="h-10 w-10 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="h-10 w-10 text-yellow-500" />;
      default:
        return <FaFileAlt className="h-10 w-10 text-gray-500" />;
    }
  };

    return (
        <div className="document-upload-container">
            <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
            <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                value={nomFr}
                onChange={(e) =>{setNomFr(e.target.value);} }
            />
            <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
            <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                value={nomEn}
                onChange={(e) =>{setNomEn(e.target.value);} }
            />
      <div
        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          {file ? (
            <>
              {getFileIcon(file)}
              <p>{file.name}</p>
            </>
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                    fill="#3C50E0"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                    fill="#3C50E0"
                  />
                </svg>
              </span>
              <p>{t('label.telecharger_doc')}</p>
            </>
          )}
          <p>(Max : 2Mo)</p>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button className="upload-button" onClick={handleUpload} disabled={!file || !nomFr || !nomEn}>
        {t("boutton.telecharger")}
      </button>

      <h2>{t("label.doc_dispo")}</h2>
      <ul className="document-list">
        {documents.map(doc => (
          <li key={doc._id}>
            <a href={`/api/documents/download/${doc._id}`} download className="document-link">{doc.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentUpload;
