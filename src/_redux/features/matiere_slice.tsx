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
    selectedMatiere:undefined,
};


// Création du slice
const matiereSlice = createSlice({
    name: "matiereSlice",
    initialState,
    reducers: {
        setMatiereSelected(state, action: PayloadAction<MatiereType>) {
            state.selectedMatiere = action.payload;
        },
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

        ajouterObjectif(state, action: PayloadAction<ObjectifType>) {
            // Ajoute l'absence à la liste des absences de l'enseignant sélectionné
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs.unshift(action.payload);
            }
        },
        modifierObjectif(state, action: PayloadAction<ObjectifType>) {
            // modifier un objectif
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs = matiere.objectifs.filter(objectif => objectif._id !== action.payload._id);
                matiere.objectifs.unshift(action.payload);
            }
        },
        // Add an action to remove absence for an enseignant by ID
        retirerObjectif(state, action: PayloadAction<{ objectifId: string }>) {
            const { objectifId} = action.payload;
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs = matiere.objectifs.filter(objectif => objectif._id !== objectifId);
            }
        }
    },
});

// Actions exportées
export const {
    setMatiereSelected,
    setMatiereLoading,
    setErrorPageMatiere,
    setMatieres,
    createMatiere,
    updateMatiere,
    deleteMatiere,
    updateChapitres,
    updateEnseignements,
    ajouterObjectif,
    modifierObjectif,
    retirerObjectif
} = matiereSlice.actions;

// Reducer exporté
export default matiereSlice.reducer;