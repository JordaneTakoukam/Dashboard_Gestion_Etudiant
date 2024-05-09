
// Définir le type de données pour un objectif
interface ObjectifType {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    etat:number;//0 non terminé, 1 terminé
    date_etat?:Date;
    matiere:string;
}

interface ObjectifInitialData {
    data: {
        objectifs: ObjectifType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateObjectifPayload {
    objectif: ObjectifType; // Données de l'événement à créer
}

interface UpdateObjectifPayload {
    id: string; // ID de l'événement à mettre à jour
    objectifData: Partial<ObjectifType>; // Données mises à jour de l'événement
}

interface DeleteObjectifPayload {
    id: string; // ID de l'événement à supprimer
}

interface ObjectifReturnGetType {
    objectifs: ObjectifType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}