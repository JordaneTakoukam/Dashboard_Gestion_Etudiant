import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SettingState {
    [x: string]: any;
    language: string;
    showModal: {
        create: boolean,
        update: boolean,
        delete: boolean,
        open: boolean,
        openChapitre: boolean,
        toDoSondage: boolean,

    };
}

const initialState: SettingState = {
    language: localStorage.getItem('lang')?.toString() ?? 'fr',
    showModal: {
        create: false,
        update: false,
        delete: false,
        open: false,
        openChapitre: false,
        toDoSondage: false,
    }
};


export const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {

        // afficher ou fermer toutes les modal de l'application
        setShowModalCreate: (state) => {
            state.showModal.create = !state.showModal.create;
        },
        setShowModalUpdate: (state) => {
            state.showModal.update = !state.showModal.update;
        },
        setShowModalDelete: (state) => {
            state.showModal.delete = !state.showModal.delete;
        },

        setShowModal: (state) => {
            state.showModal.open = !state.showModal.open;
        },

        setShowModalToDOSondage: (state) => {
            state.showModal.toDoSondage = !state.showModal.toDoSondage;
        },

        setShowModalChapitre: (state) => {
            state.showModal.openChapitre = !state.showModal.openChapitre;
        },

        setShowLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },

    },
});

export const {
    setShowLanguage, setShowModalCreate, setShowModalUpdate, setShowModalDelete, setShowModal, setShowModalChapitre, setShowModalToDOSondage
} = settingSlice.actions;

// export const changeLanguage = createAction<string>('setting/changeLanguage');

// export const selectLanguage = (state: RootState) => state.setting.language;

export default settingSlice.reducer;

