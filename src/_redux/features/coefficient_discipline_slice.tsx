// src/_redux/features/coefficient_discipline_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: CoefficientDisciplineInitialData = {
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
const coefficientDisciplineSlice = createSlice({
    name: "coefficientDisciplineSlice",
    initialState,
    reducers: {
        setCoefficientDisciplineLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageCoefficientDiscipline(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setCoefficientsDiscipline(state, action: PayloadAction<CoefficientDisciplineReturnGetType>) {
            state.data = action.payload;
        },
        createCoefficientDiscipline(state, action: PayloadAction<CreateCoefficientDisciplinePayload>) {
            state.data.coefficients.unshift(action.payload.coefficient);
        },
        updateCoefficientDiscipline(state, action: PayloadAction<UpdateCoefficientDisciplinePayload>) {
            const { id, coefficientData } = action.payload;
            const index = state.data.coefficients.findIndex(c => c._id === id);
            if (index !== -1) {
                state.data.coefficients[index] = { 
                    ...state.data.coefficients[index], 
                    ...coefficientData 
                };
            }
        },
        clearCoefficientsDiscipline(state) {
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
    setCoefficientDisciplineLoading,
    setErrorPageCoefficientDiscipline,
    setCoefficientsDiscipline,
    createCoefficientDiscipline,
    updateCoefficientDiscipline,
    clearCoefficientsDiscipline,
} = coefficientDisciplineSlice.actions;

// Reducer exporté
export default coefficientDisciplineSlice.reducer;