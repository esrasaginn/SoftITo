import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeatherData } from '../../services/weatherApi';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Hava Durumu Verilerini Çekme Metodu (Thunk)
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (cityName, { rejectWithValue }) => {
    try {
      const data = await fetchWeatherData(cityName);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Hava durumu bilgisi yüklenemedi.");
    }
  }
);

// Favori Şehirleri Çekme Metodu (JSON Server ve LocalStorage Yedekli)
export const fetchFavorites = createAsyncThunk(
  'weather/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/favorites?userId=${userId}`);
      return res.data;
    } catch (err) {
      // Sunucu kapalıysa LocalStorage yedeğine başvur
      const localFavs = localStorage.getItem(`favs_${userId}`);
      return localFavs ? JSON.parse(localFavs) : [];
    }
  }
);

// Favoriye Ekleme Metodu
export const addFavorite = createAsyncThunk(
  'weather/addFavorite',
  async ({ userId, cityName }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/favorites`, { userId, cityName });
      return res.data;
    } catch (err) {
      // Sunucu kapalıysa LocalStorage yedeğinde sakla
      const localKey = `favs_${userId}`;
      const localFavs = localStorage.getItem(localKey) ? JSON.parse(localStorage.getItem(localKey)) : [];
      const newFav = { id: Date.now(), userId, cityName };
      const updated = [...localFavs, newFav];
      localStorage.setItem(localKey, JSON.stringify(updated));
      return newFav;
    }
  }
);

// Favorilerden Çıkarma Metodu
export const removeFavorite = createAsyncThunk(
  'weather/removeFavorite',
  async ({ favoriteId, userId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/favorites/${favoriteId}`);
      return favoriteId;
    } catch (err) {
      // Sunucu kapalıysa LocalStorage yedeğinden sil
      const localKey = `favs_${userId}`;
      const localFavs = localStorage.getItem(localKey) ? JSON.parse(localStorage.getItem(localKey)) : [];
      const updated = localFavs.filter(f => f.id !== favoriteId);
      localStorage.setItem(localKey, JSON.stringify(updated));
      return favoriteId;
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    searchQuery: '',
    selectedCity: 'İstanbul',
    weatherData: null,
    selectedHourIndex: 0,
    selectedDayIndex: 0,
    favorites: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Arama sorgusunu güncelleme
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Seçili şehri değiştirme
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    // Grafikte seçilen saati değiştirme
    setSelectedHourIndex: (state, action) => {
      state.selectedHourIndex = action.payload;
    },
    // Seçili haftalık gün indeksini değiştirme
    setSelectedDayIndex: (state, action) => {
      state.selectedDayIndex = action.payload;
      state.selectedHourIndex = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload;
        // Şehir değiştiğinde seçili saat ve gün indeksini sıfırlayalım
        state.selectedHourIndex = 0;
        state.selectedDayIndex = 0;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(f => f.id !== action.payload);
      });
  }
});

export const { setSearchQuery, setSelectedCity, setSelectedHourIndex, setSelectedDayIndex } = weatherSlice.actions;
export default weatherSlice.reducer;
