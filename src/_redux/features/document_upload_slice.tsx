import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DocumentUploadInitialData = {
    data: {
        documentUploads: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const documentUploadSlice = createSlice({
    name: "documentUploadSlice",
    initialState,
    reducers: {
        setDocumentUploadLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDocumentUpload(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDocumentUploads(state, action: PayloadAction<DocumentUploadReturnGetType>) {
            state.data = action.payload;
        },
        createDocumentUpload(state, action: PayloadAction<CreateDocumentUploadPayload>) {
            state.data.documentUploads.unshift(action.payload.documentUpload);
        },
        updateDocumentUpload(state, action: PayloadAction<UpdateDocumentUploadPayload>) {
            const { id, documentUploadData } = action.payload;
            const index = state.data.documentUploads.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.documentUploads[index] = { ...state.data.documentUploads[index], ...documentUploadData };
            }
        },
        deleteDocumentUpload(state, action: PayloadAction<DeleteDocumentUploadPayload>) {
            const { id } = action.payload;
            state.data.documentUploads = state.data.documentUploads.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setDocumentUploadLoading,
    setErrorPageDocumentUpload,
    setDocumentUploads,
    createDocumentUpload,
    updateDocumentUpload,
    deleteDocumentUpload
} = documentUploadSlice.actions;

// Reducer exporté
export default documentUploadSlice.reducer;