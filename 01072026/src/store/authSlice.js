import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?username=${username}&password=${password}`);
      const users = response.data;
      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('mini_crm_user', JSON.stringify(user));
        return user;
      } else {
        return rejectWithValue('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Giriş yapılırken bir hata oluştu.');
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem('mini_crm_user'),
  user: localStorage.getItem('mini_crm_user') ? JSON.parse(localStorage.getItem('mini_crm_user')) : null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('mini_crm_user');
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
