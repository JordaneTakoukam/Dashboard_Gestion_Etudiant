interface EnseignantType extends EnseignantCreateType {
    _id: string;
    status?: string;
    historique_connexion?: Date[];
    photo_profil?: string | null;
    date_creation?: String | null;
}


interface EnseignantCreateType {
    genre: string;
    date_entree: String | null;
    date_naiss: String | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;

    absce: string | null;
    grade: string | null;
    categorie: string | null;
    fonction: string | null;
    service: string | null;
    region: string | null;
    departement: string | null;
    commune: string | null;
}


interface EnseignantInitialData {
    data: {
        list: EnseignantType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    }; pageIsLoading: boolean;
    pageError: string | null;
}


interface EnseignantListGetType {
    list: EnseignantType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


