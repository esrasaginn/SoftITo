import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Yerel sunucu URL'i. JSON Server çalıştırıldığında buradan sorgulama yapılır.
const API_URL = 'http://localhost:3001';

// JSON Server açık değilse veya ağ hatası olursa sistemin çökmemesi için yedek test kullanıcıları
const LOCAL_USERS = [
  {
    id: 1,
    email: "admin@havaakisi.com",
    password: "admin",
    role: "admin",
    name: "Calfin Danang",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 2,
    email: "editor@havaakisi.com",
    password: "editor",
    role: "editor",
    name: "Ayşe Yılmaz",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: 3,
    email: "user@havaakisi.com",
    password: "user",
    role: "user",
    name: "Mehmet Demir",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

// Asenkron Giriş İşlemi (Thunk)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Önce JSON Server üzerinden kullanıcıyı sorgulamayı deneyelim
      const response = await axios.get(`${API_URL}/users`, {
        params: { email, password }
      });
      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      throw new Error("Geçersiz e-posta veya şifre.");
    } catch (error) {
      // Sunucu kapalıysa yedek yerel test kullanıcılarından sorgulayalım
      const foundUser = LOCAL_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser));
        return foundUser;
      }
      return rejectWithValue(error.response?.data || error.message || "Giriş başarısız.");
    }
  }
);

// LocalStorage'daki kullanıcı session'ını geri yükleyelim
const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    loading: false,
    error: null,
  },
  reducers: {
    // Çıkış yapıldığında state'i temizleyip localstorage'dan silelim
    logoutUser: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    // Hataları sıfırlama metodu
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
