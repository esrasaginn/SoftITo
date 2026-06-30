// Redux Toolkit'ten slice ve asenkron thunk oluşturma fonksiyonlarını içe aktarır
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// ticketSlice içindeki seferleri getiren fetchTrips thunk'ını içe aktarır
import { fetchTrips } from './ticketSlice';

// Sahte backend (json-server) API URL'ini tanımlar
const API_URL = 'http://localhost:5001';

// Rezervasyonu tamamlamak için asenkron thunk aksiyonunu tanımlar ve dışa aktarır
export const completeBooking = createAsyncThunk(
  // Aksiyon tipi belirteci
  'booking/completeBooking',
  // Rezervasyon verileriyle asenkron işlem yürüten fonksiyon
  async ({ trip, selectedSeats, passengerDetails, user }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Seferdeki koltuk durumlarını günceller (seçilen koltukları dolu 'isOccupied: true' yapar)
      const updatedSeats = trip.seats.map((seat) => {
        // Seçilen koltuklar dizisinde mevcut koltuk numarası varsa
        if (selectedSeats.includes(seat.number)) {
          // Koltuğu dolu olarak işaretleyerek yeni nesne döner
          return { ...seat, isOccupied: true };
        }
        // Değişiklik yoksa orijinal koltuk nesnesini döner
        return seat;
      });

      // 2. Güncellenmiş koltuk bilgisini sunucudaki ilgili sefere PATCH isteği ile gönderir
      const tripUpdateResponse = await fetch(`${API_URL}/trips/${trip.id}`, {
        // İstek yöntemi PATCH
        method: 'PATCH',
        // Başlık bilgisi olarak JSON gönderildiğini belirtir
        headers: {
          'Content-Type': 'application/json',
        },
        // Güncellenmiş koltukları gövdeye ekler
        body: JSON.stringify({ seats: updatedSeats }),
      });

      // İstek başarısızsa hata fırlatır
      if (!tripUpdateResponse.ok) {
        throw new Error('Koltuk rezervasyonu güncellenirken hata oluştu.');
      }

      // 3. Rezervasyon kaydına ait verileri hazırlar
      const bookingData = {
        // Kullanıcı giriş yapmışsa onun id'sini, yapmamışsa 'guest' değerini atar
        userId: user ? user.id : 'guest',
        // Kullanıcı e-postasını veya formdan girilen yolcu e-postasını atar
        userEmail: user ? user.email : passengerDetails.email,
        // Kullanıcı adını veya formdan girilen yolcu adını atar
        userName: user ? user.name : passengerDetails.name,
        // İlgili seferin benzersiz kimliğini (id) atar
        tripId: trip.id,
        // Sefer detaylarını özetleyen alt nesne
        tripDetails: {
          from: trip.from,
          to: trip.to,
          date: trip.date,
          time: trip.time,
          type: trip.type,
          company: trip.company,
        },
        // Seçilen koltukların numaralarını içeren dizi
        selectedSeats,
        // Toplam bilet fiyatını hesaplar (sefer fiyatı * koltuk sayısı)
        totalPrice: trip.price * selectedSeats.length,
        // Yolcu detaylarını atar
        passengerDetails,
        // Rezervasyon tarihini ISO formatında atar
        bookingDate: new Date().toISOString(),
        // Ödeme durumunu başarılı olarak işaretler
        paymentStatus: 'success',
      };

      // Hazırlanan rezervasyon verisini sunucuya kaydetmek için POST isteği gönderir
      const bookingResponse = await fetch(`${API_URL}/bookings`, {
        // İstek yöntemi POST
        method: 'POST',
        // Başlık bilgisi olarak JSON gönderildiğini belirtir
        headers: {
          'Content-Type': 'application/json',
        },
        // Rezervasyon verisini JSON dizesine dönüştürerek gövdeye ekler
        body: JSON.stringify(bookingData),
      });

      // İstek başarısızsa hata fırlatır
      if (!bookingResponse.ok) {
        throw new Error('Rezervasyon kaydı oluşturulamadı.');
      }

      // Sunucudan dönen rezervasyon sonucunu JSON olarak alır
      const bookingResult = await bookingResponse.json();

      // UI üzerinde güncel koltuk doluluk oranlarını görmek için sefer listesini yeniler
      await dispatch(fetchTrips());

      // Rezervasyon sonucunu döner
      return bookingResult;
    } catch (err) {
      // Hata durumunda hata mesajını veya varsayılan mesajı reject eder
      return rejectWithValue(err.message || 'Ödeme ve rezervasyon kaydı başarısız oldu.');
    }
  }
);

// Kullanıcıya ait eski rezervasyonları getiren asenkron thunk aksiyonunu tanımlar
export const fetchUserBookings = createAsyncThunk(
  // Aksiyon tipi belirteci
  'booking/fetchUserBookings',
  // Kullanıcı id'sine göre asenkron sorgulama yürüten fonksiyon
  async (userId, { rejectWithValue }) => {
    try {
      // Belirtilen kullanıcı id'sine sahip rezervasyonları getirmek için istek atar
      const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
      // Sunucu yanıtı başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Rezervasyonlarınız yüklenemedi.');
      }
      // Gelen yanıtı JSON olarak döner
      return await response.json();
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Rezervasyon detaylarını güncellemek için asenkron thunk aksiyonunu tanımlar
export const updateBooking = createAsyncThunk(
  // Aksiyon tipi belirteci
  'booking/updateBooking',
  // Güncellenecek rezervasyon id'si ve yeni verilerle çalışan asenkron fonksiyon
  async ({ bookingId, updatedData }, { rejectWithValue }) => {
    try {
      // Rezervasyon detayını güncellemek için PATCH isteği gönderir
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        // İstek yöntemi PATCH
        method: 'PATCH',
        // Başlık bilgisi olarak JSON gönderildiğini belirtir
        headers: {
          'Content-Type': 'application/json',
        },
        // Güncellenecek verileri gövdeye JSON olarak ekler
        body: JSON.stringify(updatedData),
      });
      // İstek başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Rezervasyon güncellenirken hata oluştu.');
      }
      // Güncellenmiş rezervasyon nesnesini JSON olarak döner
      return await response.json();
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Rezervasyonu silmek (iptal etmek) için asenkron thunk aksiyonunu tanımlar
export const deleteBooking = createAsyncThunk(
  // Aksiyon tipi belirteci
  'booking/deleteBooking',
  // İptal edilecek rezervasyon nesnesiyle çalışan asenkron fonksiyon
  async (booking, { dispatch, rejectWithValue }) => {
    try {
      // Rezervasyonu sunucudan silmek için DELETE isteği gönderir
      const response = await fetch(`${API_URL}/bookings/${booking.id}`, {
        // İstek yöntemi DELETE
        method: 'DELETE',
      });
      // İstek başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Rezervasyon iptal edilirken hata oluştu.');
      }

      // İlgili seferin rezerve edilen koltuklarını tekrar boşaltmak için sefer detayını çeker
      const tripResponse = await fetch(`${API_URL}/trips/${booking.tripId}`);
      // Sefer başarıyla çekildiyse koltukları günceller
      if (tripResponse.ok) {
        const trip = await tripResponse.json();
        // İptal edilen koltukları boş ('isOccupied: false') olarak işaretler
        const updatedSeats = trip.seats.map((seat) => {
          // İptal edilen koltuklar listesinde bu koltuk numarası varsa
          if (booking.selectedSeats.includes(seat.number)) {
            // Boş olarak işaretleyerek döner
            return { ...seat, isOccupied: false };
          }
          // Değişiklik yoksa orijinal koltuk nesnesini döner
          return seat;
        });

        // Seferin güncellenmiş koltuk şemasını sunucuya PATCH eder
        await fetch(`${API_URL}/trips/${booking.tripId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ seats: updatedSeats }),
        });
      }

      // Koltuk doluluk durumunun arayüzde güncellenmesi için seferleri yeniden yükler
      await dispatch(fetchTrips());

      // Silinen rezervasyon id değerini döner
      return booking.id;
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Rezervasyon durumu yönetimi için Redux slice'ını oluşturur
const bookingSlice = createSlice({
  // Dilimin adı
  name: 'booking',
  // Başlangıç durumu nesnesi
  initialState: {
    // Tüm rezervasyonların listesi
    bookings: [],
    // Yükleniyor durumu kontrolü
    loading: false,
    // Hata mesajı kontrolü
    error: null,
    // En son yapılan/aktif rezervasyonun bilgisi
    currentBooking: null,
  },
  // Eşzamanlı (senkron) reducer fonksiyonları
  reducers: {
    // Mevcut/aktif rezervasyon bilgilerini temizleme fonksiyonu
    clearCurrentBooking: (state) => {
      // Aktif rezervasyonu sıfırlar
      state.currentBooking = null;
      // Varsa hatayı sıfırlar
      state.error = null;
    },
  },
  // Asenkron thunk'ların durumlarına göre state'i güncelleyen fonksiyon
  extraReducers: (builder) => {
    builder
      // Rezervasyon tamamlama işlemi başladığında
      .addCase(completeBooking.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Önceki hatayı temizler
        state.error = null;
      })
      // Rezervasyon başarıyla tamamlandığında
      .addCase(completeBooking.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Gelen sonucu mevcut rezervasyon olarak kaydeder
        state.currentBooking = action.payload;
        // Gelen sonucu tüm rezervasyonlar listesine ekler
        state.bookings.push(action.payload);
      })
      // Rezervasyon başarısız olduğunda
      .addCase(completeBooking.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Rezervasyon listesi yüklenmeye başladığında
      .addCase(fetchUserBookings.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı temizler
        state.error = null;
      })
      // Rezervasyon listesi başarıyla yüklendiğinde
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Gelen rezervasyon listesini state'e atar
        state.bookings = action.payload;
      })
      // Rezervasyon listesi yüklenemediğinde
      .addCase(fetchUserBookings.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Rezervasyon güncellenme işlemi başladığında
      .addCase(updateBooking.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı temizler
        state.error = null;
      })
      // Rezervasyon başarıyla güncellendiğinde
      .addCase(updateBooking.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Rezervasyonlar listesindeki ilgili kaydı yenisiyle günceller
        state.bookings = state.bookings.map((booking) =>
          booking.id === action.payload.id ? action.payload : booking
        );
        // Eğer güncellenen rezervasyon aktif rezervasyonsa onu da günceller
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      // Rezervasyon güncellenemediğinde
      .addCase(updateBooking.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Rezervasyon silme/iptal işlemi başladığında
      .addCase(deleteBooking.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı temizler
        state.error = null;
      })
      // Rezervasyon başarıyla silindiğinde
      .addCase(deleteBooking.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // İptal edilen rezervasyonu listeden çıkarır
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
        // Eğer iptal edilen rezervasyon aktif rezervasyonsa temizler
        if (state.currentBooking && state.currentBooking.id === action.payload) {
          state.currentBooking = null;
        }
      })
      // Rezervasyon silinemediğinde
      .addCase(deleteBooking.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      });
  },
});

// Senkron aksiyon oluşturucuları dışa aktarır
export const { clearCurrentBooking } = bookingSlice.actions;
// bookingSlice reducer'ını varsayılan olarak dışa aktarır
export default bookingSlice.reducer;
