// Définir le type de données pour un question
interface QuestionType {
    _id?: string;
    textFr: string;
    textEn: string;
    type: string;
    nbPoint:number;
    options:{
        textFr:string,
        textEn:string,
        pourcentage:number
    }[]; 
    devoir: DevoirType
}

interface QuestionInitialData {
    data: {
        questions: QuestionType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateQuestionPayload {
    question: QuestionType; // Données de l'événement à créer
}

interface UpdateQuestionPayload {
    id: string; // ID de l'événement à mettre à jour
    questionData: Partial<QuestionType>; // Données mises à jour de l'événement
}

interface DeleteQuestionPayload {
    id: string; // ID de l'événement à supprimer
}

interface QuestionReturnGetType {
    questions: QuestionType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}