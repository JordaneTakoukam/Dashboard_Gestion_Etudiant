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
        setSemestreDisciplineEns(state, action: PayloadAction<number>) {
            state.selected.semestre = action.payload;
        },
        // Define a reducer to set the year
        setAnneeDisciplineEns(state, action: PayloadAction<number>) {
            state.selected.annee = action.payload;
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

        ajouterAbsenceEnseignant(state, action: PayloadAction<AbsenceType>) {
            // Ajoute l'absence à la liste des absences de l'enseignant sélectionné
            const enseignant = state.selected.user;
            if (enseignant) {
                enseignant.absences.unshift(action.payload);
            }
        },

        modifierAbsenceEnseignant(state, action: PayloadAction<AbsenceType>) {
    
            const enseignant = state.selected.user;
            console.log(enseignant)
            if (enseignant && enseignant.absences) {
                enseignant.absences = enseignant.absences.filter(absence => absence._id !== action.payload._id);
                enseignant.absences.unshift(action.payload);
            }
        },
        // Add an action to remove absence for an enseignant by ID
        retirerAbsenceEnseignant(state, action: PayloadAction<{ absenceId: string }>) {
            const { absenceId } = action.payload;
            const enseignant = state.selected.user;
            if (enseignant) {
                enseignant.absences = enseignant.absences.filter(absence => absence._id !== absenceId);
            }
        }

    },
});

// Export the actions
export const {
    setEnseignantSelected,
    setEnseignantsDisciplineLoading,
    setErrorPageEnseignantDiscipline,
    setEnseignantDiscipline,
    setEnseignantsDisciplineLoadingOnTable,

    setSemestreDisciplineEns,
    setAnneeDisciplineEns,
    ajouterAbsenceEnseignant,
    modifierAbsenceEnseignant,
    retirerAbsenceEnseignant
} = disciplineEnseignantSlice.actions;

;

// Export the reducer
export default disciplineEnseignantSlice.reducer;
