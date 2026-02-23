import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getProfile, login as loginService, logout as logoutService, signup as signupService, User } from "@/services/userService";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  return await getProfile();
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ Email, Password }: { Email: string; Password: string }, { rejectWithValue }) => {
    try {
      return await loginService(Email, Password);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ Name, Email, Password }: { Name: string; Email: string; Password: string }, { rejectWithValue }) => {
    try {
      return await signupService(Name, Email, Password);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutService();
  return null;
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
