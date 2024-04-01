import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting.tsx";
import dataSettingReducer from "./features/data_setting_slice.tsx";
import evenementReducer from "./features/evenement_slice.tsx";
import periodeReducer from "./features/periode_slice.tsx";
import matiereReducer from "./features/matiere_slice.tsx";
import progressionMatiereReducer from "./features/progession_matiere_slice.tsx";
import chapitreReducer from "./features/chapitre_slice.tsx";

const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
    dataSetting: dataSettingReducer,
    evenementSlice: evenementReducer,
    periodeSlice: periodeReducer,
    matiereSlice: matiereReducer,
    chapitreSlice:chapitreReducer,
    progressionMatiereSlice:progressionMatiereReducer,

  },
  preloadedState: {
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
