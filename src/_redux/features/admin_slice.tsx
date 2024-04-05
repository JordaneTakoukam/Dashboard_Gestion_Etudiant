import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: AdminInitialData = {
    data: {
        list: [
            {
                _id: "1",
                nom: "Admin 1",
                prenom: "Test 1",
                email: "admin@test1.com",
                status: "actif",
                genre: "m",
                matricule: "MT1",
                contact: '+237611223344',
                photo_profil: "",

                lieu_naiss: null,
                historique_connexion: [],

                date_creation: null,
                date_entree: null,
                date_naiss: null,

                grades: null,
                categories: null,
                fonction: null,
                service: null,
                region: null,
                departement: null,
                communes: null,
            },
            {
                _id: "2",
                nom: "Admin 2",
                prenom: "Test 2",
                email: "admin@test2.com",
                status: "actif",
                genre: "m",
                matricule: "MT2",
                contact: '+237655223344',
                photo_profil: "",

                lieu_naiss: null,
                historique_connexion: [],

                date_creation: null,
                date_entree: null,
                date_naiss: null,

                grades: null,
                categories: null,
                fonction: null,
                service: null,
                region: null,
                departement: null,
                communes: null,
            },
            {
                _id: "3",
                nom: "Admin 3",
                prenom: "Test 3",
                email: "admin@test3.com",
                status: "actif",
                genre: "m",
                matricule: "MT3",
                contact: '+237699223344',
                photo_profil: "",

                lieu_naiss: null,
                historique_connexion: [],

                date_creation: null,
                date_entree: null,
                date_naiss: null,

                grades: null,
                categories: null,
                fonction: null,
                service: null,
                region: null,
                departement: null,
                communes: null,
            },

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
        setAdmin(state, action: PayloadAction<AdminReturnGetType>) {
            state.data = action.payload;
        },
        // createChapitre(state, action: PayloadAction<CreateChapitrePayload>) {
        //     state.data.chapitres.push(action.payload.chapitre);
        // },
        // updateChapitre(state, action: PayloadAction<UpdateChapitrePayload>) {
        //     const { id, chapitreData } = action.payload;
        //     const index = state.data.chapitres.findIndex(e => e._id === id);
        //     if (index !== -1) {
        //         state.data.chapitres[index] = { ...state.data.chapitres[index], ...chapitreData };
        //     }
        // },
        // deleteChapitre(state, action: PayloadAction<DeleteChapitrePayload>) {
        //     const { id } = action.payload;
        //     state.data.chapitres = state.data.chapitres.filter(e => e._id !== id);
        // },
    },
});

// Actions exportées
export const {
    setAdminsLoading,
    setErrorPageAdmin,
    // setErrorPageChapitre,
    // setChapitres,
    // createChapitre,
    // updateChapitre,
    // deleteChapitre
} = adminSlice.actions;

// Reducer exporté
export default adminSlice.reducer;