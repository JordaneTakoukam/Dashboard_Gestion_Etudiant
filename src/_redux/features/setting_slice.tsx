import { createSlice } from "@reduxjs/toolkit";

interface SettingState {
    [x: string]: any;
    showModal: {
        create: boolean,
        update: boolean,
        delete: boolean,
        open : boolean,
        openChapitre : boolean,
    };
}

const initialState: SettingState = {
    showModal: {
        create: false,
        update: false,
        delete: false,  
        open : false,   
        openChapitre : false,  
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

        setShowModal: (state)=>{
            state.showModal.open = !state.showModal.open;
        },
        
        setShowModalChapitre: (state)=>{
            state.showModal.openChapitre = !state.showModal.openChapitre;
        }

    },
});

export const {
    setShowModalCreate, setShowModalUpdate, setShowModalDelete, setShowModal, setShowModalChapitre
} = settingSlice.actions;

export default settingSlice.reducer;
