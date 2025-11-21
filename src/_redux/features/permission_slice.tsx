import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: PermissionInitialData = {
    data: {
        permissions: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const permissionSlice = createSlice({
    name: "permissionSlice",
    initialState,
    reducers: {
        setPermissionLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPagePermission(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setPermissions(state, action: PayloadAction<PermissionReturnGetType>) {
            state.data = action.payload;
        },
        createPermission(state, action: PayloadAction<CreatePermissionPayload>) {
            state.data.permissions.unshift(action.payload.permission);
        },
        updatePermission(state, action: PayloadAction<UpdatePermissionPayload>) {
            const { id, permissionData } = action.payload;
            const index = state.data.permissions.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.permissions[index] = { ...state.data.permissions[index], ...permissionData };
            }
        },
        deletePermission(state, action: PayloadAction<DeletePermissionPayload>) {
            const { id } = action.payload;
            state.data.permissions = state.data.permissions.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setPermissionLoading,
    setErrorPagePermission,
    setPermissions,
    createPermission,
    updatePermission,
    deletePermission
} = permissionSlice.actions;

// Reducer exporté
export default permissionSlice.reducer;