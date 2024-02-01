import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user_slice.tsx";
import settingReducer from "./features/setting_slice.tsx";

const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,

  },
  preloadedState: {
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
