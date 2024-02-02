import { createSlice } from "@reduxjs/toolkit";

interface SettingState {
    showModal: {
        create: boolean,
        update: boolean,
        delete: boolean,
    };
}

const initialState: SettingState = {
    showModal: {
        create: false,
        update: false,
        delete: false,       
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


    },
});

export const {
    setShowModalCreate, setShowModalUpdate, setShowModalDelete,
} = settingSlice.actions;

export default settingSlice.reducer;
