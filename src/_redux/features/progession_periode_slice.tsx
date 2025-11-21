import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ProgressionPeriodeEnseignementInitialData = {
    data: {
        periodes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};


// Création du slice
const progressionPeriodeEnseignementSlice = createSlice({
    name: "progressionPeriodeEnseignementSlice",
    initialState,
    reducers: {
        setPeriodeEnseignementLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPagePeriodeEnseignement(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        updatePeriodeEnseignement(state, action: PayloadAction<UpdatePeriodeEnseignementPayload>) {
            const { id, periodeData } = action.payload;
            const index = state.data.periodes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.periodes[index] = { ...state.data.periodes[index], ...periodeData };
            }
        },
        setPeriodeEnseignements(state, action: PayloadAction<ProgressionPeriodeEnseignementReturnGetType>) {
            state.data = action.payload;
        },
        
    },
});

// Actions exportées
export const {
    setPeriodeEnseignementLoading,
    setErrorPagePeriodeEnseignement,
    setPeriodeEnseignements,
    updatePeriodeEnseignement,
} = progressionPeriodeEnseignementSlice.actions;

// Reducer exporté
export default progressionPeriodeEnseignementSlice.reducer;