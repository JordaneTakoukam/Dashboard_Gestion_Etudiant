import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Initial state
const initialState: SupportDeCoursInitialData = {
    data: {
        supportsDeCours: [],
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
const supportDeCourslice = createSlice({
    name: "supportDeCoursSlice",
    initialState,
    reducers: {
        setSupportDeCoursLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setSupportDeCoursLoadingOnTable(state, action: PayloadAction<boolean>) {
            state.pageIsLoadingOnTable = action.payload;
        },
        setErrorPageSupportDeCours(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setSupportDeCours(state, action: PayloadAction<SupportDeCoursListGetType>) {
            state.data = action.payload;
        },
        createSupportDeCours(state, action: PayloadAction<CreateSupportDeCoursPayload>) {
            state.data.supportsDeCours.unshift(action.payload.supportDeCours);
        },


        updateSupportDeCours(state, action: PayloadAction<UpdateSupportDeCoursPayload>) {
            const { id, supportDeCoursData } = action.payload;
            const index = state.data.supportsDeCours.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.supportsDeCours[index] = { ...state.data.supportsDeCours[index], ...supportDeCoursData };
            }
        },
        deleteSupportDeCours(state, action: PayloadAction<DeleteSupportDeCoursPayload>) {
            const { id } = action.payload;
            state.data.supportsDeCours = state.data.supportsDeCours.filter(e => e._id !== id);
        },


    },
});

// Actions exportées
export const {
    setSupportDeCoursLoading,
    setErrorPageSupportDeCours,
    setSupportDeCours,
    createSupportDeCours,
    updateSupportDeCours,
    deleteSupportDeCours,
    setSupportDeCoursLoadingOnTable,

} = supportDeCourslice.actions;

// Reducer exporté
export default supportDeCourslice.reducer;