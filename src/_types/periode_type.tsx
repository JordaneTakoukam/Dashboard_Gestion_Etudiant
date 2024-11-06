// Définir le type de données pour la période de cours
interface PeriodeType {
    _id?: string;  // ID optionnel (il sera fourni après la création dans la base de données)
    pause: boolean;  // Indique si la période est une pause
    jour: number;  // Jour de la semaine (1=Lundi, 2=Mardi, ...)
    semestre: number;  // Semestre de l'année académique
    annee: number;  // Année académique
    niveau: string;  // Niveau d'étude (ID ou nom, selon le backend)
    heureDebut: string;  // Heure de début de la période
    heureFin: string;  // Heure de fin de la période
    enseignements?: {
        matiere: MatiereType;  // Type de la matière (défini ailleurs)
        enseignantPrincipal: EnseignantType;  // Enseignant principal (défini ailleurs)
        enseignantSuppleant?: EnseignantType;  // Enseignant suppléant (facultatif)
        salleCours: string;  // ID de la salle de cours (ou référence selon la logique de votre backend)
        typeEnseignement: string;  // Type d'enseignement (référence à un modèle ou code)
    }[];
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