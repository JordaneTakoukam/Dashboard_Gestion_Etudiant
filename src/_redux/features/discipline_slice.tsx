// src/_redux/features/discipline_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: DisciplineInitialData = {
    data: {
        disciplines: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedDiscipline: undefined,
};

// Création du slice
const disciplineSlice = createSlice({
    name: "disciplineSlice",
    initialState,
    reducers: {
        setDisciplineSelected(state, action: PayloadAction<DisciplineType>) {
            state.selectedDiscipline = action.payload;
        },
        setDisciplineLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDiscipline(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDisciplines(state, action: PayloadAction<DisciplineReturnGetType>) {
            state.data = action.payload;
        },
        createDiscipline(state, action: PayloadAction<CreateDisciplinePayload>) {
            state.data.disciplines.unshift(action.payload.discipline);
        },
        updateDiscipline(state, action: PayloadAction<UpdateDisciplinePayload>) {
            const { id, disciplineData } = action.payload;
            const index = state.data.disciplines.findIndex(d => d._id === id);
            if (index !== -1) {
                state.data.disciplines[index] = { 
                    ...state.data.disciplines[index], 
                    ...disciplineData 
                };
            }
        },
        clearDisciplines(state) {
            state.data = {
                disciplines: [],
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
    setDisciplineSelected,
    setDisciplineLoading,
    setErrorPageDiscipline,
    setDisciplines,
    createDiscipline,
    updateDiscipline,
    clearDisciplines,
} = disciplineSlice.actions;

// Reducer exporté
export default disciplineSlice.reducer;