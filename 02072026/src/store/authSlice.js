import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// Tarayıcı hafızasında kayıtlı kullanıcı varsa başlangıç durumuna yükle
const savedUser = localStorage.getItem('foodflow_user');
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  status: 'idle',
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?email=${credentials.email}`);
      const user = response.data[0];
      if (user) {
        localStorage.setItem('foodflow_user', JSON.stringify(user));
        return user;
      } else {
        return rejectWithValue('E-posta veya şifre hatalı.');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // E-postanın zaten kullanımda olup olmadığını kontrol et
      const checkRes = await axios.get(`${API_URL}?email=${userData.email}`);
      if (checkRes.data.length > 0) {
        return rejectWithValue('Bu e-posta adresi zaten kullanımda.');
      }

      // Yeni kullanıcı ekle
      const response = await axios.post(API_URL, {
        name: userData.name,
        email: userData.email,
        role: userData.role // 'customer' (müşteri) veya 'restaurant' (işletme)
      });
      
      const newUser = response.data;
      
      // Eğer rol işletmeyse, onlar için bir de restoran kaydı oluşturmamız gerekir!
      if (newUser.role === 'restaurant') {
        await axios.post('http://localhost:5000/restaurants', {
          id: `r${Date.now()}`,
          userId: newUser.id,
          name: `${newUser.name} Restoranı`,
          cuisine: "Genel Mutfak",
          rating: 5.0,
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400&q=80",
          isActive: false // Yönetici (Admin) onayı gerektirir!
        });
      }

      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('foodflow_user');
    },
    updateUserInStore: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('foodflow_user', JSON.stringify(action.payload));
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Giriş Yapma
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Kayıt Olma
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logoutUser, updateUserInStore, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
