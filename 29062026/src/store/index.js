// Redux Toolkit'ten configureStore fonksiyonunu içe aktarır
import { configureStore } from '@reduxjs/toolkit';
// Kimlik doğrulama diliminin reducer'ını içe aktarır
import authReducer from './slices/authSlice';
// Bilet işlemlerinin dilim reducer'ını içe aktarır
import ticketReducer from './slices/ticketSlice';
// Rezervasyon işlemlerinin dilim reducer'ını içe aktarır
import bookingReducer from './slices/bookingSlice';

// Redux store'unu (veri deposunu) yapılandırır ve dışa aktarır
export const store = configureStore({
  // Uygulamanın tüm reducer'larını birleştiren nesne
  reducer: {
    // Kimlik doğrulama durumu yönetimi
    auth: authReducer,
    // Bilet arama ve listeleme durumu yönetimi
    tickets: ticketReducer,
    // Rezervasyon ve ödeme durumu yönetimi
    booking: bookingReducer,
  },
});

