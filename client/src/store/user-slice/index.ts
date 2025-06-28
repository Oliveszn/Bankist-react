import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface userState {
  status: "idle" | "loading" | "succeeded" | "failed";
  balance: number;
}

const initialState: userState = {
  status: "idle",
  balance: 0,
};

export const getUser = createAsyncThunk(
  "auth/getuser",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/get`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.data.balance;
      })
      .addCase(getUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default userSlice.reducer;
