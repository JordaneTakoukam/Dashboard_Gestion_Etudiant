import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string,
    role: string;
    commune: string;
    categorie: string;
    service: string;
    grade: string;
    matricule: string | null;
    nom: string;
    prenom: string | null;
    genre: string;
    dateNaiss: string | null;
    lieuNaiss: string | null;
    contact: string | null;
    email: string;
}

export interface PropsUserState {
    id: string,
    role: string;
    commune: string;
    categorie: string;
    service: string;
    grade: string;
    matricule: string | null;
    nom: string;
    prenom: string | null;
    genre: string;
    dateNaiss: string | null;
    lieuNaiss: string | null;
    contact: string | null;
    email: string;
}

const initialState: UserState = {
    id: '',
    role: '',
    commune: '',
    categorie: '',
    service: '',
    grade: '',
    matricule: null,
    nom: '',
    prenom: null,
    genre: '',
    dateNaiss: null,
    lieuNaiss: '',
    contact: '',
    email: '',
};

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<PropsUserState>) => {
            state.id = action.payload.id;
            state.role = action.payload.role;
            state.commune = action.payload.commune;
            state.categorie = action.payload.categorie;
            state.service = action.payload.service;
            state.grade = action.payload.grade;
            state.matricule = action.payload.matricule;
            state.nom = action.payload.nom;
            state.prenom = action.payload.prenom;
            state.genre = action.payload.genre;
            state.dateNaiss = action.payload.dateNaiss;
            state.lieuNaiss = action.payload.lieuNaiss;
            state.contact = action.payload.contact;
            state.email = action.payload.email;
        },
    },
});

export const {
    setUser,
} = userSlice.actions;

export default userSlice.reducer;
