// Redux Toolkit'ten slice ve asenkron thunk oluşturma fonksiyonlarını içe aktarır
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sahte backend (json-server) API URL'ini tanımlar
const API_URL = 'http://localhost:5001';

// Tüm seferleri getiren asenkron thunk aksiyonunu tanımlar ve dışa aktarır
export const fetchTrips = createAsyncThunk(
  // Aksiyon tipi belirteci
  'tickets/fetchTrips',
  // Asenkron sefer sorgulama fonksiyonu
  async (_, { rejectWithValue }) => {
    try {
      // Sefer listesini almak için GET isteği atar
      const response = await fetch(`${API_URL}/trips`);
      // Sunucu yanıtı başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Seferler yüklenirken bir hata oluştu.');
      }
      // Gelen veriyi JSON formatına dönüştürüp döner
      return await response.json();
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Id değerine göre tek bir sefer detayı getiren asenkron thunk aksiyonunu tanımlar
export const fetchTripById = createAsyncThunk(
  // Aksiyon tipi belirteci
  'tickets/fetchTripById',
  // Sefer id bilgiisiyle asenkron sorgulama yürüten fonksiyon
  async (id, { rejectWithValue }) => {
    try {
      // Belirtilen id'li seferi almak için GET isteği atar
      const response = await fetch(`${API_URL}/trips/${id}`);
      // Sunucu yanıtı başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Sefer detayı yüklenemedi.');
      }
      // Gelen yanıtı JSON olarak döner
      return await response.json();
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Yeni bir sefer (bilet) eklemek için asenkron thunk aksiyonunu tanımlar
export const addTrip = createAsyncThunk(
  // Aksiyon tipi belirteci
  'tickets/addTrip',
  // Yeni sefer verisiyle çalışan asenkron fonksiyon
  async (tripData, { rejectWithValue }) => {
    try {
      // Sunucuya yeni sefer kaydı eklemek için POST isteği gönderir
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      // İstek başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Yeni sefer eklenirken hata oluştu.');
      }
      // Eklenen yeni sefer nesnesini JSON olarak döner
      return await response.json();
    } catch (err) {
      // Hata durumunda hata mesajını reject eder
      return rejectWithValue(err.message);
    }
  }
);

// Bilet ve sefer yönetimi için Redux slice'ını oluşturur
const ticketSlice = createSlice({
  // Dilimin adı
  name: 'tickets',
  // Başlangıç durumu nesnesi
  initialState: {
    // Sunucudan gelen tüm seferlerin listesi
    trips: [],
    // Filtrelenmiş seferlerin listesi
    filteredTrips: [],
    // Detay sayfası için seçilen aktif sefer bilgisi
    selectedTrip: null,
    // Arama kriterleri parametreleri
    searchParams: {
      // Nereden kalkış yapılacağı bilgisi
      from: '',
      // Nereye gidileceği bilgisi
      to: '',
      // Sefer tarihi
      date: '',
      // Sefer tipi ('bus' otobüs veya 'flight' uçuş)
      type: 'bus',
    },
    // Filtreleme seçenekleri
    filters: {
      // Maksimum bilet fiyatı
      maxPrice: 3000,
      // Minimum bilet fiyatı
      minPrice: 0,
      // Tercih edilen seyahat firmaları listesi
      companies: [],
      // Sıralama kriteri ('time' saat, 'price-asc' artan fiyat, 'price-desc' azalan fiyat)
      sortBy: 'time',
    },
    // Yükleniyor durumu kontrolü
    loading: false,
    // Hata mesajı kontrolü
    error: null,
  },
  // Eşzamanlı (senkron) reducer fonksiyonları
  reducers: {
    // Arama parametrelerini güncelleme fonksiyonu
    setSearchParams: (state, action) => {
      // Mevcut arama parametreleri ile yeni gelenleri birleştirir
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    // Filtreleme parametrelerini güncelleme fonksiyonu
    setFilters: (state, action) => {
      // Mevcut filtreler ile yeni gelen filtreleri birleştirir
      state.filters = { ...state.filters, ...action.payload };
    },
    // Filtreleri başlangıç değerlerine sıfırlama fonksiyonu
    resetFilters: (state) => {
      // Filtreleri varsayılan değerlerine geri döndürür
      state.filters = {
        maxPrice: 3000,
        minPrice: 0,
        companies: [],
        sortBy: 'time',
      };
    },
    // Seçili filtrelere göre seferleri süzme fonksiyonu
    applyFilters: (state) => {
      // Arama parametrelerini state'ten çıkarır
      const { from, to, date, type } = state.searchParams;
      // Filtreleme parametrelerini state'ten çıkarır
      const { maxPrice, minPrice, companies, sortBy } = state.filters;

      // Tüm seferleri filtre kriterlerine göre süzer
      let result = state.trips.filter((trip) => {
        // Nereden kalkış bilgisi eşleşmesini denetler
        const matchesFrom = from ? trip.from.toLowerCase() === from.toLowerCase() : true;
        // Nereye varış bilgisi eşleşmesini denetler
        const matchesTo = to ? trip.to.toLowerCase() === to.toLowerCase() : true;
        // Tarih eşleşmesini denetler
        const matchesDate = date ? trip.date === date : true;
        // Sefer tipi ('bus'/'flight') eşleşmesini denetler
        const matchesType = trip.type === type;

        // Fiyat aralığına uygunluğu denetler
        const matchesPrice = trip.price >= minPrice && trip.price <= maxPrice;
        // Firma seçimi yapılmışsa, seferin o firmaya ait olup olmadığını denetler
        const matchesCompany = companies.length > 0 ? companies.includes(trip.company) : true;

        // Tüm kriterler olumlu ise seferi dahil eder
        return matchesFrom && matchesTo && matchesDate && matchesType && matchesPrice && matchesCompany;
      });

      // Sıralama kriteri kontrolü
      if (sortBy === 'price-asc') {
        // Fiyata göre artan sıralama
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        // Fiyata göre azalan sıralama
        result.sort((a, b) => b.price - a.price);
      } else {
        // Varsayılan olarak kalkış saatine göre sıralama
        result.sort((a, b) => a.time.localeCompare(b.time));
      }

      // Filtrelenmiş seferler dizisini günceller
      state.filteredTrips = result;
    },
  },
  // Asenkron thunk'ların durumlarına göre state'i güncelleyen fonksiyon
  extraReducers: (builder) => {
    builder
      // Seferleri getirme işlemi başladığında
      .addCase(fetchTrips.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı temizler
        state.error = null;
      })
      // Seferler başarıyla getirildiğinde
      .addCase(fetchTrips.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Gelen tüm seferleri state'e kaydeder
        state.trips = action.payload;
        // Arama parametrelerini state'ten çıkarır
        const { from, to, date, type } = state.searchParams;
        // Temel arama kriterlerine uyan seferleri varsayılan olarak filtreler
        state.filteredTrips = action.payload.filter(
          (t) => t.type === type && 
                 (!from || t.from.toLowerCase() === from.toLowerCase()) && 
                 (!to || t.to.toLowerCase() === to.toLowerCase()) &&
                 (!date || t.date === date)
        );
      })
      // Seferler getirilemediğinde
      .addCase(fetchTrips.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Tekil sefer getirme işlemi başladığında
      .addCase(fetchTripById.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı temizler
        state.error = null;
        // Seçili seferi sıfırlar
        state.selectedTrip = null;
      })
      // Tekil sefer başarıyla yüklendiğinde
      .addCase(fetchTripById.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Gelen seferi seçili aktif sefer durumuna atar
        state.selectedTrip = action.payload;
      })
      // Tekil sefer yüklenemediğinde
      .addCase(fetchTripById.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Yeni sefer ekleme işlemi başladığında
      .addCase(addTrip.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Hatayı sıfırlar
        state.error = null;
      })
      // Yeni sefer başarıyla eklendiğinde
      .addCase(addTrip.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Yeni seferi mevcut tüm seferler listesine ekler
        state.trips.push(action.payload);
        // Yeni seferi filtrelenmiş seferler listesine de ekler (listede anında görünmesi için)
        state.filteredTrips.push(action.payload);
      })
      // Yeni sefer eklenemediğinde
      .addCase(addTrip.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını kaydeder
        state.error = action.payload;
      });
  },
});

// Senkron aksiyon oluşturucuları dışa aktarır
export const { setSearchParams, setFilters, resetFilters, applyFilters } = ticketSlice.actions;
// ticketSlice reducer'ını varsayılan olarak dışa aktarır
export default ticketSlice.reducer;
