import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: PeriodeEnseignementInitialData = {
    data: {
        periodes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedPeriode:undefined,
};


// Création du slice
const periodeEnseignementSlice = createSlice({
    name: "periodeEnseignementSlice",
    initialState,
    reducers: {
        setPeriodeSelected(state, action: PayloadAction<PeriodeEnseignementType>) {
            state.selectedPeriode = action.payload;
        },
        setPeriodeEnseignementLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPagePeriodeEnseignement(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setPeriodeEnseignements(state, action: PayloadAction<PeriodeEnseignementReturnGetType>) {
            state.data = action.payload;
        },
        createPeriodeEnseignement(state, action: PayloadAction<CreatePeriodeEnseignementPayload>) {
            state.data.periodes.unshift(action.payload.periode);
        },
        updatePeriodeEnseignement(state, action: PayloadAction<UpdatePeriodeEnseignementPayload>) {
            const { id, periodeData } = action.payload;
            const index = state.data.periodes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.periodes[index] = { ...state.data.periodes[index], ...periodeData };
            }
        },
        deletePeriodeEnseignement(state, action: PayloadAction<DeletePeriodeEnseignementPayload>) {
            const { id } = action.payload;
            state.data.periodes = state.data.periodes.filter(e => e._id !== id);
        },
        //Gérer les enseignements de la période
        ajouterEnseignement(state, action: PayloadAction<MatiereEnseignement>) {
            // Ajoute l'absence à la liste des absences de l'enseignant sélectionné
            const periode = state.selectedPeriode;
            if (periode && periode.enseignements) {
                periode.enseignements.unshift(action.payload);
            }
        },
        modifierEnseignement(state, action: PayloadAction<PeriodeEnseignementType>) {
            // modifier un enseignement
            // const periode = state.selectedPeriode;
            // if (periode && periode.enseignements) {
            //     periode.enseignements = periode.enseignements.filter(enseignement => enseignement._id !== action.payload._id);
            //     periode.enseignements.unshift(action.payload);
            // }
            state.selectedPeriode = action.payload
        },
        // Add an action to remove absence for an enseignant by ID
        retirerEnseignement(state, action: PayloadAction<{ enseignementId: string }>) {
            const { enseignementId} = action.payload;
            const periode = state.selectedPeriode;
            if (periode && periode.enseignements) {
                periode.enseignements = periode.enseignements.filter(enseignement => enseignement._id !== enseignementId);
            }
        }
    },
});

// Actions exportées
export const {
    setPeriodeSelected,
    setPeriodeEnseignementLoading,
    setErrorPagePeriodeEnseignement,
    setPeriodeEnseignements,
    createPeriodeEnseignement,
    updatePeriodeEnseignement,
    deletePeriodeEnseignement,
    ajouterEnseignement,
    modifierEnseignement,
    retirerEnseignement

} = periodeEnseignementSlice.actions;

// Reducer exporté
export default periodeEnseignementSlice.reducer;