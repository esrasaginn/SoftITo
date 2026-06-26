import { createSlice } from '@reduxjs/toolkit';

// Yerel depolamadan kullanıcı bilgisini alıp başlangıç durumunu ayarlıyoruz
const ilkDurum = {
  kullanici: JSON.parse(localStorage.getItem('kullanici')) || null,
  girisYapildi: !!localStorage.getItem('kullanici'),
  hata: null,
  yukleniyor: false,
};

const yetkilendirmeDilimi = createSlice({
  name: 'yetkilendirme',
  initialState: ilkDurum,
  reducers: {
    girisBaslangic: (durum) => {
      durum.yukleniyor = true;
      durum.hata = null;
    },
    girisBasarili: (durum, aksiyon) => {
      durum.yukleniyor = false;
      durum.girisYapildi = true;
      durum.kullanici = aksiyon.payload;
      durum.hata = null;
      localStorage.setItem('kullanici', JSON.stringify(aksiyon.payload));
    },
    girisBasarisiz: (durum, aksiyon) => {
      durum.yukleniyor = false;
      durum.girisYapildi = false;
      durum.kullanici = null;
      durum.hata = aksiyon.payload;
    },
    cikisYap: (durum) => {
      durum.yukleniyor = false;
      durum.girisYapildi = false;
      durum.kullanici = null;
      durum.hata = null;
      localStorage.removeItem('kullanici');
    },
    hataTemizle: (durum) => {
      durum.hata = null;
    },
  },
});

export const {
  girisBaslangic,
  girisBasarili,
  girisBasarisiz,
  cikisYap,
  hataTemizle,
} = yetkilendirmeDilimi.actions;

// Giriş işlemi için simüle edilmiş thunk fonksiyonu
export const girisYap = (kullaniciAdi, sifre) => {
  return async (dispatch) => {
    dispatch(girisBaslangic());

    // Sunucu yanıtı simülasyonu için 1 saniye bekletiyoruz
    await new Promise((coz) => setTimeout(coz, 1000));

    // Giriş bilgilerini kontrol et (Örnek Giriş Bilgileri: admin / sifre123)
    if (kullaniciAdi === 'admin' && sifre === 'sifre123') {
      const sahteKullanici = {
        kullaniciAdi: 'admin',
        isim: 'Ahmet Yılmaz',
        rol: 'Sistem Yöneticisi',
        ePosta: 'admin@deneme.com',
      };
      dispatch(girisBasarili(sahteKullanici));
      return true;
    } else {
      dispatch(girisBasarisiz('Kullanıcı adı veya şifre hatalı!'));
      return false;
    }
  };
};

export default yetkilendirmeDilimi.reducer;
