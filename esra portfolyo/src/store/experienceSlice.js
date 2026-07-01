import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const fetchExperienceData = createAsyncThunk(
  'experience/fetchExperienceData',
  async (_, { rejectWithValue }) => {
    try {
      const [experiencesRes, educationRes, profileRes] = await Promise.all([
        axios.get(`${API_BASE}/experiences`),
        axios.get(`${API_BASE}/education`),
        axios.get(`${API_BASE}/profile`),
      ]);
      return {
        experiences: experiencesRes.data,
        education: educationRes.data,
        profile: profileRes.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const experienceSlice = createSlice({
  name: 'experience',
  initialState: {
    profile: null,
    experiences: [],
    education: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperienceData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExperienceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.experiences = action.payload.experiences;
        state.education = action.payload.education;
        state.profile = action.payload.profile;
      })
      .addCase(fetchExperienceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default experienceSlice.reducer;
