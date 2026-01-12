//src/_types/evaluation_type.tsx

// Type pour les matières incluses dans une évaluation
interface EvaluationMatiereType {
    matiere: MatiereType|undefined; // ID de la matière
    coefficient: number;
}

// Type pour une évaluation
interface EvaluationType {
    _id?: string;
    libelleFr: string;
    libelleEn: string;
    descriptionFr?: string;
    descriptionEn?: string;
    type: 'CONTROLE_CONTINU' | 'EXAMEN_PARTIEL' | 'EXAMEN_FINAL' | 'SESSION_RATTRAPAGE' | 'AUTRE';
    niveau: string; // ID du niveau
    annee: number;
    semestre: number;
    matieres: EvaluationMatiereType[];
    dateCreation?: Date;
    dateEpreuve?: Date;
    dateLimiteSaisie?: Date;
    dateDeliberation?: Date;
    datePublication?: Date;
    statut: 'BROUILLON' | 'PROGRAMMEE' | 'EN_COURS' | 'CORRECTION' | 'DELIBERATION' | 'PUBLIEE' | 'VERROUILEE';
    anonymatsGeneres: boolean;
    dateGenerationAnonymats?: Date;
    notesVerrouillees: boolean;
    dateVerrouillage?: Date;
    verrouillePar?: string;
    creePar: string;
    noteMax: number;
    noteMin: number;
    
}

// Type pour un anonymat
interface AnonymatType {
    _id?: string;
    evaluation: string; // ID de l'évaluation
    etudiant: EtudiantType; // ID de l'étudiant (confidentiel)
    numeroAnonymat: string;
    niveau: string;
    dateGeneration?: Date;
    statut: 'ACTIF' | 'UTILISE' | 'ANNULE';
    utilise: boolean;
    invalide: boolean;
    raisonInvalidation?: string;
}

// Type pour une note
interface NoteType {
    _id?: string;
    evaluation: string; // ID de l'évaluation
    matiere: string; // ID de la matière
    anonymat: string; // ID de l'anonymat
    etudiant?: string; // ID de l'étudiant (rempli après délibération)
    note: number;
    noteMax: number;
    appreciationFr?: string;
    appreciationEn?: string;
    saisiePar: string; // ID de l'enseignant
    dateSaisie?: Date;
    dateModification?: Date;
    modifiePar?: string;
    statut: 'BROUILLON' | 'SAISIE' | 'VALIDEE' | 'PUBLIEE' | 'VERROUILLEE';
    validee: boolean;
    dateValidation?: Date;
    valideePar?: string;
    publiee: boolean;
    datePublication?: Date;
    verrouillee: boolean;
    dateVerrouillage?: Date;
    absent: boolean;
    fraude: boolean;
    detailsFraude?: string;
    copieBlanche: boolean;
}

// Type pour un coefficient
interface CoefficientMatiereType {
    _id?: string;
    matiere: MatiereType;
    niveau: string;
    annee: number;
    semestre: number;
    coefficient: number;
    dateCreation?: Date;
    dateModification?: Date;
    modifiePar?: string;
}

// Type pour les informations de semestre
interface SemestreInfoType {
    niveauId: string;
    niveauCode: string;
    semestresAutorises: number[];
    description: string;
}

// Initial state pour les évaluations
interface EvaluationInitialData {
    data: {
        evaluations: EvaluationType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedEvaluation: EvaluationType | undefined;
}

// Initial state pour les anonymats
interface AnonymatInitialData {
    data: {
        anonymats: AnonymatType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

// Initial state pour les notes
interface NoteInitialData {
    data: {
        notes: NoteType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedNote: NoteType | undefined;
}

// Initial state pour les coefficients
interface CoefficientInitialData {
    data: {
        coefficients: CoefficientMatiereType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

// Payloads pour les actions Redux
interface CreateEvaluationPayload {
    evaluation: EvaluationType;
}

interface UpdateEvaluationPayload {
    id: string;
    evaluationData: Partial<EvaluationType>;
}

interface DeleteEvaluationPayload {
    id: string;
}

interface CreateNotePayload {
    note: NoteType;
}

interface UpdateNotePayload {
    id: string;
    noteData: Partial<NoteType>;
}

interface CreateCoefficientPayload {
    coefficient: CoefficientMatiereType;
}

interface UpdateCoefficientPayload {
    id: string;
    coefficientData: Partial<CoefficientMatiereType>;
}

// Return types pour les API
interface EvaluationReturnGetType {
    evaluations: EvaluationType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface AnonymatReturnGetType {
    anonymats: AnonymatType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface NoteReturnGetType {
    notes: NoteType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface CoefficientReturnGetType {
    coefficients: CoefficientMatiereType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Type pour les moyennes
interface MoyenneEtudiantType {
    etudiant: {
        _id: string;
        nom: string;
        prenom: string;
        matricule: string;
    };
    moyenne: number | null;
}

// Type pour la validation niveau-semestre
interface ValidationNiveauSemestreType {
    valide: boolean;
    niveau: {
        _id: string;
        code: string;
    };
    semestreDemande: number;
    semestresAutorises: number[];
    message: string;
}