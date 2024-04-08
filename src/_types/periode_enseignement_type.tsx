
// Définir le type de données pour un événement
interface PeriodeEnseignementType {
    _id?: string;
    annee:number;
    semestre:number;
    periodeFr: string;
    periodeEn: string;
    dateDebut:string;
    dateFin:string;
    niveau: string;
    enseignements?: MatiereEnseignement[],
}

interface PeriodeEnseignementInitialData {
    data: {
        periodeEnseignements: PeriodeEnseignementType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface ProgressionPeriodeEnseignementInitialData {
    data: {
        periodeEnseignements: PeriodeEnseignementType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreatePeriodeEnseignementPayload {
    periodeEnseignement: PeriodeEnseignementType; // Données de l'événement à créer
}

interface UpdatePeriodeEnseignementPayload {
    id: string; // ID de l'événement à mettre à jour
    periodeEnseignementData: Partial<PeriodeEnseignementType>; // Données mises à jour de l'événement
}

interface DeletePeriodeEnseignementPayload {
    id: string; // ID de l'événement à supprimer
}

interface PeriodeEnseignementReturnGetType {
    periodeEnseignements: PeriodeEnseignementType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}

interface ProgressionPeriodeEnseignementReturnGetType {
    periodeEnseignements: PeriodeEnseignementType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}