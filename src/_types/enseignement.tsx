// Définir le type de données pour une compétence
interface EnseignementType {
    _id?: string;
    typeEnseignement : string;
    enseignantPrincipal?:EnseignantType ;
    enseignantSuppleant?: EnseignantType;
    volumeHoraire?: number;
}

interface MatiereEnseignement {
    _id?: string;
    matiere:MatiereType;
    typeEnseignement:string;
    nombreSeance:number;
    nbSeancesPratiquees:number;
}


interface ModeleTypeEnseignementInitialData {
    data: {
        enseignements: EnseignementType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreateModeleTypeEnseignementPayload {
    modeletypeenseignement: EnseignementType; // Données de l'événement à créer
}

interface UpdateModeleTypeEnseignementPayload {
    id: string; // ID de l'événement à mettre à jour
    modeletypeenseignementData: Partial<EnseignementType>; // Données mises à jour de l'événement
}

interface DeleteModeleTypeEnseignementPayload {
    id: string; // ID de l'événement à supprimer
}

interface ModeleTypeEnseignementReturnGetType {
    modeletypeenseignements: EnseignementType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}