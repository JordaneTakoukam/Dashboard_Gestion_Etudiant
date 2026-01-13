//src/_redux/store.tsx

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting.tsx";
import dataSettingReducer from "./features/data_setting_slice.tsx";
import evenementReducer from "./features/evenement_slice.tsx";
import periodeReducer from "./features/periode_slice.tsx";
import matiereReducer from "./features/matiere_slice.tsx";
import devoirReducer from "./features/devoir_slice.tsx";
import devoirStatsReducer from "./features/devoir_stats_slice.tsx";
import periodeEnseignementReducer from "./features/periode_enseignement_slice.tsx";
import progressionMatiereReducer from "./features/progession_matiere_slice.tsx";
import progressionPeriodeEnseignementReducer from "./features/progession_periode_slice.tsx";
import chapitreReducer from "./features/chapitre_slice.tsx";
import questionReducer from "./features/question_slice.tsx";
import objectifReducer from "./features/objectif_slice.tsx";
import permissionReducer from "./features/permission_slice.tsx";
import documentUploadReducer from "./features/document_upload_slice.tsx";
import AdminReducer from "./features/admin_slice.tsx";
import EnseignantReducer from "./features/enseignant_slice.tsx";
import PresencePaieReducer from "./features/presence_paie_slice.tsx";
import EnseignanDisciplineReducer from "./features/absence/discipline_enseignant_slice.tsx";
import EtudiantDisciplineReducer from "./features/absence/discipline_etudiant_slice.tsx";
import EtudiantReducer from "./features/etudiant_slice.tsx";
import SignalementAbsence from "./features/absence/signalement_absence.tsx";
import notificationReducer from './features/notification_slice.tsx';
import SupportDeCoursReducer from "./features/support_cours_slice.tsx";
import EvaluationReducer from "./features/evaluation_slice.tsx";
import NoteReducer from "./features/note_slice.tsx";
import CoefficientReducer from "./features/coefficient_slice.tsx";
import ResultatReducer from "./features/resultat_slice.tsx";

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
    objectifSlice: objectifReducer,
    permissionSlice: permissionReducer,
    documentUploadSlice: documentUploadReducer,
    progressionMatiereSlice: progressionMatiereReducer,
    progressionPeriodeEnseignementSlice: progressionPeriodeEnseignementReducer,
    questionSlice: questionReducer,
    devoirSlice: devoirReducer,
    devoirStatsSlice: devoirStatsReducer,

    // 
    admin: AdminReducer,
    enseignantSlice: EnseignantReducer,
    presencePaieSlice:PresencePaieReducer,
    enseignantDisciplineSlice: EnseignanDisciplineReducer,
    etudiantDisciplineSlice: EtudiantDisciplineReducer,
    etudiantSlice: EtudiantReducer,
    supportDeCoursSlice:SupportDeCoursReducer,
    evaluationSlice:EvaluationReducer,
    noteSlice:NoteReducer,
    coefficientSlice:CoefficientReducer,
    resultatSlice:ResultatReducer,

    signalementAbsence: SignalementAbsence,
    notifications: notificationReducer,

  },
  preloadedState: {
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
