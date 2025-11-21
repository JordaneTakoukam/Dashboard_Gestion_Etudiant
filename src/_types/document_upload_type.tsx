
// Définir le type de données pour un documentUpload
interface DocumentUploadType {
    _id?: string;
    date_creation: string;
    nomFr: string;
    nomEn: string;
    file_path?:string;
    
}

interface DocumentUploadInitialData {
    data: {
        documentUploads: DocumentUploadType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateDocumentUploadPayload {
    documentUpload: DocumentUploadType; // Données de l'événement à créer
}

interface UpdateDocumentUploadPayload {
    id: string; // ID de l'événement à mettre à jour
    documentUploadData: Partial<DocumentUploadType>; // Données mises à jour de l'événement
}

interface DeleteDocumentUploadPayload {
    id: string; // ID de l'événement à supprimer
}

interface DocumentUploadReturnGetType {
    documentUploads: DocumentUploadType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}