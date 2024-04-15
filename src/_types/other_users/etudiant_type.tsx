interface EtudiantType extends EtudiantCreateType {
    _id?: string;
    status?: string;
    historique_connexion?: Date[];
    photo_profil?: string | null;
    date_creation?: string | null;
}


interface EtudiantCreateType {
    genre: string;
    date_entree: string | null;
    date_naiss: string | null;

    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;

    lieu_naiss: string | null;
    contact: string | null;

    // fonction: string | null;
    // service: string | null;

    absences: string[];

    grade: string | null;
    categorie: string | null;
    fonction: string | null;
    service: string | null;

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

interface CreateEtudiantPayload {
    etudiant: EtudiantType; // Données de l'événement à créer
}

interface UpdateEtudiantPayload {
    id: string; // ID de l'événement à mettre à jour
    etudiantData: Partial<EtudiantType>; // Données mises à jour de l'événement
}

interface DeleteEtudiantPayload {
    id: string; // ID de l'événement à supprimer
}
interface EtudiantListGetType {
    etudiants: EtudiantType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


