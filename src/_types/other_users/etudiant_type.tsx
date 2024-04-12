interface EtudiantType extends EtudiantCreateType {
    _id: string;
    status?: string;
    historique_connexion?: Date[];
    photo_profil?: string | null;
    date_creation?: String | null;
}


interface EtudiantCreateType {
    genre: string;
    date_entree: String | null;
    date_naiss: String | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;

    // fonction: string | null;
    // service: string | null;

    abscence: string | null;

    grade: string | null;
    categorie: string | null;

    region: string | null;
    departement: string | null;
    commune: string | null;

    section: string | null;
    cycle: string | null;
    niveau: string | null;
}


interface EtudiantInitialData {
    data: {
        list: EtudiantType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}


interface EtudiantListGetType {
    list: EtudiantType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


