import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface transactionState {
  status: "idle" | "loading" | "succeeded" | "failed";
}
