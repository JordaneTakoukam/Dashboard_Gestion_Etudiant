import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: EtudiantInitialData = {
    data: {
        etudiants: [],
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
        createEtudiant(state, action: PayloadAction<CreateEtudiantPayload>) {
            state.data.etudiants.unshift(action.payload.etudiant);
        },


        updateEtudiant(state, action: PayloadAction<UpdateEtudiantPayload>) {
            const { id, etudiantData } = action.payload;
            const index = state.data.etudiants.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.etudiants[index] = { ...state.data.etudiants[index], ...etudiantData };
            }
        },

        updateRolesEtudiant(state, action: PayloadAction<UpdateRolesPayload>) {
            const { id, roles } = action.payload;
            const index = state.data.etudiants.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.etudiants[index].roles=roles
            }
        },
        deleteEtudiant(state, action: PayloadAction<DeleteEtudiantPayload>) {
            const { id } = action.payload;
            state.data.etudiants = state.data.etudiants.filter(e => e._id !== id);
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
    deleteEtudiant,
    updateRolesEtudiant
} = etudiantSlice.actions;

// Reducer exporté
export default etudiantSlice.reducer;