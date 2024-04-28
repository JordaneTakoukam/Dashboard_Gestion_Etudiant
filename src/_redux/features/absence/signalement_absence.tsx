


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
const signalementAbsenceSlice = createSlice({
    name: "signalementAbsenceSlice",
    initialState,
    reducers: {
        // Define the reducer to set the user
        setListSignalementAbsence(state, action: PayloadAction<SignalementAbsence[]>) {
            state.data = action.payload;
        },

        addSignalementAbsence(state, action: PayloadAction<SignalementAbsence>) {
            state.data.unshift(action.payload);
        },


        setSignalementAbsenceLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setSignalementAbsenceError(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
    },
});

// Export the actions
export const {
    setListSignalementAbsence,
    addSignalementAbsence,
    setSignalementAbsenceLoading,
    setSignalementAbsenceError
} = signalementAbsenceSlice.actions;

;

// Export the reducer
export default signalementAbsenceSlice.reducer;
