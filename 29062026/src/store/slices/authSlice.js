// Redux Toolkit'ten slice ve asenkron thunk oluşturma fonksiyonlarını içe aktarır
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sahte backend (json-server) API URL'ini tanımlar
const API_URL = 'http://localhost:5001';

// Uygulama ilk açıldığında localStorage'da kullanıcı oturumu olup olmadığını kontrol eder
const getInitialUser = () => {
  // localStorage'dan 'user' anahtarındaki veriyi alır
  const storedUser = localStorage.getItem('user');
  try {
    // Eğer veri varsa JSON olarak ayrıştırır ve döner, yoksa null döner
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    // Herhangi bir JSON ayrıştırma hatasında null döner
    return null;
  }
};

// Kullanıcı girişi için asenkron thunk aksiyonunu tanımlar
export const loginUser = createAsyncThunk(
  // Aksiyon tipi belirteci
  'auth/loginUser',
  // Giriş bilgileriyle asenkron işlem yürüten fonksiyon
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Girilen e-posta ve şifreye uygun kullanıcıyı sorgulamak için istek atar
      const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      // Sunucu yanıtı başarılı değilse hata fırlatır
      if (!response.ok) {
        throw new Error('Giriş başarısız oldu.');
      }
      // Gelen yanıtı JSON verisine dönüştürür
      const data = await response.json();
      // Eşleşen kullanıcı bulunamazsa hata mesajı döner
      if (data.length === 0) {
        return rejectWithValue('E-posta adresi veya şifre hatalı.');
      }
      // Eşleşen ilk kullanıcıyı alır
      const user = data[0];
      // Kullanıcı bilgisini tarayıcı belleğine (localStorage) kaydeder
      localStorage.setItem('user', JSON.stringify(user));
      // Başarılı giriş durumunda kullanıcı bilgisini döner
      return user;
    } catch (err) {
      // Hata durumunda hata mesajını veya varsayılan mesajı reject eder
      return rejectWithValue(err.message || 'Bir hata oluştu.');
    }
  }
);

// Yeni kullanıcı kaydı için asenkron thunk aksiyonunu tanımlar
export const registerUser = createAsyncThunk(
  // Aksiyon tipi belirteci
  'auth/registerUser',
  // Kullanıcı bilgileriyle asenkron kayıt işlemi yürüten fonksiyon
  async (userData, { rejectWithValue }) => {
    try {
      // Kayıt edilmek istenen e-postanın zaten kayıtlı olup olmadığını kontrol eder
      const checkResponse = await fetch(`${API_URL}/users?email=${encodeURIComponent(userData.email)}`);
      // Gelen sonucu JSON olarak alır
      const existingUsers = await checkResponse.json();
      // Eğer bu e-postaya sahip bir kullanıcı varsa hata döner
      if (existingUsers.length > 0) {
        return rejectWithValue('Bu e-posta adresi zaten kayıtlı.');
      }

      // Yeni kullanıcıyı sunucuya kaydetmek için POST isteği gönderir
      const response = await fetch(`${API_URL}/users`, {
        // İstek yöntemi POST
        method: 'POST',
        // Başlık bilgisi olarak JSON gönderildiğini belirtir
        headers: {
          'Content-Type': 'application/json',
        },
        // Kullanıcı verisini JSON dizesine dönüştürerek gövdeye ekler
        body: JSON.stringify(userData),
      });

      // Kayıt başarısızsa hata fırlatır
      if (!response.ok) {
        throw new Error('Kayıt işlemi başarısız oldu.');
      }

      // Yeni oluşturulan kullanıcı bilgisini JSON olarak alır
      const newUser = await response.json();
      // Oturumu açık tutmak amacıyla localStorage'a kaydeder
      localStorage.setItem('user', JSON.stringify(newUser));
      // Yeni kullanıcı nesnesini döner
      return newUser;
    } catch (err) {
      // Kayıt sırasında oluşan hatayı reject eder
      return rejectWithValue(err.message || 'Kayıt olurken bir hata oluştu.');
    }
  }
);

// Kimlik doğrulama işlemleri için Redux slice'ını oluşturur
const authSlice = createSlice({
  // Dilimin adı
  name: 'auth',
  // Başlangıç durumu nesnesi
  initialState: {
    // localStorage'dan yüklenen kullanıcı bilgisi
    user: getInitialUser(),
    // Yükleniyor durumu kontrolü
    loading: false,
    // Hata mesajı kontrolü
    error: null,
  },
  // Eşzamanlı (senkron) reducer fonksiyonları
  reducers: {
    // Çıkış yapma fonksiyonu
    logoutUser: (state) => {
      // Kullanıcı durumunu sıfırlar
      state.user = null;
      // Varsa hata bilgisini sıfırlar
      state.error = null;
      // localStorage'daki kullanıcı verisini siler
      localStorage.removeItem('user');
    },
    // Hata durumunu temizleme fonksiyonu
    clearAuthError: (state) => {
      // Hata durumunu null yapar
      state.error = null;
    }
  },
  // Asenkron thunk'ların sonuçlarına göre state'i güncelleyen fonksiyon
  extraReducers: (builder) => {
    builder
      // Giriş işlemi başladığında
      .addCase(loginUser.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Önceki hatayı sıfırlar
        state.error = null;
      })
      // Giriş işlemi başarıyla tamamlandığında
      .addCase(loginUser.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Kullanıcı verisini state'e atar
        state.user = action.payload;
      })
      // Giriş işlemi başarısız olduğunda
      .addCase(loginUser.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Hata mesajını state'e yazar
        state.error = action.payload;
      })
      // Kayıt işlemi başladığında
      .addCase(registerUser.pending, (state) => {
        // Yükleniyor durumunu aktif eder
        state.loading = true;
        // Önceki hatayı sıfırlar
        state.error = null;
      })
      // Kayıt işlemi başarıyla tamamlandığında
      .addCase(registerUser.fulfilled, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Yeni kayıt olan kullanıcıyı state'e yazar
        state.user = action.payload;
      })
      // Kayıt işlemi başarısız olduğunda
      .addCase(registerUser.rejected, (state, action) => {
        // Yükleniyor durumunu kapatır
        state.loading = false;
        // Kayıt hatasını state'e yazar
        state.error = action.payload;
      });
  },
});

// Senkron aksiyon oluşturucuları dışa aktarır
export const { logoutUser, clearAuthError } = authSlice.actions;
// authSlice reducer'ını varsayılan olarak dışa aktarır
export default authSlice.reducer;
