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
};


// Création du slice
const periodeEnseignementSlice = createSlice({
    name: "periodeEnseignementSlice",
    initialState,
    reducers: {
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
    },
});

// Actions exportées
export const {
    setPeriodeEnseignementLoading,
    setErrorPagePeriodeEnseignement,
    setPeriodeEnseignements,
    createPeriodeEnseignement,
    updatePeriodeEnseignement,
    deletePeriodeEnseignement
} = periodeEnseignementSlice.actions;

// Reducer exporté
export default periodeEnseignementSlice.reducer;