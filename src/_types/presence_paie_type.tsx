interface PresencePaieType {
    _id?: string;
    utilisateur:UserState;
    matiere?:MatiereType;
    niveau?:string;
    heureDebut?:string;
    heureFin?:string;
    annee:number;
    semestre:number;
    jour:number;
    totalHoraire?:number;
}


interface PresencePaieInitialData {
    data: {
        presencePaies: PresencePaieType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    pageIsLoadingOnTable: boolean;
}

interface CreatePresencePaiePayload {
    presencePaie: PresencePaieType; // Données de l'événement à créer
}

interface UpdatePresencePaiePayload {
    id: string; // ID de l'événement à mettre à jour
    presencePaieData: Partial<PresencePaieType>; // Données mises à jour de l'événement
}

interface DeletePresencePaiePayload {
    id: string; // ID de l'événement à supprimer
}
interface PresencePaieListGetType {
    presencePaies: PresencePaieType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}


