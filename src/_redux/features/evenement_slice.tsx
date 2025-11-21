import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: EvenementInitialData = {
    data: {
        evenements: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const evenementSlice = createSlice({
    name: "evenementSlice",
    initialState,
    reducers: {
        setEvenementLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEvenement(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEvenements(state, action: PayloadAction<EvenementReturnGetType>) {
            state.data = action.payload;
        },
        createEvenement(state, action: PayloadAction<CreateEvenementPayload>) {
            state.data.evenements.unshift(action.payload.evenement);
        },
        updateEvenement(state, action: PayloadAction<UpdateEvenementPayload>) {
            const { id, evenementData } = action.payload;
            const index = state.data.evenements.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.evenements[index] = { ...state.data.evenements[index], ...evenementData };
            }
        },
        deleteEvenement(state, action: PayloadAction<DeleteEvenementPayload>) {
            const { id } = action.payload;
            state.data.evenements = state.data.evenements.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setEvenementLoading,
    setErrorPageEvenement,
    setEvenements,
    createEvenement,
    updateEvenement,
    deleteEvenement
} = evenementSlice.actions;

// Reducer exporté
export default evenementSlice.reducer;