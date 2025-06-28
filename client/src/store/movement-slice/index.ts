import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface movementState {
  status: "idle" | "loading" | "succeeded" | "failed";
  movement: any[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const initialState: movementState = {
  status: "idle",
  movement: [],
  totalPages: 0,
  currentPage: 0,
  totalCount: 0,
};

export const getMovements = createAsyncThunk(
  "auth/getMovs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/movements`,
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

const movementSlice = createSlice({
  name: "movs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movement = action.payload.data;
      })
      .addCase(getMovements.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default movementSlice.reducer;
