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

    abscences: string[];

    grade: string | null;
    categorie: string | null;

    commune: string | null;

    niveaux: [
        {
            niveau:string,
            annee:number
        }
    ]
}


interface EtudiantInitialData {
    data: {
        etudiants: EtudiantType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}


interface EtudiantListGetType {
    etudiants: EtudiantType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


