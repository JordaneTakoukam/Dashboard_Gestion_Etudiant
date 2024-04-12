import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: EnseignantInitialData = {
    data: {
        list: [],
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
        createEnseignant(state, action: PayloadAction<EnseignantType>) {
            state.data.list.push(action.payload);
        },


        updateEnseignant(state, action: PayloadAction<{ newEnseignant: EnseignantType }>) {
            const { newEnseignant } = action.payload;

            const index = state.data.list.findIndex(enseignant => enseignant._id === newEnseignant._id);

            if (index !== -1) {
                state.data.list[index] = { ...state.data.list[index], ...newEnseignant };
            }
        },


        deleteEnseignant(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload;
            state.data.list = state.data.list.filter(e => e._id !== id);
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