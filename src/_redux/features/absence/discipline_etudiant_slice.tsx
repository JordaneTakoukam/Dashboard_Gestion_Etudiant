// Import necessary modules
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
const initialState: EtudiantDisciplineIntialData = {
    data: {
        etudiants: [],
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
const etudiantDisciplineSlice = createSlice({
    name: "etudiantDisciplineSlice",
    initialState,
    reducers: {
        // Define the reducer to set the user
        setEtudiantselected(state, action: PayloadAction<UserDiscipline>) {
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
        setEtudiantsDisciplineLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setEtudiantsDisciplineLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setErrorPageEtudiantDiscipline(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEtudiantDiscipline(state, action: PayloadAction<EtudiantDisciplineListGetType>) {
            state.data = action.payload;
        },

        ajouterAbsenceEtudiant(state, action: PayloadAction<AbsenceType>) {
            // Ajoute l'absence à la liste des absences de l'etudiant sélectionné
            const etudiant = state.selected.user;
            if (etudiant) {
                etudiant.absences.unshift(action.payload);
            }
        },

        modifierAbsenceEtudiant(state, action: PayloadAction<AbsenceType>) {
    
            const etudiant = state.selected.user;
            if (etudiant && etudiant.absences) {
                etudiant.absences = etudiant.absences.filter(absence => absence._id !== action.payload._id);
                etudiant.absences.unshift(action.payload);
            }
        },
        // Add an action to remove absence for an etudiant by ID
        retirerAbsenceEtudiant(state, action: PayloadAction<{ absenceId: string }>) {
            const { absenceId } = action.payload;
            const etudiant = state.selected.user;
            if (etudiant) {
                etudiant.absences = etudiant.absences.filter(absence => absence._id !== absenceId);
            }
        }

    },
});

// Export the actions
export const {
    setEtudiantselected,
    setEtudiantsDisciplineLoading,
    setErrorPageEtudiantDiscipline,
    setEtudiantDiscipline,
    setEtudiantsDisciplineLoadingOnTable,

    setSemestreDisciplineEns,
    setAnneeDisciplineEns,
    ajouterAbsenceEtudiant,
    modifierAbsenceEtudiant,
    retirerAbsenceEtudiant
} = etudiantDisciplineSlice.actions;

;

// Export the reducer
export default etudiantDisciplineSlice.reducer;
