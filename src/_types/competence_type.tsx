
// Définir le type de données pour une compétence
interface CompetenceType {
    _id?: string;
    code: string;
    libelleFr: string;
    libelleEn: string;
}

interface CompetenceInitialData {
    data: {
        competences: CompetenceType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateCompetencePayload {
    competence: CompetenceType; // Données de l'événement à créer
}

interface UpdateCompetencePayload {
    id: string; // ID de l'événement à mettre à jour
    competenceData: Partial<CompetenceType>; // Données mises à jour de l'événement
}

interface DeleteCompetencePayload {
    id: string; // ID de l'événement à supprimer
}

interface CompetenceReturnGetType {
    competences: CompetenceType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}