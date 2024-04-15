import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: EnseignantInitialData = {
    data: {
        enseignants: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const enseignantSlice = createSlice({
    name: "enseignantSlice",
    initialState,
    reducers: {
        setEnseignantsLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEnseignant(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEnseignant(state, action: PayloadAction<EnseignantListGetType>) {
            state.data = action.payload;
        },
        createEnseignant(state, action: PayloadAction<CreateEnseignantPayload>) {
            state.data.enseignants.push(action.payload.enseignant);
        },


        updateEnseignant(state, action: PayloadAction<UpdateEnseignantPayload>) {
            const { id, enseignantData } = action.payload;
            const index = state.data.enseignants.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.enseignants[index] = { ...state.data.enseignants[index], ...enseignantData };
            }
        },
        deleteEnseignant(state, action: PayloadAction<DeleteEnseignantPayload>) {
            const { id } = action.payload;
            state.data.enseignants = state.data.enseignants.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEnseignantsLoading,
    setErrorPageEnseignant,
    setEnseignant,
    createEnseignant,
    updateEnseignant,
    deleteEnseignant
} = enseignantSlice.actions;

// Reducer exporté
export default enseignantSlice.reducer;