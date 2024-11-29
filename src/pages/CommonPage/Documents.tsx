// src/components/DocumentUploadUpload.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../hooks/toastify';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaTrashAlt } from 'react-icons/fa'; // Import des icônes
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { setDocumentUploadLoading, setDocumentUploads, setErrorPageDocumentUpload } from '../../_redux/features/document_upload_slice';
import { apiDownloadDocumentUpload, apiGetDocumentUploads } from '../../api/api_document_upload';
import FormCreateUpdate from '../../components/Modals/ModalDocument/FormCreateUpdate';
import { setShowModal, setShowModalDelete } from '../../_redux/features/setting';
import Pagination from '../../components/Pagination/Pagination';
import { config } from '../../config';
import { format } from 'date-fns'; // Pour formater la date
import FormDelete from '../../components/Modals/ModalDocument/FormDelete';

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo en octets

const DocumentUploadUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedDocument, setSelectedDocument]=useState<DocumentUploadType | null>(null);
  const { data: { documentUploads } } = useSelector((state: RootState) => state.documentUploadSlice);
  const lang = useSelector((state: RootState) => state.setting.language);
  const currentUser: UserState = useSelector((state: RootState) => state.user);

  // Variables pour la pagination
  const itemsPerPage = useSelector((state: RootState) => state.documentUploadSlice.data.pageSize); // nombre d'éléments maximum par page
  const count = useSelector((state: RootState) => state.documentUploadSlice.data.totalItems);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < Math.ceil(count / itemsPerPage);

  const startItem = indexOfFirstItem + 1;
  const endItem = Math.min(count, indexOfLastItem);

  const fetchDocumentUploads = async () => {
    dispatch(setDocumentUploadLoading(true)); // Définissez le loading à true avant le chargement
    try {
      const emptyDocuments: DocumentUploadReturnGetType = {
        documentUploads: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0
      };

      const fetchedDocumentUploads = await apiGetDocumentUploads({ page: currentPage });
      if (fetchedDocumentUploads) {
        dispatch(setDocumentUploads(fetchedDocumentUploads));
      } else {
        dispatch(setDocumentUploads(emptyDocuments));
      }

      dispatch(setErrorPageDocumentUpload(null)); // Réinitialisez les erreurs s'il y en a

    } catch (error) {
      dispatch(setErrorPageDocumentUpload(t('message.erreur')));
    } finally {
      dispatch(setDocumentUploadLoading(false));
    }
  };

  useEffect(() => {
    
    fetchDocumentUploads();
   
  }, [dispatch, documentUploads.length, currentPage, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE) {
        const msg = t('error.telecharger_doc');
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
    if (!file) {
      //   console.log('File or names are missing');
      return;
    }
    dispatch(setShowModal())
  };

  const handleDelete = async (doc: DocumentUploadType) => {
      setSelectedDocument(doc);
      dispatch(setShowModalDelete());
  };

  const handleSetFile = async () => {
    setFile(null);
  };

  const getFileIcon = (filePath: string) => {
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
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
    <>
      <div className="document-upload-container h-full">
        {(currentUser.role===config.roles.superAdmin || currentUser.role===config.roles.admin) && <div
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
                {getFileIcon(file.name)}
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
                      d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.862 5.80478L8.66667 3.60946V10C8.66667 10.3682 8.36819 10.6667 8 10.6667C7.63181 10.6667 7.33333 10.3682 7.33333 10V3.60946L5.13801 5.80478C4.87766 6.06513 4.45554 6.06513 4.19519 5.80478C3.93484 5.54443 3.93484 5.12232 4.19519 4.86197L7.52852 1.52864Z"
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
                <p>{t('label.telecharger_zone')}</p>
              </>
            )}
            <p>(Max : 2Mo)</p>
          </div>
        </div>}
        {(currentUser.role===config.roles.superAdmin || currentUser.role===config.roles.admin) && error && <p className="text-red-500">{error}</p>}
        {(currentUser.role===config.roles.superAdmin || currentUser.role===config.roles.admin) &&<button className="upload-button" onClick={handleUpload} disabled={!file}>
          {t("boutton.importer")}
        </button>}

        <h2>{t("label.doc_dispo")}</h2>
        {documentUploads.length > 0 ? (
          <ul className="document-list">
            {documentUploads.map(doc => (
              <li key={doc._id} className="document-item">
                <span className='cursor-pointer' onClick={() => doc._id && apiDownloadDocumentUpload(doc._id, doc.file_path)}>
                  {getFileIcon(doc.file_path ?? '')} {/* Utiliser la fonction d'icône pour le fichier */}
                  <div className="document-info">
                    <p>{lang === 'fr' ? doc.nomFr : doc.nomEn}</p>
                    <p className="document-date">{format(new Date(doc.date_creation), 'dd/MM/yyyy')}</p>
                  </div>
                </span>
                <button className="delete-button" onClick={() => handleDelete(doc)}>
                  <FaTrashAlt className="h-5 w-5 text-red-300" /> {/* Icône de la corbeille */}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("label.aucun_doc_dispo")}</p>
        )}
        {/* Pagination */}
        {documentUploads.length > 0 && <Pagination
          count={count}
          itemsPerPage={itemsPerPage}
          startItem={startItem}
          endItem={endItem}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          currentPage={currentPage}
          pageNumbers={pageNumbers}
          handlePageClick={handlePageClick}
        />}
      </div>

      <FormCreateUpdate file={file} handleSetFile={handleSetFile}  />
      <FormDelete documentUpload={selectedDocument} />
    </>
  );
};

export default DocumentUploadUpload;
