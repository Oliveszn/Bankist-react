import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

////had to add this because it keeps redirecting me from dashboard page
/////redux auth state is reset by default on reload so isauthenticated becomes false
const userFromStorage = localStorage.getItem("authUser");

interface User {
  id: string;
  username: string;
  firstname: string;
  balance: number;
}

interface AuthFormData {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  // user?: User;
  user?: {
    id: string;
    username: string;
    firstname: string;
    balance: number;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error?: string;
}

const initialState: AuthState = {
  isAuthenticated: !!userFromStorage,
  isLoading: false,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

export const authUser = createAsyncThunk(
  "auth/user",
  async (
    { formData, isLogin }: { formData: AuthFormData; isLogin: boolean },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await axios.post<AuthResponse>(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        formData,
        { withCredentials: true }
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

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        null,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",

  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/checkAuth`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Expires: "0",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "/auth/delete",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/delete`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success
          ? action.payload.user || null
          : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(authUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;

        if (action.payload.success) {
          localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authUser");
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success
          ? action.payload.user || null
          : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});
export default authSlice.reducer;
