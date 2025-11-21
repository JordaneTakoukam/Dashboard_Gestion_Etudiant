import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: QuestionInitialData = {
    data: {
        questions: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const questionSlice = createSlice({
    name: "questionSlice",
    initialState,
    reducers: {
        setQuestionLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageQuestion(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setQuestions(state, action: PayloadAction<QuestionReturnGetType>) {
            state.data = action.payload;
        },
        createQuestion(state, action: PayloadAction<CreateQuestionPayload>) {
            state.data.questions.unshift(action.payload.question);
        },
        updateQuestion(state, action: PayloadAction<UpdateQuestionPayload>) {
            const { id, questionData } = action.payload;
            const index = state.data.questions.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.questions[index] = { ...state.data.questions[index], ...questionData };
            }
        },
        deleteQuestion(state, action: PayloadAction<DeleteQuestionPayload>) {
            const { id } = action.payload;
            state.data.questions = state.data.questions.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setQuestionLoading,
    setErrorPageQuestion,
    setQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = questionSlice.actions;

// Reducer exporté
export default questionSlice.reducer;