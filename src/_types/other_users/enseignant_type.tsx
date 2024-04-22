interface EnseignantType extends EnseignantCreateType {
    _id?: string;
    status?: string;
    historique_connexion?: Date[];
    photo_profil?: string | null;
    date_creation?: string | null;
}




interface EnseignantCreateType {
    genre: string;
    date_entree: string | null;
    date_naiss: string | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;

    photo_profil?: string | null;

    // fonction: string | null;
    // service: string | null;

    absences: string[];

    grade: string | null;
    categorie: string | null;
    fonction: string | null;
    service: string | null;

    commune: string | null;

    niveaux: InscriptionType[];
}

interface InscriptionType {
    niveau: string,
    annee: number
}


interface EnseignantInitialData {
    data: {
        enseignants: EnseignantType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    pageIsLoadingOnTable: boolean,
    selected: {
        grade: CommonSettingProps | undefined,
        categorie: CommonSettingProps | undefined,
        service: CommonSettingProps | undefined,
        fonction: CommonSettingProps | undefined,
    }
}

interface CreateEnseignantPayload {
    enseignant: EnseignantType; // Données de l'événement à créer
}

interface UpdateEnseignantPayload {
    id: string; // ID de l'événement à mettre à jour
    enseignantData: Partial<EnseignantType>; // Données mises à jour de l'événement
}

interface DeleteEnseignantPayload {
    id: string; // ID de l'événement à supprimer
}
interface EnseignantListGetType {
    enseignants: EnseignantType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


