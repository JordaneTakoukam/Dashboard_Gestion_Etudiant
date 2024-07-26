import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DocumentInitialData = {
    data: {
        documents: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const documentSlice = createSlice({
    name: "documentSlice",
    initialState,
    reducers: {
        setDocumentLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },

        
        setErrorPageDocument(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
       
        deleteDocument(state, action: PayloadAction<DeleteDocumentPayload>) {
            const { id } = action.payload;
            state.data.documents = state.data.documents.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setDocumentLoading,
    setErrorPageDocument,
    deleteDocument
} = documentSlice.actions;

// Reducer exporté
export default documentSlice.reducer;