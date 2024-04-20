interface UserDiscipline {
    _id: string;
    genre: string;
    date_entree: string | null;
    date_naiss: string | null;
    nom: string;
    prenom: string | null;
    email: string;
    matricule: string | null;
    lieu_naiss: string | null;
    contact: string | null;
    photo_profil: string | null;
    status: string;
    absences: AbsenceType[] | [];
}


interface UserDisciplineIntialData {
    pageIsLoading: boolean;
    pageError: string | null;
    pageIsLoadingOnTable: boolean,
    selected: {
        user: UserDiscipline | undefined,
        semestre: string | undefined,
        annee: string | undefined,
    }
}

interface EnseignatDisciplineIntialData extends UserDisciplineIntialData {
    data: {
        enseignants: UserDiscipline[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    }
}


interface EtudiantDisciplineIntialData extends UserDisciplineIntialData {
    data: {
        etudiants: UserDiscipline[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    }
}



interface EnseignantDisciplineListGetType {
    enseignants: UserDiscipline[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}
interface EtudiantDisciplineListGetType {
    etudiants: UserDiscipline[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}



interface CustomEnseignantSelect {
    user: UserDiscipline | undefined;
    absence: AbsenceType | undefined;
}



interface CreateAbsenceType {
    userId: string,
    semestre: string,
    annee: string,
    dateAbsence: string,
    heureDebut: string,
    heureFin: string,
}