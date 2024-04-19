// Import necessary modules
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
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
        user: undefined,
        semestre: undefined,
        annee: undefined,
    }
};

// Create the slice
const disciplineEnseignantSlice = createSlice({
    name: "disciplineEnseignantSlice",
    initialState,
    reducers: {
        // Define the reducer to set the user
        setEnseignantSelected(state, action: PayloadAction<UserDiscipline>) {
            state.selected.user = action.payload;
        },
        // Add other reducers if needed
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

// Export the actions
export const {
    setEnseignantSelected,
    setEnseignantsDisciplineLoading,
    setErrorPageEnseignantDiscipline,
    setEnseignantDiscipline,
    setEnseignantsDisciplineLoadingOnTable,
} = disciplineEnseignantSlice.actions;

// Export the reducer
export default disciplineEnseignantSlice.reducer;
