//src/_redux/features/note_slice.tsx

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: NoteInitialData = {
    data: {
        notes: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedNote: undefined,
};

// Création du slice
const noteSlice = createSlice({
    name: "noteSlice",
    initialState,
    reducers: {
        setNoteSelected(state, action: PayloadAction<NoteType>) {
            state.selectedNote = action.payload;
        },
        setNoteLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageNote(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setNotes(state, action: PayloadAction<NoteReturnGetType>) {
            state.data = action.payload;
        },
        createNote(state, action: PayloadAction<CreateNotePayload>) {
            state.data.notes.unshift(action.payload.note);
        },
        updateNote(state, action: PayloadAction<UpdateNotePayload>) {
            const { id, noteData } = action.payload;
            const index = state.data.notes.findIndex(n => n._id === id);
            if (index !== -1) {
                state.data.notes[index] = { ...state.data.notes[index], ...noteData };
            }
        },
        clearNotes(state) {
            state.data = {
                notes: [],
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
    setNoteSelected,
    setNoteLoading,
    setErrorPageNote,
    setNotes,
    createNote,
    updateNote,
    clearNotes,
} = noteSlice.actions;

// Reducer exporté
export default noteSlice.reducer;