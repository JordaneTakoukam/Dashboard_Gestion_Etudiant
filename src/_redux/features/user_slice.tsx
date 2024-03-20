import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropsUserMinState, UserState } from "../../_types/user_type";


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
