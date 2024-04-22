import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateEnseignant } from "./enseignant_slice";



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
            state.data.matieres.unshift(action.payload.matiere);
        },
        updateMatiere(state, action: PayloadAction<UpdateMatierePayload>) {
            const { id, matiereData } = action.payload;
            const index = state.data.matieres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.matieres[index] = { ...state.data.matieres[index], ...matiereData };
            }
            
        },
        updateChapitres(state, action: PayloadAction<UpdateChapitresPayload>) {
            const { id, chapitresData } = action.payload;
            const index = state.data.matieres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.matieres[index].chapitres = chapitresData
                
            }
        },

        updateEnseignements(state, action: PayloadAction<UpdateEnseignementsPayload>) {
            const { id, enseignementsData } = action.payload;
            const index = state.data.matieres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.matieres[index].typesEnseignement = enseignementsData
                
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
    deleteMatiere,
    updateChapitres,
    updateEnseignements
} = matiereSlice.actions;

// Reducer exporté
export default matiereSlice.reducer;