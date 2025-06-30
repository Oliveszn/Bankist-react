import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type {
  Movement,
  MovementState,
  LoanFormData,
  TransferFormData,
  ApiResponse,
} from "../../utils/types";

const initialState: MovementState = {
  status: "idle",
  movements: [],
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
  error: null,
};

const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  return "An unexpected error occurred";
};

export const getMovements = createAsyncThunk<
  {
    movements: Movement[];
    totalPages: number;
    totalCount: number;
    currentPage: number;
  },
  { page?: number },
  { rejectValue: string }
>("movements/getMovements", async ({ page = 1 } = {}, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/movements?page=${page}`,
      { withCredentials: true }
    );

    console.log(response.data);

    return {
      movements: response.data.data || [],
      totalPages: response.data.totalPages,
      totalCount: response.data.totalCount,
      currentPage: response.data.currentPage,
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const getLoan = createAsyncThunk<
  { movement: Movement; message: string },
  LoanFormData,
  { rejectValue: string }
>("movements/getLoan", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post<ApiResponse<Movement>>(
      `${import.meta.env.VITE_API_URL}/api/loan`,
      formData,
      { withCredentials: true }
    );
    console.log("Loan API Response:", response.data);
    return {
      movement: response.data.movement,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const transferMoney = createAsyncThunk<
  { senderMovement: Movement; recipientMovement: Movement; message: string },
  TransferFormData,
  { rejectValue: string }
>("movements/transferMoney", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post<
      ApiResponse<{
        senderMovement: Movement;
        recipientMovement: Movement;
      }>
    >(`${import.meta.env.VITE_API_URL}/api/send`, formData, {
      withCredentials: true,
    });

    return {
      senderMovement: response.data.movement,
      recipientMovement: response.data.movement,
      message: response.data.message,
    };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

const movementSlice = createSlice({
  name: "movements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovements.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movements = action.payload.movements;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch movements";
      })
      .addCase(getLoan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getLoan.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getLoan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to process loan";
        console.log(action.payload);
      })
      .addCase(transferMoney.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferMoney.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movements.unshift(action.payload.senderMovement);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(transferMoney.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to transfer money";
      });
  },
});
export const { clearError, resetStatus } = movementSlice.actions;
export default movementSlice.reducer;
