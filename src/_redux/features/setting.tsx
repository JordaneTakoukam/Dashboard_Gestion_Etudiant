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
        notificationDetails:boolean,
        openSignalerAbsence:boolean,
        openPause:boolean,
        openElement:boolean,
        openScan:boolean,
        openPresence:boolean,
        openPresenceM:boolean,
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
        notificationDetails:false,
        openSignalerAbsence:false,
        openPause:false,
        openElement:false,
        openPresence:false,
        openPresenceM:false,
        openScan:false,
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

        setShowModalNotificationDetails: (state) => {
            state.showModal.notificationDetails = !state.showModal.notificationDetails;
        },

        setShowModal: (state) => {
            state.showModal.open = !state.showModal.open;
        },

        setShowModalSignalerAbsence: (state) => {
            state.showModal.openSignalerAbsence = !state.showModal.openSignalerAbsence;
        },

        setShowModalElement: (state) => {
            state.showModal.openElement = !state.showModal.openElement;
        },

        setShowModalPresence: (state) => {
            state.showModal.openPresence = !state.showModal.openPresence;
        },

        setShowModalPresenceManuelle: (state) => {
            state.showModal.openPresenceM = !state.showModal.openPresenceM;
        },

        setShowModalOpenScan: (state) => {
            state.showModal.openScan = !state.showModal.openScan;
        },

        setShowModalPause: (state) => {
            state.showModal.openPause = !state.showModal.openPause;
        },

        setShowRoleModal: (state) => {
            state.showModal.addRole = !state.showModal.addRole;
        },

        setShowModalToDOSondage: (state) => {
            state.showModal.toDoSondage = !state.showModal.toDoSondage;
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
    setShowLanguage, setShowModalCreate, setShowModalUpdate, setShowModalDelete, setShowModal, setShowModalToDOSondage
    , setSaveDeviceType,setShowRoleModal, setShowModalPeriode, setShowModalElement, setShowModalPresence, setShowModalOpenScan, setShowModalPause, setShowModalNotificationDetails,
    setCurrentIndexUserRole,setShowModalSignalerAbsence, setShowModalPresenceManuelle
} = settingSlice.actions;

// export const changeLanguage = createAction<string>('setting/changeLanguage');

// export const selectLanguage = (state: RootState) => state.setting.language;

export default settingSlice.reducer;

