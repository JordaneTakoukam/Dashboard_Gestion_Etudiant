import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ProgressionMatiereInitialData = {
    data: {
        matieres: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};


// Création du slice
const progressionMatiereSlice = createSlice({
    name: "progressionMatiereSlice",
    initialState,
    reducers: {
        setMatiereLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageMatiere(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setMatieres(state, action: PayloadAction<ProgressionMatiereReturnGetType>) {
            state.data = action.payload;
        },
        
    },
});

// Actions exportées
export const {
    setMatiereLoading,
    setErrorPageMatiere,
    setMatieres,
} = progressionMatiereSlice.actions;

// Reducer exporté
export default progressionMatiereSlice.reducer;