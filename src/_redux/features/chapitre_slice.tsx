import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ChapitreInitialData = {
    data: {
        chapitres: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const chapitreSlice = createSlice({
    name: "chapitreSlice",
    initialState,
    reducers: {
        setChapitreLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageChapitre(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setChapitres(state, action: PayloadAction<ChapitreReturnGetType>) {
            state.data = action.payload;
        },
        createChapitre(state, action: PayloadAction<CreateChapitrePayload>) {
            state.data.chapitres.push(action.payload.chapitre);
        },
        updateChapitre(state, action: PayloadAction<UpdateChapitrePayload>) {
            const { id, chapitreData } = action.payload;
            const index = state.data.chapitres.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.chapitres[index] = { ...state.data.chapitres[index], ...chapitreData };
            }
        },
        deleteChapitre(state, action: PayloadAction<DeleteChapitrePayload>) {
            const { id } = action.payload;
            state.data.chapitres = state.data.chapitres.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setChapitreLoading,
    setErrorPageChapitre,
    setChapitres,
    createChapitre,
    updateChapitre,
    deleteChapitre
} = chapitreSlice.actions;

// Reducer exporté
export default chapitreSlice.reducer;