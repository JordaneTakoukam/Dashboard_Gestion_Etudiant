// Définir le type de données pour la période de cours

interface AbsenceType {
    _id: string,
    dateCreation?: Date,
    semestre: Number,
    annee: Number,
    dateAbsence: Date,
    heureDebut: string,
    heureFin: string,
}

// interface AbsenceInitialData {
//     data: {
//         absences: AbsenceType[];
//         currentPage: number;
//         totalPages: number;
//         totalItems: number;
//         pageSize : number;
//     };
//     pageIsLoading: boolean;
//     pageError: string | null;
// }

// interface CreateAbsencePayload {
//     absence: AbsenceType; // Données de l'événement à créer
// }

// interface UpdateAbsencePayload {
//     id: string; // ID de l'événement à mettre à jour
//     absenceData: Partial<AbsenceType>; // Données mises à jour de l'événement
// }

// interface DeleteAbsencePayload {
//     id: string; // ID de l'événement à supprimer
// }

// interface AbsenceReturnGetType {
//     absences: AbsenceType[];
//     currentPage: number;
//     totalItems: number;
//     totalPages: number;
//     pageSize : number;
// }