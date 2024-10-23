// Définir le type de données pour la période de cours
interface PeriodeType {
    _id?: string,
    pause:boolean,
    jour:number,
    semestre:number,
    annee:number,
    niveau:string,
    matieres?:MatiereType[],
    typesEnseignements?:string[],
    heureDebut:string,
    heureFin:string,
    sallesCours?:string[],
    enseignantsPrincipaux?: EnseignantType[],
    enseignantsSuppleants?: EnseignantType[],
}

interface PeriodeInitialData {
    data: {
        periodes: PeriodeType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreatePeriodePayload {
    periode: PeriodeType; // Données de l'événement à créer
}

interface UpdatePeriodePayload {
    id: string; // ID de l'événement à mettre à jour
    periodeData: Partial<PeriodeType>; // Données mises à jour de l'événement
}

interface DeletePeriodePayload {
    id: string; // ID de l'événement à supprimer
}

interface PeriodeReturnGetType {
    periodes: PeriodeType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}