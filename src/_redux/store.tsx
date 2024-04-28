import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting.tsx";
import dataSettingReducer from "./features/data_setting_slice.tsx";
import evenementReducer from "./features/evenement_slice.tsx";
import periodeReducer from "./features/periode_slice.tsx";
import matiereReducer from "./features/matiere_slice.tsx";
import periodeEnseignementReducer from "./features/periode_enseignement_slice.tsx";
import progressionMatiereReducer from "./features/progession_matiere_slice.tsx";
import progressionPeriodeEnseignementReducer from "./features/progession_periode_slice.tsx";
import chapitreReducer from "./features/chapitre_slice.tsx";
import AdminReducer from "./features/admin_slice.tsx";
import EnseignantReducer from "./features/enseignant_slice.tsx";
import EnseignanDisciplineReducer from "./features/absence/discipline_enseignant_slice.tsx";
import EtudiantDisciplineReducer from "./features/absence/discipline_etudiant_slice.tsx";
import EtudiantReducer from "./features/etudiant_slice.tsx";
import SignalementAbsence from "./features/absence/signalement_absence.tsx";

const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
    dataSetting: dataSettingReducer,
    evenementSlice: evenementReducer,
    periodeSlice: periodeReducer,
    matiereSlice: matiereReducer,
    periodeEnseignementSlice: periodeEnseignementReducer,
    chapitreSlice: chapitreReducer,
    progressionMatiereSlice: progressionMatiereReducer,
    progressionPeriodeEnseignementSlice: progressionPeriodeEnseignementReducer,

    // 
    admin: AdminReducer,
    enseignantSlice: EnseignantReducer,
    enseignantDisciplineSlice: EnseignanDisciplineReducer,
    etudiantDisciplineSlice: EtudiantDisciplineReducer,
    etudiantSlice: EtudiantReducer,


    signalementAbsence: SignalementAbsence,

  },
  preloadedState: {
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
