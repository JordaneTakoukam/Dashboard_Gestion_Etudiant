import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DevoirStatsInitialData = {
    data: {
        devoir: {
            titreFr: "",
            titreEn: "",
            noteSur: 0,
            totalQuestionPoints:0
        },
        nombreParticipants: 0,
        nombreParticipantsSurEffectif:"",
        meilleureNote: 0,
        pireNote: 0,
        noteMoyenne: 0,
        etudiants: []
    },
    pageIsLoading: false,
    pageError: null,
};


// Création du slice
const devoirSlice = createSlice({
    name: "devoirStatsSlice",
    initialState,
    reducers: {
        
        setDevoirLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDevoir(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDevoirStats(state, action: PayloadAction<DevoirStatsReturnGetType>) {
            state.data = action.payload;
        },
       
        
    },
});

// Actions exportées
export const {
   
    setDevoirLoading,
    setErrorPageDevoir,
    setDevoirStats,
    
} = devoirSlice.actions;

// Reducer exporté
export default devoirSlice.reducer;