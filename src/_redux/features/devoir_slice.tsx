import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: DevoirInitialData = {
    data: {
        devoirs: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedDevoir:undefined,
};


// Création du slice
const devoirSlice = createSlice({
    name: "devoirSlice",
    initialState,
    reducers: {
        setDevoirSelected(state, action: PayloadAction<DevoirType>) {
            state.selectedDevoir = action.payload;
        },
        setPage(state){
            state.data.pageSize +=1;
            state.data.totalItems+=1;
        },
        setDevoirLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageDevoir(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setDevoirs(state, action: PayloadAction<DevoirReturnGetType>) {
            state.data = action.payload;
        },
        createDevoir(state, action: PayloadAction<CreateDevoirPayload>) {
            state.data.devoirs.unshift(action.payload.devoir);
        },
        updateDevoir(state, action: PayloadAction<UpdateDevoirPayload>) {
            const { id, devoirData } = action.payload;
            const index = state.data.devoirs.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.devoirs[index] = { ...state.data.devoirs[index], ...devoirData };
            }
            
        },
       
        
        deleteDevoir(state, action: PayloadAction<DeleteDevoirPayload>) {
            const { id } = action.payload;
            state.data.devoirs = state.data.devoirs.filter(e => e._id !== id);
        },

        //Gérer les questions de la matière
        ajouterQuestion(state, action: PayloadAction<QuestionType>) {
            const devoir = state.selectedDevoir;
            if (devoir && devoir.questions) {
                devoir.questions.unshift(action.payload);
            }
        },
        modifierQuestion(state, action: PayloadAction<QuestionType>) {
            
            const devoir = state.selectedDevoir;
            if (devoir && devoir.questions) {
                devoir.questions = devoir.questions.filter(question => question._id !== action.payload._id);
                devoir.questions.unshift(action.payload);
            }
        },
        
        retirerQuestion(state, action: PayloadAction<{ questionId: string }>) {
            const { questionId} = action.payload;
            const devoir = state.selectedDevoir;
            if (devoir && devoir.questions) {
                devoir.questions = devoir.questions.filter(question => question._id !== questionId);
            }
        },

        
    },
});

// Actions exportées
export const {
    setDevoirSelected,
    setPage,
    setDevoirLoading,
    setErrorPageDevoir,
    setDevoirs,
    createDevoir,
    updateDevoir,
    deleteDevoir,
    ajouterQuestion,
    modifierQuestion,
    retirerQuestion,
} = devoirSlice.actions;

// Reducer exporté
export default devoirSlice.reducer;