import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const fetchProjects = createAsyncThunk(
  'portfolio/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/projects`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'portfolio/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/projects/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    items: [],
    currentProject: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchProjectById
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject } = portfolioSlice.actions;
export default portfolioSlice.reducer;
