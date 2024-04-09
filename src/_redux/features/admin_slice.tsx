import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: AdminInitialData = {
    data: {
        list: [
            // {
            //     _id: "1",
            //     nom: "Admin 1",
            //     prenom: "Test 1",
            //     email: "admin@test1.com",
            //     status: "actif",
            //     genre: "f",
            //     matricule: "MT1",
            //     contact: '+237611223344',
            //     photo_profil: "",

            //     lieu_naiss: null,
            //     historique_connexion: [],

            //     date_creation: null,
            //     date_entree: null,
            //     date_naiss: null,

            //     grade: null,
            //     categorie: null,
            //     fonction: null,
            //     service: null,
            //     region: null,
            //     departement: null,
            //     commune: null,
            // },
            // {
            //     _id: "2",
            //     nom: "Admin 2",
            //     prenom: "Test 2",
            //     email: "admin@test2.com",
            //     status: "actif",
            //     genre: "m",
            //     matricule: "MT2",
            //     contact: '+237655223344',
            //     photo_profil: "",

            //     lieu_naiss: null,
            //     historique_connexion: [],

            //     date_creation: null,
            //     date_entree: null,
            //     date_naiss: null,

            //     grade: null,
            //     categorie: null,
            //     fonction: null,
            //     service: null,
            //     region: null,
            //     departement: null,
            //     commune: null,
            // },
            // {
            //     _id: "3",
            //     nom: "Admin 3",
            //     prenom: "Test 3",
            //     email: "admin@test3.com",
            //     status: "actif",
            //     genre: "f",
            //     matricule: "MT3",
            //     contact: '+237699223344',
            //     photo_profil: "",

            //     lieu_naiss: null,
            //     historique_connexion: [],

            //     date_creation: null,
            //     date_entree: null,
            //     date_naiss: null,

            //     grade: null,
            //     categorie: null,
            //     fonction: null,
            //     service: null,
            //     region: null,
            //     departement: null,
            //     commune: null,
            // },

        ],
        currentPage: 1,
        totalItems: 3,
        totalPages: 3,
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
        updateAdmin(state, action: PayloadAction<AdminUpdateType>) {
            const { ...adminData } = action.payload;
            const index = state.data.list.findIndex(e => e._id === adminData._id);
            if (index !== -1) {
                state.data.list[index] = { ...state.data.list[index], ...adminData };
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