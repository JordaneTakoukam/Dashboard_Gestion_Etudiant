import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    _id: string;
    role: string;
    genre: string;
    date_creation: Date;
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
    abscences: Abscence[];
    historique_connexion: Date[];
}

interface Abscence {
    date_abs: Date | null;
    heure_debut: string | null;
    heure_fin: string | null;
    semestre: string | null;
    annee: string | null;
}


export interface PropsUserMinState {
    _id: string;
    role: string;
    nom: string;
    prenom: string | null;
}
const initialState: UserState = {
    _id: '',
    role: '',
    genre: '',
    date_creation: new Date(),
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



export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        setMinimumUser: (state, action: PayloadAction<PropsUserMinState>) => {
            state._id = action.payload._id;
            state.role = action.payload.role;
            state.nom = action.payload.nom;
            state.prenom = action.payload.prenom;
        },
    },
});

export const { setUser, setMinimumUser } = userSlice.actions;

export default userSlice.reducer;
