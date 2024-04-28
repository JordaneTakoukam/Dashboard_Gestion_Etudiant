// Import necessary modules
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
const initialState: SignalementAbsenceInitial = {
    data: [],
    pageIsLoading: false,
    pageError: null,
    pageIsLoadingOnTable: false,

};

// Create the slice
const signalementAbsenceEnseignantSlice = createSlice({
    name: "signalementAbsenceEnseignantSlice",
    initialState,
    reducers: {
        // Define the reducer to set the user
        setListSignalementAbsenceEnseignant(state, action: PayloadAction<SignalementAbsence[]>) {
            state.data = action.payload;
        },

        addSignalementAbsenceEnseignant(state, action: PayloadAction<SignalementAbsence>) {
            state.data.unshift(action.payload);
        },


        setSignalementAbsenceEnseignantLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setSignalementAbsenceEnseignantError(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },




    },
});

// Export the actions
export const {
    setListSignalementAbsenceEnseignant,
    addSignalementAbsenceEnseignant,


    setSignalementAbsenceEnseignantLoading,
    setSignalementAbsenceEnseignantError
} = signalementAbsenceEnseignantSlice.actions;

;

// Export the reducer
export default signalementAbsenceEnseignantSlice.reducer;
