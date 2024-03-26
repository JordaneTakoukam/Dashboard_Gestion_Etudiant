import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropsUserMinState, UserState } from "../../_types/user_type";

// État initial de l'utilisateur
const initialState: UserState = {
    _id: '',
    roles: [],
    role: '',
    genre: '',
    date_creation: null,
    nom: '',
    prenom: '',
    email: '',
    section: '',
    cycle: '',
    niveau: '',
    grades: '',
    categories: '',
    fonction: '',
    service: '',
    region: '',
    departement: '',
    communes: '',
    matricule: '',
    date_naiss: null,
    date_entree: null,
    lieu_naiss: '',
    contact: '',
    photo_profil: '',
    status: '',
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
        // Mettre à jour l'utilisateur avec de nouvelles propriétés
        updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
    },
});

// Exporter les actions
export const { setUser, setMinimumUser, updateUser } = userSlice.actions;

// Exporter le reducer
export default userSlice.reducer;
