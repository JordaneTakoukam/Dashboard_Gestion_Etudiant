//src/_redux/features/resultat_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: ResultatInitialData = {
    data: {
        resultatsDetailles: null,
        mesResultatsDetailles: null,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const resultatSlice = createSlice({
    name: "resultatSlice",
    initialState,
    reducers: {
        setResultatLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageResultat(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setResultatsDetailles(state, action: PayloadAction<SetResultatsDetaillesPayload>) {
            state.data.resultatsDetailles = action.payload.resultats;
        },
        setMesResultatsDetailles(state, action: PayloadAction<SetMesResultatsDetaillesPayload>) {
            state.data.mesResultatsDetailles = action.payload.resultats;
        },
        clearResultats(state) {
            state.data = {
                resultatsDetailles: null,
                mesResultatsDetailles: null,
            };
        },
        // Mettre à jour la moyenne d'un étudiant spécifique
        updateMoyenneEtudiant(state, action: PayloadAction<{ etudiantId: string; moyenne: number; rang: number }>) {
            if (state.data.resultatsDetailles) {
                const { etudiantId, moyenne, rang } = action.payload;
                const index = state.data.resultatsDetailles.resultats.findIndex(
                    r => r.etudiant._id === etudiantId
                );
                if (index !== -1) {
                    state.data.resultatsDetailles.resultats[index].moyenne = moyenne;
                    state.data.resultatsDetailles.resultats[index].rang = rang;
                }
            }
        },
        // Mettre à jour les statistiques
        updateStatistiques(state, action: PayloadAction<StatistiquesEvaluationType>) {
            if (state.data.resultatsDetailles) {
                state.data.resultatsDetailles.statistiques = action.payload;
            }
        },
    },
});

// Actions exportées
export const {
    setResultatLoading,
    setErrorPageResultat,
    setResultatsDetailles,
    setMesResultatsDetailles,
    clearResultats,
    updateMoyenneEtudiant,
    updateStatistiques,
} = resultatSlice.actions;

// Reducer exporté
export default resultatSlice.reducer;