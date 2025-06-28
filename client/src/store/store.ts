import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import toastReducer from "./ui-slice/toast-slice";
import userReducer from "./user-slice";
import movementReducer from "./movement-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    user: userReducer,
    movs: movementReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
