// src/_types/discipline_type.tsx

// Type pour une note de discipline
interface DisciplineType {
    _id?: string;
    evaluation: string; // ID de l'évaluation
    etudiant: EtudiantType; // L'étudiant (pas d'anonymat)
    note: number;
    noteMax: number;
    appreciationFr?: string;
    appreciationEn?: string;
    manquements?: ManquementType[];
    bonus?: BonusType[];
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
    historique?: HistoriqueModificationType[];
}

// Type pour les manquements
interface ManquementType {
    type: 'RETARD' | 'ABSENCE_INJUSTIFIEE' | 'TENUE_INCORRECTE' | 
          'COMPORTEMENT_INAPPROPRIE' | 'NON_RESPECT_REGLEMENT' | 
          'PERTURBATION_COURS' | 'FRAUDE' | 'AUTRE';
    description?: string;
    date?: Date;
    pointsRetires: number;
}

// Type pour les bonus
interface BonusType {
    motif?: string;
    description?: string;
    date?: Date;
    pointsAjoutes: number;
}

// Type pour l'historique
interface HistoriqueModificationType {
    ancienneNote: number;
    nouvelleNote: number;
    modifiePar: string;
    dateModification: Date;
    raison?: string;
}

// Type pour le coefficient de discipline
interface CoefficientDisciplineType {
    _id?: string;
    niveau: string; // ID du niveau
    annee: number;
    semestre: number;
    coefficient: number;
    dateCreation?: Date;
    dateModification?: Date;
    modifiePar?: string;
}

// Initial state pour les disciplines
interface DisciplineInitialData {
    data: {
        disciplines: DisciplineType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedDiscipline: DisciplineType | undefined;
}

// Initial state pour les coefficients de discipline
interface CoefficientDisciplineInitialData {
    data: {
        coefficients: CoefficientDisciplineType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

// Payloads pour les actions Redux
interface CreateDisciplinePayload {
    discipline: DisciplineType;
}

interface UpdateDisciplinePayload {
    id: string;
    disciplineData: Partial<DisciplineType>;
}

interface CreateCoefficientDisciplinePayload {
    coefficient: CoefficientDisciplineType;
}

interface UpdateCoefficientDisciplinePayload {
    id: string;
    coefficientData: Partial<CoefficientDisciplineType>;
}

// Return types pour les API
interface DisciplineReturnGetType {
    disciplines: DisciplineType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

interface CoefficientDisciplineReturnGetType {
    coefficients: CoefficientDisciplineType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}

// Type pour les étudiants avec statut de note de discipline
interface EtudiantAvecStatutDisciplineType {
    _id: string;
    nom: string;
    prenom: string;
    matricule: string;
    email: string;
    aNoteDisc: boolean; // A déjà une note de discipline
}

// Type pour la réponse des étudiants
interface EtudiantsForDisciplineReturnType {
    etudiants: EtudiantAvecStatutDisciplineType[];
    total: number;
    avecNote: number;
    sansNote: number;
}