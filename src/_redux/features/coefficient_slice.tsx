//src/_redux/features/coefficient_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: CoefficientInitialData = {
    data: {
        coefficients: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const coefficientSlice = createSlice({
    name: "coefficientSlice",
    initialState,
    reducers: {
        setCoefficientLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCoefficient(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCoefficients(state, action: PayloadAction<CoefficientReturnGetType>) {
            state.data = action.payload;
        },
        createCoefficient(state, action: PayloadAction<CreateCoefficientPayload>) {
            state.data.coefficients.unshift(action.payload.coefficient);
        },
        updateCoefficient(state, action: PayloadAction<UpdateCoefficientPayload>) {
            const { id, coefficientData } = action.payload;
            const index = state.data.coefficients.findIndex(c => c._id === id);
            if (index !== -1) {
                state.data.coefficients[index] = { ...state.data.coefficients[index], ...coefficientData };
            }
        },
        deleteCoefficient(state, action: PayloadAction<{ id: string }>) {
            const { id } = action.payload;
            state.data.coefficients = state.data.coefficients.filter(c => c._id !== id);
        },
        clearCoefficients(state) {
            state.data = {
                coefficients: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            };
        },
    },
});

// Actions exportées
export const {
    setCoefficientLoading,
    setErrorPageCoefficient,
    setCoefficients,
    createCoefficient,
    updateCoefficient,
    deleteCoefficient,
    clearCoefficients,
} = coefficientSlice.actions;

// Reducer exporté
export default coefficientSlice.reducer;