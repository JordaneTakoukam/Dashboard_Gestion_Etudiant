// Définir le type de données pour un chapitre
interface ChapitreType {
    _id?: string;
    annee:number;
    semestre:number;
    code: string;
    libelleFr: string;
    libelleEn: string;
    typesEnseignement: EnseignementType[],
    matiere:string,
    // objectifs:ObjectifType[],
}

interface ChapitreInitialData {
    data: {
        chapitres: ChapitreType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateChapitrePayload {
    chapitre: ChapitreType; // Données de l'événement à créer
}

interface UpdateChapitrePayload {
    id: string; // ID de l'événement à mettre à jour
    chapitreData: Partial<ChapitreType>; // Données mises à jour de l'événement
}

interface DeleteChapitrePayload {
    id: string; // ID de l'événement à supprimer
}

interface ChapitreReturnGetType {
    chapitres: ChapitreType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}