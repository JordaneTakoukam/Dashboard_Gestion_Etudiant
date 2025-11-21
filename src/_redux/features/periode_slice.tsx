import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: PeriodeInitialData = {
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
const periodeSlice = createSlice({
    name: "periodeSlice",
    initialState,
    reducers: {
        setPeriodeLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPagePeriode(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setPeriodes(state, action: PayloadAction<PeriodeReturnGetType>) {
            state.data = action.payload;
        },
        createPeriode(state, action: PayloadAction<CreatePeriodePayload>) {
            state.data.periodes.unshift(action.payload.periode);
        },
        updatePeriode(state, action: PayloadAction<UpdatePeriodePayload>) {
            const { id, periodeData } = action.payload;
            const index = state.data.periodes.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.periodes[index] = { ...state.data.periodes[index], ...periodeData };
            }
        },
        deletePeriode(state, action: PayloadAction<DeletePeriodePayload>) {
            const { id } = action.payload;
            state.data.periodes = state.data.periodes.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setPeriodeLoading,
    setErrorPagePeriode,
    setPeriodes,
    createPeriode,
    updatePeriode,
    deletePeriode
} = periodeSlice.actions;

// Reducer exporté
export default periodeSlice.reducer;