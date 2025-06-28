import { createSlice } from "@reduxjs/toolkit";

type ToastType = "success" | "error";

interface toastState {
  show: boolean;
  message: string;
  type: ToastType;
}

const initialState: toastState = {
  show: false,
  message: "",
  type: "success",
};

const toastSlice = createSlice({
  name: "toasty",
  initialState,
  reducers: {
    showToast(state, action) {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideToast(state) {
      state.show = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
