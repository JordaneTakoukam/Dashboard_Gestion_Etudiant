interface AdminType extends AdminCreateType {
    _id: string;
    status: string;
    historique_connexion: Date[];
    photo_profil: string | null;
    date_creation: String | null;
}

interface AdminUpdateType extends AdminCreateType {
    _id: string;
}

interface AdminCreateType {
    genre: string;
    date_entree: String | null;
    date_naiss: String | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;

    grade: string | null;
    categorie: string | null;
    fonction: string | null;
    service: string | null;
    region: string | null;
    departement: string | null;
    commune: string | null;
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


interface AdminListGetType {
    list: AdminType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


