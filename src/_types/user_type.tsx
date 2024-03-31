interface UserState {
    _id: string;
    roles: string[];
    role: string;
    genre: string;
    date_creation: Date | null;
    date_entree: Date | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;
    date_naiss: Date | null;
    lieu_naiss: string | null;
    contact: string | null;
    status: string;
    abscences: Absence[];
    historique_connexion: Date[];
    photo_profil: string | null;

    section: string | null;
    cycle: string | null;
    niveau: string | null;
    grades: string | null;
    categories: string | null;
    fonction: string | null;
    service: string | null;
    region: string | null;
    departement: string | null;
    communes: string | null;

}

interface Absence {
    date_abscence: Date | null;
    heure_debut: string | null;
    heure_fin: string | null;
    semestre: string | null;
    annee: string | null;
}


interface UserReturnGetType {
    users: UserState[];
}

// Interface pour les propriétés minimales de l'utilisateur
interface PropsUserMinState {
    _id: string;
    roles: string[];
    role: string;
    nom: string;
    prenom: string | null;

}