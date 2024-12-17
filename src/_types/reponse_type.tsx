
// Définir le type de données pour un événement
interface ReponseType {
    _id?: string;
    etudiant: UserState;
    devoir: DevoirType;
    tentative: [{
        reponses: [{
            question: QuestionType;
            reponse: string; // Réponse donnée par l'étudiant
        }],
        score: number; // Score obtenu pour cette tentative
        dateSoumission: string
    }],
    meilleureScore: number; // Meilleure note obtenue parmi les tentatives
}

interface ReponseInitialData {
    data: {
        reponses: ReponseType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedReponse:ReponseType|undefined;
}


interface CreateReponsePayload {
    reponse: ReponseType; // Données de l'événement à créer
}

interface UpdateReponsePayload {
    id: string; // ID de l'événement à mettre à jour
    reponseData: Partial<ReponseType>; // Données mises à jour de l'événement
}

interface DeleteReponsePayload {
    id: string; // ID de l'événement à supprimer
}

interface ReponseReturnGetType {
    reponses: ReponseType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}