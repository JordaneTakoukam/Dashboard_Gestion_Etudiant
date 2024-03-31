import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: MatiereInitialData = {
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
const matiereSlice = createSlice({
    name: "matiereSlice",
    initialState,
    reducers: {
        setMatiereLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageMatiere(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setMatieres(state, action: PayloadAction<MatiereReturnGetType>) {
            state.data = action.payload;
        },
        createMatiere(state, action: PayloadAction<CreateMatierePayload>) {
            state.data.matieres.push(action.payload.matiere);
        },
        updateMatiere(state, action: PayloadAction<UpdateMatierePayload>) {
            const { id, matiereData } = action.payload;
            const index = state.data.matieres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.matieres[index] = { ...state.data.matieres[index], ...matiereData };
            }
        },
        deleteMatiere(state, action: PayloadAction<DeleteMatierePayload>) {
            const { id } = action.payload;
            state.data.matieres = state.data.matieres.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setMatiereLoading,
    setErrorPageMatiere,
    setMatieres,
    createMatiere,
    updateMatiere,
    deleteMatiere
} = matiereSlice.actions;

// Reducer exporté
export default matiereSlice.reducer;