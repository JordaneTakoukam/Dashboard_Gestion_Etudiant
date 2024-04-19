import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: EnseignatDisciplineIntialData = {
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
        semestre: undefined,
        annee: undefined,
    }
};

// Création du slice
const disciplineEnseignantSlice = createSlice({
    name: "disciplineEnseignantSlice",
    initialState,
    reducers: {
        setEnseignantsDisciplineLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setEnseignantsDisciplineLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setErrorPageEnseignantDiscipline(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEnseignantDiscipline(state, action: PayloadAction<EnseignantDisciplineListGetType>) {
            state.data = action.payload;
        },
    },
});

// Actions exportées
export const {
    setEnseignantsDisciplineLoading,
    setErrorPageEnseignantDiscipline,
    setEnseignantDiscipline,
    setEnseignantsDisciplineLoadingOnTable,
} = disciplineEnseignantSlice.actions;

// Reducer exporté
export default disciplineEnseignantSlice.reducer;