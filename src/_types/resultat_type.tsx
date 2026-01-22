//src/_types/resultat_type.tsx

// Type pour une note détaillée d'une matière
interface NoteDetailleeMatiereType {
    matiere: {
        _id: string;
        libelleFr: string;
        libelleEn: string;
        code: string;
    };
    coefficient: number;
    note: number;
    noteMax: number;
    noteRamenee20: number;
    appreciationFr?: string;
    appreciationEn?: string;
    absent: boolean;
    fraude: boolean;
    copieBlanche: boolean;
}

// Type pour la note de discipline
interface NoteDisciplineType {
    note: number;
    noteMax: number;
    noteRamenee20: number;
    coefficient: number;
    appreciationFr?: string;
    appreciationEn?: string;
    manquements: any[];
    bonus: any[];
}

// Type pour un résultat d'étudiant
interface ResultatEtudiantType {
    etudiant: {
        _id: string;
        nom: string;
        prenom: string;
        matricule: string;
        email?: string;
    };
    notesMatieres: NoteDetailleeMatiereType[];
    noteDiscipline: NoteDisciplineType;
    totalPoints: number;
    totalCoefficients: number;
    moyenne: number | null;
    rang: number | null;
    nombreAbsences: number;
    nombreFraudes: number;
}

// Type pour les statistiques d'évaluation
interface StatistiquesEvaluationType {
    nombreEtudiants: number;
    nombreMoyennesCalculees: number;
    moyenneClasse: number | null;
    moyenneMax: number | null;
    moyenneMin: number | null;
    nombreAdmis: number;
    nombreAjournes: number;
    tauxReussite: number | null;
}

// Type pour les infos d'évaluation dans les résultats
interface EvaluationInfoResultatType {
    _id: string;
    libelleFr: string;
    libelleEn: string;
    type: string;
    annee: number;
    semestre: number;
    dateEpreuve?: Date;
    datePublication?: Date;
    statut: string;
    noteMax: number;
    noteVerrouillees?: boolean;
    coefficientDiscipline?: number;
    matieres: {
        _id: string;
        libelleFr: string;
        libelleEn: string;
        code: string;
        coefficient: number;
    }[];
}

// Type pour les résultats détaillés complets (ADMIN)
interface ResultatsDetaillesType {
    evaluation: EvaluationInfoResultatType;
    resultats: ResultatEtudiantType[];
    statistiques: StatistiquesEvaluationType;
}

// Type pour mes résultats détaillés (ÉTUDIANT)
interface MesResultatsDetaillesType {
    evaluation: {
        _id: string;
        libelleFr: string;
        libelleEn: string;
        type: string;
        annee: number;
        semestre: number;
        dateEpreuve?: Date;
        datePublication?: Date;
        noteMax: number;
    };
    notes: NoteDetailleeMatiereType[];
    noteDiscipline?: NoteDisciplineType;
    moyenne: number | null;
    rang: number | null;
    totalEtudiants: number;
    admis: boolean;
}

// Initial state pour les résultats détaillés
interface ResultatInitialData {
    data: {
        resultatsDetailles: ResultatsDetaillesType | null;
        mesResultatsDetailles: MesResultatsDetaillesType | null;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

// Payloads pour les actions Redux
interface SetResultatsDetaillesPayload {
    resultats: ResultatsDetaillesType;
}

interface SetMesResultatsDetaillesPayload {
    resultats: MesResultatsDetaillesType;
}