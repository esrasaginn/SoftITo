import { configureStore } from '@reduxjs/toolkit';
import yetkilendirmeYapilandirici from './authSlice';

// Redux deposunu oluşturup yapılandırıyoruz
export const depo = configureStore({
  reducer: {
    yetkilendirme: yetkilendirmeYapilandirici,
  },
});
