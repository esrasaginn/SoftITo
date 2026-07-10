import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// JSON Server kapalıysa kullanılacak varsayılan acil durum meteorolojik uyarıları
const LOCAL_ALERTS = [
  {
    id: 1,
    city: "İstanbul",
    severity: "danger",
    message: "Kırmızı Kodlu Uyarı: İstanbul genelinde kuvvetli fırtına ve ani sağanak yağış bekleniyor. Çatı uçması ve su baskınlarına karşı tedbirli olun!",
    active: true
  },
  {
    id: 2,
    city: "İzmir",
    severity: "warning",
    message: "Turuncu Kodlu Uyarı: İzmir kıyı şeridinde yarın öğle saatlerinden itibaren fırtınamsı rüzgar ve yüksek dalga riski mevcuttur.",
    active: true
  }
];

// Aktif Meteorolojik Alarmları Çekme Metodu (Thunk)
export const fetchAlerts = createAsyncThunk(
  'ui/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/alerts`);
      return res.data;
    } catch (err) {
      // LocalStorage yedek kontrolü
      const stored = localStorage.getItem('weather_alerts');
      return stored ? JSON.parse(stored) : LOCAL_ALERTS;
    }
  }
);

// Yeni Meteorolojik Alarm Yayınlama Metodu
export const createAlert = createAsyncThunk(
  'ui/createAlert',
  async (alertData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/alerts`, alertData);
      return res.data;
    } catch (err) {
      const stored = localStorage.getItem('weather_alerts') ? JSON.parse(localStorage.getItem('weather_alerts')) : LOCAL_ALERTS;
      const newAlert = { id: Date.now(), ...alertData };
      const updated = [...stored, newAlert];
      localStorage.setItem('weather_alerts', JSON.stringify(updated));
      return newAlert;
    }
  }
);

// Alarmı Yayından Kaldırma (Silme) Metodu
export const deleteAlert = createAsyncThunk(
  'ui/deleteAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/alerts/${alertId}`);
      return alertId;
    } catch (err) {
      const stored = localStorage.getItem('weather_alerts') ? JSON.parse(localStorage.getItem('weather_alerts')) : LOCAL_ALERTS;
      const updated = stored.filter(a => a.id !== alertId);
      localStorage.setItem('weather_alerts', JSON.stringify(updated));
      return alertId;
    }
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentBackground: 'day-clear',
    activeVFX: [],
    alerts: [],
    loading: false,
  },
  reducers: {
    // Saat/durum değiştikçe arka plan temasını ve VFX tetikleyicilerini yöneten reducer
    updateVisualState: (state, action) => {
      const { weatherState, timeStr } = action.payload; // timeStr formatı: "HH:00"
      
      // Saate göre gündüz veya gece kontrolü yapalım
      const hour = parseInt(timeStr.split(':')[0], 10);
      const isNight = hour >= 20 || hour < 6;
      const timeOfDay = isNight ? 'night' : 'day';
      
      // Arka plan durum belirteci anahtarı (Örn: day-rain, night-storm)
      const bgKey = `${timeOfDay}-${weatherState.toLowerCase()}`;
      state.currentBackground = bgKey;

      // Hangi VFX katmanlarının aktif olacağını belirleyelim
      const vfx = [];
      if (weatherState === 'Storm') {
        vfx.push('rain', 'lightning');
      } else if (weatherState === 'Rain') {
        vfx.push('rain');
      } else if (weatherState === 'Clear' && !isNight) {
        vfx.push('sun');
      }
      
      state.activeVFX = vfx;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state) => {
        state.loading = false;
      })
      
      .addCase(createAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload);
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter(a => a.id !== action.payload);
      });
  }
});

export const { updateVisualState } = uiSlice.actions;
export default uiSlice.reducer;
