import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import issueReducer from "./slices/issueSlice"; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues:issueReducer
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
