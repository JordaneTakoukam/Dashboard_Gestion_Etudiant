import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: AdminInitialData = {
    data: {
        list: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const adminSlice = createSlice({
    name: "adminSlice",
    initialState,
    reducers: {
        setAdminsLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageAdmin(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setAdmin(state, action: PayloadAction<AdminListGetType>) {
            state.data = action.payload;
        },
        createAdmin(state, action: PayloadAction<AdminType>) {
            state.data.list.push(action.payload);
        },


        updateAdmin(state, action: PayloadAction<{ newAdmin: AdminType }>) {
            const { newAdmin } = action.payload;

            const index = state.data.list.findIndex(admin => admin._id === newAdmin._id);

            if (index !== -1) {
                state.data.list[index] = { ...state.data.list[index], ...newAdmin };
            }
        },


        deleteAdmin(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload;
            state.data.list = state.data.list.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setAdminsLoading,
    setErrorPageAdmin,
    setAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = adminSlice.actions;

// Reducer exporté
export default adminSlice.reducer;