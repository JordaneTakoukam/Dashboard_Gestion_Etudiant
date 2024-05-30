
// Définir le type de données pour un événement
interface EvenementType {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    dateDebut: string;
    dateFin: string;
    periodeFr: string;
    periodeEn: string;
    etat: string;
    promotion:string;
    personnelFr: string;
    personnelEn: string;
    descriptionObservationFr: string,
    descriptionObservationEn: string,
    annee: number;
}

interface EvenementInitialData {
    data: {
        evenements: EvenementType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateEvenementPayload {
    evenement: EvenementType; // Données de l'événement à créer
}

interface UpdateEvenementPayload {
    id: string; // ID de l'événement à mettre à jour
    evenementData: Partial<EvenementType>; // Données mises à jour de l'événement
}

interface DeleteEvenementPayload {
    id: string; // ID de l'événement à supprimer
}

interface EvenementReturnGetType {
    evenements: EvenementType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}