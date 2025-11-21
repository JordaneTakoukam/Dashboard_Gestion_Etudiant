
// Définir le type de données pour un permission
interface PermissionType {
    _id?: string;
    nom: string;
    libelleFr: string;
    libelleEn: string;
    descriptionFr: string;
    descriptionEn: string;
}

interface PermissionInitialData {
    data: {
        permissions: PermissionType[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize : number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
}

interface CreatePermissionPayload {
    permission: PermissionType; // Données de l'événement à créer
}

interface UpdatePermissionPayload {
    id: string; // ID de l'événement à mettre à jour
    permissionData: Partial<PermissionType>; // Données mises à jour de l'événement
}

interface DeletePermissionPayload {
    id: string; // ID de l'événement à supprimer
}

interface PermissionReturnGetType {
    permissions: PermissionType[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize : number;
}