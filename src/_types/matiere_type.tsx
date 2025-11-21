
// Définir le type de données pour un événement
interface MatiereType {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
    // niveau: string;
    prerequisFr: string;
    prerequisEn: string;
    approchePedFr: string;
    approchePedEn: string;
    evaluationAcquisFr: string;
    evaluationAcquisEn: string;
    typesEnseignement?: string[],
    chapitres?: ChapitreType[],
    objectifs?: ObjectifType[],
}

interface MatiereInitialData {
    data: {
        matieres: MatiereType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedMatiere:MatiereType|undefined;
}

interface ProgressionMatiereInitialData {
    data: {
        matieres: MatiereType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateMatierePayload {
    matiere: MatiereType; // Données de l'événement à créer
}

interface UpdateMatierePayload {
    id: string; // ID de l'événement à mettre à jour
    matiereData: Partial<MatiereType>; // Données mises à jour de l'événement
}

interface UpdateChapitresPayload {
    id: string; // ID de l'événement à mettre à jour
    chapitresData: ChapitreType[]; // Données mises à jour de l'événement
}

interface UpdateEnseignementsPayload {
    id: string; // ID de l'événement à mettre à jour
    enseignementsData: EnseignementType[]; // Données mises à jour de l'événement
}

interface DeleteMatierePayload {
    id: string; // ID de l'événement à supprimer
}

interface MatiereReturnGetType {
    matieres: MatiereType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}

interface ProgressionMatiereReturnGetType {
    matieres: MatiereType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}