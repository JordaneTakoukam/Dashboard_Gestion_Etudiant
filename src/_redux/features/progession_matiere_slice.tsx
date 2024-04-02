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
        updateMatiere(state, action: PayloadAction<UpdateMatierePayload>) {
            const { id, matiereData } = action.payload;
            const index = state.data.matieres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.matieres[index] = { ...state.data.matieres[index], ...matiereData };
            }
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
    updateMatiere,
} = progressionMatiereSlice.actions;

// Reducer exporté
export default progressionMatiereSlice.reducer;