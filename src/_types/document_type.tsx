// Définir le type de données pour un document
interface DocumentType {
    _id?: string;
    annee:number;
    nom_fr:string;
    nom_en:string;
    date_creation:string;
}

interface DocumentInitialData {
    data: {
        documents: DocumentType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateDocumentPayload {
    document: DocumentType; // Données de l'événement à créer
}

interface UpdateDocumentPayload {
    id: string; // ID de l'événement à mettre à jour
    documentData: Partial<DocumentType>; // Données mises à jour de l'événement
}

interface DeleteDocumentPayload {
    id: string; // ID de l'événement à supprimer
}

interface DocumentReturnGetType {
    documents: DocumentType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}