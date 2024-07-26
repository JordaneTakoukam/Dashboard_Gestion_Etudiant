interface NotificationType {
    //Caractéristique commune
    _id?: string;
    type: string;
    user: UserState; // ID de l'utilisateur qui a généré la notification
    role:string;
    date_creation: string; // Date de création de la notification en ISO format
    read?:boolean;
    
    //Caratéristique propre aux absences
    signalementAbsence?:SignalementAbsence;

    //Caractéristique propre aux chapitres
    chapitre?: ChapitreType; // ID du chapitre (si applicable)

    //Caratéristique propre aux objectifs
    objectif?: ObjectifType; // ID de l'objectif (si applicable)
}

interface NotificationInitial {
    data: NotificationType[];
    newNotification:boolean;
    pageIsLoading: boolean,
    pageError: string | null;
    pageIsLoadingOnTable: boolean,

}
