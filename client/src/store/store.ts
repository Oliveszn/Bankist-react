import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import toastReducer from "./ui-slice/toast-slice";
import userReducer from "./user-slice";
import movementReducer from "./movement-slice";
import themeReducer from "./ui-slice/theme-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    movements: movementReducer,

    ///ui
    toast: toastReducer,
    theme: themeReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
