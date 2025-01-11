
// Définir le type de données pour un événement
interface DevoirType {
    _id?: string;
    titreFr: string;
    titreEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
    utilisateur: UserState
    niveau: string
    questions?: QuestionType[]; // Référence aux questions
    totalQuestionPoints:number; //Nombre total de point pour les questions
    deadline: string;
    ordreAleatoire: boolean; // Si les questions doivent être affichées aléatoirement
    tentativesMax: number; // Nombre maximum de tentatives autorisées
    noteSur:number;
    feedbackConfig: {
        afficherNoteApresSoumission: boolean; // Montrer la note après soumission
        afficherCorrectionApresSoumission: boolean; // Montrer la correction après soumission
        afficherNoteApresDeadline:boolean; // Montrer la note après le deadline
        afficherCorrectionApresDeadline: boolean; // Montrer la correction après le deadline
    },
    annee: number, // Année de création
    createdAt?: string,
}

interface DevoirInitialData {
    data: {
        devoirs: DevoirType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedDevoir:DevoirType|undefined;
    selectedStudent:UserState|undefined;
}

interface DevoirStatsInitialData {
    data: {
        devoir: {
            _id?:string, 
            titreFr: string,
            titreEn: string,
            noteSur: number,
            totalQuestionPoints:number,
        },
        nombreParticipants: number,
        meilleureNote: number,
        pireNote: number,
        noteMoyenne: number,
        etudiants : 
        {
            etudiant:UserState
            meilleureScore: number,
            nombreTentatives: number,
        }[]
    
        // currentPage: number;
        // totalPages: number;
        // totalItems: number;
        // pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}


interface CreateDevoirPayload {
    devoir: DevoirType; // Données de l'événement à créer
}

interface UpdateDevoirPayload {
    id: string; // ID de l'événement à mettre à jour
    devoirData: Partial<DevoirType>; // Données mises à jour de l'événement
}


interface DeleteDevoirPayload {
    id: string; // ID de l'événement à supprimer
}

interface DevoirReturnGetType {
    devoirs: DevoirType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}

interface StudentStats{
    etudiant:UserState
    meilleureScore: number,
    nombreTentatives: number,
}

interface DevoirStatsReturnGetType {
        devoir: {
            _id?:string, 
            titreFr: string,
            titreEn: string,
            noteSur: number,
            totalQuestionPoints:number,
        },
        nombreParticipants: number,
        meilleureNote: number,
        pireNote: number,
        noteMoyenne: number,
        etudiants : StudentStats[]
    
        // currentPage: number;
        // totalPages: number;
        // totalItems: number;
        // pageSize : number;
    
}