interface SupportDeCoursType {
    _id?: string;
    titre_fr:string;
    titre_en:string,
    description_fr?:string;
    description_en?:string;
    fichier:string;
    type:number;//0 (support enseignant), 1 (support étudiant)
    utilisateur:UserState;
    niveau:string;
    annee:number;
    dateAjout:string;
    size:number;

}


interface SupportDeCoursInitialData {
    data: {
        supportsDeCours: SupportDeCoursType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    pageIsLoadingOnTable: boolean;
}

interface CreateSupportDeCoursPayload {
    supportDeCours: SupportDeCoursType; // Données de l'événement à créer
}

interface UpdateSupportDeCoursPayload {
    id: string; // ID de l'événement à mettre à jour
    supportDeCoursData: Partial<SupportDeCoursType>; // Données mises à jour de l'événement
}

interface DeleteSupportDeCoursPayload {
    id: string; // ID de l'événement à supprimer
}

interface SupportDeCoursListGetType {
    supportsDeCours: SupportDeCoursType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
}