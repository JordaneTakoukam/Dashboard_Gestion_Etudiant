//src/_redux/features/evaluation_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: EvaluationInitialData = {
    data: {
        evaluations: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedEvaluation: undefined,
};

// Création du slice
const evaluationSlice = createSlice({
    name: "evaluationSlice",
    initialState,
    reducers: {
        setEvaluationSelected(state, action: PayloadAction<EvaluationType>) {
            state.selectedEvaluation = action.payload;
        },
        setPage(state) {
            state.data.pageSize += 1;
            state.data.totalItems += 1;
        },
        setEvaluationLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageEvaluation(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setEvaluations(state, action: PayloadAction<EvaluationReturnGetType>) {
            state.data = action.payload;
        },
        createEvaluation(state, action: PayloadAction<CreateEvaluationPayload>) {
            state.data.evaluations.unshift(action.payload.evaluation);
        },
        updateEvaluation(state, action: PayloadAction<UpdateEvaluationPayload>) {
            const { id, evaluationData } = action.payload;
            const index = state.data.evaluations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.evaluations[index] = { ...state.data.evaluations[index], ...evaluationData };
            }
        },
        deleteEvaluation(state, action: PayloadAction<DeleteEvaluationPayload>) {
            const { id } = action.payload;
            state.data.evaluations = state.data.evaluations.filter(e => e._id !== id);
        },
        updateEvaluationStatut(state, action: PayloadAction<{ id: string; statut: string }>) {
            const { id, statut } = action.payload;
            const index = state.data.evaluations.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.evaluations[index].statut = statut as any;
            }
        },
    },
});

// Actions exportées
export const {
    setEvaluationSelected,
    setPage,
    setEvaluationLoading,
    setErrorPageEvaluation,
    setEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    updateEvaluationStatut,
} = evaluationSlice.actions;

// Reducer exporté
export default evaluationSlice.reducer;