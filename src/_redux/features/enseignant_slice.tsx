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
    pageIsLoadingOnTable: false,
    selected: {
        grade: undefined,
        categorie: undefined,
        service: undefined,
        fonction: undefined,
    }
};

// Création du slice
const enseignantSlice = createSlice({
    name: "enseignantSlice",
    initialState,
    reducers: {
        setEnseignantsLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setEnseignantsLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setErrorPageEnseignant(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEnseignant(state, action: PayloadAction<EnseignantListGetType>) {
            state.data = action.payload;
        },
        createEnseignant(state, action: PayloadAction<CreateEnseignantPayload>) {
            state.data.enseignants.unshift(action.payload.enseignant);
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

        // ,odifier les valeurs selectionner sur le dropdown

        setSelectedEnseignant(state, action: PayloadAction<{ key: keyof EnseignantInitialData["selected"]; value: CommonSettingProps }>) {
            const { key, value } = action.payload;
            state.selected[key] = value;
        },

        resetSelectedEnseignant(state, action: PayloadAction<(keyof EnseignantInitialData["selected"])[]>) {
            for (const prop of action.payload) {
                state.selected[prop] = undefined;
            }
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
    deleteEnseignant,
    setEnseignantsLoadingOnTable,
    setSelectedEnseignant,
    resetSelectedEnseignant,

} = enseignantSlice.actions;

// Reducer exporté
export default enseignantSlice.reducer;