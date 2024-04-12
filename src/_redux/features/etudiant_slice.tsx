import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: EtudiantInitialData = {
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
const etudiantSlice = createSlice({
    name: "etudiantSlice",
    initialState,
    reducers: {
        setEtudiantsLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEtudiant(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEtudiant(state, action: PayloadAction<EtudiantListGetType>) {
            state.data = action.payload;
        },
        createEtudiant(state, action: PayloadAction<EtudiantType>) {
            state.data.list.push(action.payload);
        },


        updateEtudiant(state, action: PayloadAction<{ newEtudiant: EtudiantType }>) {
            const { newEtudiant } = action.payload;

            const index = state.data.list.findIndex(etudiant => etudiant._id === newEtudiant._id);

            if (index !== -1) {
                state.data.list[index] = { ...state.data.list[index], ...newEtudiant };
            }
        },


        deleteEtudiant(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload;
            state.data.list = state.data.list.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEtudiantsLoading,
    setErrorPageEtudiant,
    setEtudiant,
    createEtudiant,
    updateEtudiant,
    deleteEtudiant
} = etudiantSlice.actions;

// Reducer exporté
export default etudiantSlice.reducer;