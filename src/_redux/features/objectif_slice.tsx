import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ObjectifInitialData = {
    data: {
        objectifs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const objectifSlice = createSlice({
    name: "objectifSlice",
    initialState,
    reducers: {
        setObjectifLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageObjectif(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setObjectifs(state, action: PayloadAction<ObjectifReturnGetType>) {
            state.data = action.payload;
        },
        createObjectif(state, action: PayloadAction<CreateObjectifPayload>) {
            state.data.objectifs.unshift(action.payload.objectif);
        },
        updateObjectif(state, action: PayloadAction<UpdateObjectifPayload>) {
            const { id, objectifData } = action.payload;
            const index = state.data.objectifs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.objectifs[index] = { ...state.data.objectifs[index], ...objectifData };
            }
        },
        deleteObjectif(state, action: PayloadAction<DeleteObjectifPayload>) {
            const { id } = action.payload;
            state.data.objectifs = state.data.objectifs.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setObjectifLoading,
    setErrorPageObjectif,
    setObjectifs,
    createObjectif,
    updateObjectif,
    deleteObjectif
} = objectifSlice.actions;

// Reducer exporté
export default objectifSlice.reducer;