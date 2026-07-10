import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';
import uiReducer from './slices/uiSlice';

// Redux Store merkezini yapılandıralım ve reducer'ları birleştirelim
export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    ui: uiReducer,
  },
});

export default store;
