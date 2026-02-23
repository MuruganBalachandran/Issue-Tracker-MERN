import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Issue, getIssues, createIssue, updateIssue, deleteIssue } from "@/services/issueService";

interface IssueState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
}

const initialState: IssueState = {
  issues: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchIssues = createAsyncThunk("issues/fetchAll", async () => {
  return await getIssues();
});

export const addIssue = createAsyncThunk(
  "issues/add",
  async (payload: { Title: string; Description: string; Priority: string; Assignee?: string }) => {
    return await createIssue(payload.Title, payload.Description, payload.Priority, payload.Assignee);
  }
);

export const editIssue = createAsyncThunk(
  "issues/edit",
  async (payload: { id: string; updates: Partial<Issue> }) => {
    return await updateIssue(payload.id, payload.updates);
  }
);

export const removeIssue = createAsyncThunk("issues/delete", async (id: string) => {
  await deleteIssue(id);
  return id;
});

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch issues";
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        state.issues.push(action.payload);
      })
      .addCase(editIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex((i) => i._id === action.payload._id);
        if (index >= 0) state.issues[index] = action.payload;
      })
      .addCase(removeIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter((i) => i._id !== action.payload);
      });
  },
});

export default issueSlice.reducer;
