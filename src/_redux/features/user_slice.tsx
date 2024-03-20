import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface pour l'absence
interface Absence {
    date_abs: Date | null;
    heure_debut: string | null;
    heure_fin: string | null;
    semestre: string | null;
    annee: string | null;
}

// Interface pour l'état de l'utilisateur
interface UserState {
    _id: string;
    role: string;
    genre: string;
    date_creation: Date | null;
    nom: string;
    prenom: string | null;
    email: string;
    mot_de_passe: string;
    id_commune: string | null;
    id_categorie: string | null;
    id_service: string | null;
    id_grade: string | null;
    matricule: string | null;
    date_naiss: Date | null;
    lieu_naiss: string | null;
    contact: string | null;
    status: string;
    abscences: Absence[];
    historique_connexion: Date[];
}

// Interface pour les propriétés minimales de l'utilisateur
export interface PropsUserMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}

// État initial de l'utilisateur
const initialState: UserState = {
    _id: '',
    role: '',
    genre: '',
    date_creation: null,
    nom: '',
    prenom: null,
    email: '',
    mot_de_passe: '',
    id_commune: null,
    id_categorie: null,
    id_service: null,
    id_grade: null,
    matricule: null,
    date_naiss: null,
    lieu_naiss: null,
    contact: null,
    status: 'actif',
    abscences: [],
    historique_connexion: [],
};

// Création du Slice pour l'utilisateur
export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        // Définir l'utilisateur complet
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        // Définir l'utilisateur avec des propriétés minimales
        setMinimumUser: (state, action: PayloadAction<PropsUserMinState>) => {
            state._id = action.payload._id;
            state.role = action.payload.role;
            state.nom = action.payload.nom;
            state.prenom = action.payload.prenom;
        },
    },
});

// Exporter les actions
export const { setUser, setMinimumUser } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
