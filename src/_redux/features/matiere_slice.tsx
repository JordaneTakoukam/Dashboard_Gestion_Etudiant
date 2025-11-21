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
        setPage(state){
            state.data.pageSize +=1;
            state.data.totalItems+=1;
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

        // updateEnseignements(state, action: PayloadAction<UpdateEnseignementsPayload>) {
        //     const { id, enseignementsData } = action.payload;
        //     const index = state.data.matieres.findIndex(e => e._id === id);
        //     if (index !== -1) {
        //         state.data.matieres[index].typesEnseignement = enseignementsData
                
        //     }
        // },
        deleteMatiere(state, action: PayloadAction<DeleteMatierePayload>) {
            const { id } = action.payload;
            state.data.matieres = state.data.matieres.filter(e => e._id !== id);
        },

        //Gérer les chapitres de la matière
        ajouterChapitre(state, action: PayloadAction<ChapitreType>) {
            const matiere = state.selectedMatiere;
            if (matiere && matiere.chapitres) {
                matiere.chapitres.unshift(action.payload);
            }
        },
        modifierChapitre(state, action: PayloadAction<ChapitreType>) {
            
            const matiere = state.selectedMatiere;
            if (matiere && matiere.chapitres) {
                matiere.chapitres = matiere.chapitres.filter(chapitre => chapitre._id !== action.payload._id);
                matiere.chapitres.unshift(action.payload);
            }
        },
        
        retirerChapitre(state, action: PayloadAction<{ chapitreId: string }>) {
            const { chapitreId} = action.payload;
            const matiere = state.selectedMatiere;
            if (matiere && matiere.chapitres) {
                matiere.chapitres = matiere.chapitres.filter(chapitre => chapitre._id !== chapitreId);
            }
        },

        //Gérer les objectifs de la matière
        ajouterObjectif(state, action: PayloadAction<ObjectifType>) {
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs.unshift(action.payload);
            }
        },
        modifierObjectif(state, action: PayloadAction<ObjectifType>) {
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs = matiere.objectifs.filter(objectif => objectif._id !== action.payload._id);
                matiere.objectifs.unshift(action.payload);
            }
        },
        
        retirerObjectif(state, action: PayloadAction<{ objectifId: string }>) {
            const { objectifId} = action.payload;
            const matiere = state.selectedMatiere;
            if (matiere && matiere.objectifs) {
                matiere.objectifs = matiere.objectifs.filter(objectif => objectif._id !== objectifId);
            }
        },

        //Gérer les enseignements de la matières
        ajouterEnseignement(state, action: PayloadAction<string>) {
            
            const matiere = state.selectedMatiere;
            if (matiere && matiere.typesEnseignement) {
                matiere.typesEnseignement.unshift(action.payload);
            }
        },
        modifierEnseignement(state, action: PayloadAction<MatiereType>) {
            // modifier un enseignement
            // const matiere = state.selectedMatiere;
            // if (matiere && matiere.typesEnseignement) {
            //     matiere.typesEnseignement = matiere.typesEnseignement.filter(enseignement => enseignement._id !== action.payload._id);
            //     matiere.typesEnseignement.unshift(action.payload);
            // }
            state.selectedMatiere = action.payload;
        },
        
        retirerEnseignement(state, action: PayloadAction<{ enseignementId: string }>) {
            const { enseignementId} = action.payload;
            const matiere = state.selectedMatiere;
            if (matiere && matiere.typesEnseignement) {
                matiere.typesEnseignement = matiere.typesEnseignement.filter(enseignement => enseignement !== enseignementId);
            }
        }
    },
});

// Actions exportées
export const {
    setMatiereSelected,
    setPage,
    setMatiereLoading,
    setErrorPageMatiere,
    setMatieres,
    createMatiere,
    updateMatiere,
    deleteMatiere,
    updateChapitres,
    // updateEnseignements,
    ajouterChapitre,
    modifierChapitre,
    retirerChapitre,
    ajouterObjectif,
    modifierObjectif,
    retirerObjectif,
    ajouterEnseignement,
    modifierEnseignement,
    retirerEnseignement
} = matiereSlice.actions;

// Reducer exporté
export default matiereSlice.reducer;