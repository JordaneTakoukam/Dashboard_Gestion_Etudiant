interface SignalementAbsence {
    _id?: string;
    nom: string;
    prenom: string;
    userId: string;
    motif: string;
    titre: string;
    role: string;
    description: string;
    date_creation: string;
    date_debut_absence: string;
    date_fin_absence: string;
}


// interface SignalementAbsenceGet {
//     list: SignalementAbsence[];
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     pageSize: number;
// }



interface SignalementAbsenceInitial {
    data: SignalementAbsence[];
    pageIsLoading: boolean,
    pageError: string | null;
    pageIsLoadingOnTable: boolean,

}
