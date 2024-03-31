// Définir le type de données pour une compétence

interface Enseignement {
    id?: number;
    typeEnseignement : string;
    enseignantPrincipal?:UserState ;
    enseignantSuppleant?: UserState;
    volumeHoraire?: number;
}

interface ModeleTypeEnseignementInitialData {
    data: {
        modeletypeenseignements: Enseignement[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateModeleTypeEnseignementPayload {
    modeletypeenseignement: Enseignement; // Données de l'événement à créer
}

interface UpdateModeleTypeEnseignementPayload {
    id: string; // ID de l'événement à mettre à jour
    modeletypeenseignementData: Partial<Enseignement>; // Données mises à jour de l'événement
}

interface DeleteModeleTypeEnseignementPayload {
    id: string; // ID de l'événement à supprimer
}

interface ModeleTypeEnseignementReturnGetType {
    modeletypeenseignements: Enseignement[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}