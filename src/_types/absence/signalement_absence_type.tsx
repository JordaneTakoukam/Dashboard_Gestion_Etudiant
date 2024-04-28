interface SignalementAbsence {
    _id?: string,
    nom: string,
    prenom: string,
    userId: string,
    motif: string,
    description: string,
    dateAbsence: string,
    date_creation: string,

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
