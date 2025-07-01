import { createSlice } from "@reduxjs/toolkit";

interface toastState {
  theme: "light" | "dark";
  resolvedTheme: "light" | "dark";
}

const initialState: toastState = {
  theme: "light",
  resolvedTheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  //   initialState: { darkMode: false },
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      //   state.darkMode = !state.darkMode;
      //   localStorage.setItem("darkMode", state.darkMode ? "true" : "false");
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme ? "true" : "false");
    },
    setDarkMode: (state, action) => {
      //   state.darkMode = action.payload;
      state.theme = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
