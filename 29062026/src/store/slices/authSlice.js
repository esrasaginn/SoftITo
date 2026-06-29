import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5001';

// Initial state, check localStorage for existing user session
const getInitialUser = () => {
  const storedUser = localStorage.getItem('user');
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Giriş başarısız oldu.');
      }
      const data = await response.json();
      if (data.length === 0) {
        return rejectWithValue('E-posta adresi veya şifre hatalı.');
      }
      const user = data[0];
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.message || 'Bir hata oluştu.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // First check if email already exists
      const checkResponse = await fetch(`${API_URL}/users?email=${encodeURIComponent(userData.email)}`);
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        return rejectWithValue('Bu e-posta adresi zaten kayıtlı.');
      }

      // Create new user
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Kayıt işlemi başarısız oldu.');
      }

      const newUser = await response.json();
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      return rejectWithValue(err.message || 'Kayıt olurken bir hata oluştu.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
