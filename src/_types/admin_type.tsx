interface AdminType {
    _id: string;

    genre: string;
    date_creation: Date | null;
    date_entree: Date | null;
    date_naiss: Date | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;
    status: string;
    historique_connexion: Date[];
    photo_profil: string | null;


    grades: string | null;
    categories: string | null;
    fonction: string | null;
    service: string | null;
    region: string | null;
    departement: string | null;
    communes: string | null;
}


interface AdminInitialData {
    data: {
        list: AdminType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    }; pageIsLoading: boolean;
    pageError: string | null;
}


interface AdminReturnGetType {
    list: AdminType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}