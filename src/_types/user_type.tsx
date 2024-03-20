// Interface pour l'absence
export interface Absence {
    date_abs: Date | null;
    heure_debut: string | null;
    heure_fin: string | null;
    semestre: string | null;
    annee: string | null;
}

// Interface pour l'état de l'utilisateur
export interface UserState {
    _id: string;
    role: string;
    genre: string;
    date_creation: Date | null;
    nom: string;
    prenom: string | null;
    email: string;
    mot_de_passe: string;
    id_commune: string | null;
    id_categorie: string | null;
    id_service: string | null;
    id_grade: string | null;
    matricule: string | null;
    date_naiss: Date | null;
    lieu_naiss: string | null;
    contact: string | null;
    status: string;
    abscences: Absence[];
    historique_connexion: Date[];
}

// Interface pour les propriétés minimales de l'utilisateur
export interface PropsUserMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}