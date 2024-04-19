import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SettingState {
    [x: string]: any;
    language: string;
    isMobile: boolean | null,
    showModal: {
        create: boolean,
        update: boolean,
        delete: boolean,
        open: boolean,
        addRole:boolean,
        openChapitre: boolean,
        openEnseignement:boolean,
        openPeriode:boolean,
        toDoSondage: boolean,
    };
    currentIndexUserRole: number,
}

const initialState: SettingState = {
    language: localStorage.getItem('lang')?.toString() || 'fr',
    isMobile: null,
    showModal: {
        create: false,
        update: false,
        delete: false,
        open: false,
        addRole:false,
        openChapitre: false,
        openEnseignement:false,
        openPeriode:false,
        toDoSondage: false,
    },
    currentIndexUserRole: 0,
};


export const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {
        setShowModalCreate: (state) => {
            state.showModal.create = !state.showModal.create;
        },

        // afficher ou fermer toutes les modal de l'application
        setCurrentIndexUserRole: (state, action) => {
            state.currentIndexUserRole = action.payload;
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

        setShowRoleModal: (state) => {
            state.showModal.addRole = !state.showModal.addRole;
        },

        setShowModalToDOSondage: (state) => {
            state.showModal.toDoSondage = !state.showModal.toDoSondage;
        },

        setShowModalChapitre: (state, action:PayloadAction<boolean>) => {
            state.showModal.openChapitre = action.payload;
        },

        setShowModalEnseignement: (state, action:PayloadAction<boolean>) => {
            state.showModal.openEnseignement = action.payload;
        },

        setShowModalPeriode: (state, action:PayloadAction<boolean>) => {
            state.showModal.openPeriode = action.payload;
        },

        setShowLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },

        setSaveDeviceType: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },

        setShowModalDeleteCustom: (state, action: PayloadAction<boolean>) => {
            state.showModal.delete = action.payload;
        },

        setShowModalCustom: (state, action: PayloadAction<boolean>) => {
            state.showModal.open = action.payload;
        },
    },
});

export const {
    setShowModalDeleteCustom,
    setShowModalCustom,
    setShowLanguage, setShowModalCreate, setShowModalUpdate, setShowModalDelete, setShowModal, setShowModalChapitre,setShowModalEnseignement, setShowModalToDOSondage
    , setSaveDeviceType,setShowRoleModal, setShowModalPeriode,
    setCurrentIndexUserRole,
} = settingSlice.actions;

// export const changeLanguage = createAction<string>('setting/changeLanguage');

// export const selectLanguage = (state: RootState) => state.setting.language;

export default settingSlice.reducer;

