interface SignalementAbsence {
    _id?: string;
    user: UserState;
    enseignant?:UserState | EnseignantType;
    role: string;
    heure_debut_absence: string;
    heure_fin_absence: string;
    jour_absence: number;
    date_absence_signaler?: string;
    semestre: number;
    annee: number;
    niveau: string;
    date_creation?: string;

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
    newAbsence:boolean;
    pageIsLoading: boolean,
    pageError: string | null;
    pageIsLoadingOnTable: boolean,

}
