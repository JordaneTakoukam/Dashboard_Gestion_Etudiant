import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: PresencePaieInitialData = {
    data: {
        presencePaies: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
    pageIsLoadingOnTable: false,
    
};

// Création du slice
const presencePaieSlice = createSlice({
    name: "presencePaieSlice",
    initialState,
    reducers: {
        setPresencePaiesLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setPresencePaiesLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setErrorPagePresencePaie(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setPresencePaie(state, action: PayloadAction<PresencePaieListGetType>) {
            state.data = action.payload;
        },
        createPresencePaie(state, action: PayloadAction<CreatePresencePaiePayload>) {
            state.data.presencePaies.unshift(action.payload.presencePaie);
        },


        updatePresencePaie(state, action: PayloadAction<UpdatePresencePaiePayload>) {
            const { id, presencePaieData } = action.payload;
            const index = state.data.presencePaies.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.presencePaies[index] = { ...state.data.presencePaies[index], ...presencePaieData };
            }
        },
        deletePresencePaie(state, action: PayloadAction<DeletePresencePaiePayload>) {
            const { id } = action.payload;
            state.data.presencePaies = state.data.presencePaies.filter(e => e._id !== id);
        },


    },
});

// Actions exportées
export const {
    setPresencePaiesLoading,
    setErrorPagePresencePaie,
    setPresencePaie,
    createPresencePaie,
    updatePresencePaie,
    deletePresencePaie,
    setPresencePaiesLoadingOnTable,

} = presencePaieSlice.actions;

// Reducer exporté
export default presencePaieSlice.reducer;