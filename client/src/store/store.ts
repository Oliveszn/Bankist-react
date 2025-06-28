import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import toastReducer from "./ui-slice/toast-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
