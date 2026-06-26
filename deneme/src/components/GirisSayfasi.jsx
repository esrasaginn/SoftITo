import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { girisYap, hataTemizle } from '../store/authSlice';
import arkaPlanGorseli from '../assets/karanlik_arka_plan.png';

const GirisSayfasi = () => {
  const dispatch = useDispatch();
  
  // Redux durumlarını seçiyoruz
  const { yukleniyor, hata } = useSelector((durum) => durum.yetkilendirme);

  // Yerel form durumları
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreyiGoster, setSifreyiGoster] = useState(false);
  const [yerelHata, setYerelHata] = useState('');

  // Sayfa yüklendiğinde veya kullanıcı veri girdikçe hataları temizliyoruz
  useEffect(() => {
    dispatch(hataTemizle());
    setYerelHata('');
  }, [kullaniciAdi, sifre, dispatch]);

  const formGonder = async (e) => {
    e.preventDefault();
    
    // Temel istemci tarafı doğrulaması
    if (!kullaniciAdi.trim()) {
      setYerelHata('Kullanıcı adı alanı boş bırakılamaz.');
      return;
    }
    if (!sifre) {
      setYerelHata('Şifre alanı boş bırakılamaz.');
      return;
    }
    if (sifre.length < 4) {
      setYerelHata('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    // Redux Thunk aksiyonunu tetikleme
    dispatch(girisYap(kullaniciAdi, sifre));
  };

  const aktifHata = yerelHata || hata;

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat font-sans overflow-hidden"
      style={{ backgroundImage: `url(${arkaPlanGorseli})` }}
    >
      {/* Koyu bindirme katmanı */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"></div>

      {/* Giriş Kartı */}
      <div className="relative w-full max-w-md p-8 mx-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/20">
        
        {/* Logo / Başlık Bölümü */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 animate-pulse">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight">
            Yönetici Girişi
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Devam etmek için yönetici kimliğinizi doğrulayın
          </p>
        </div>

        {/* Hata Mesajı Alanı */}
        {aktifHata && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{aktifHata}</span>
          </div>
        )}

        {/* Form Alanı */}
        <form onSubmit={formGonder} className="space-y-6" noValidate>
          
          {/* Kullanıcı Adı */}
          <div>
            <label 
              htmlFor="username" 
              className="block mb-2 text-xs font-semibold text-slate-300 uppercase tracking-wider"
            >
              Kullanıcı Adı
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                disabled={yukleniyor}
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Şifre */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label 
                htmlFor="current-password" 
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Şifre
              </label>
              <a 
                href="#unuttum" 
                onClick={(e) => {
                  e.preventDefault();
                  alert('Şifrenizi sıfırlamak için lütfen sistem yöneticinizle iletişime geçin.');
                }}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Şifremi Unuttum?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="current-password"
                name="password"
                type={sifreyiGoster ? 'text' : 'password'}
                autoComplete="current-password"
                required
                disabled={yukleniyor}
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setSifreyiGoster(!sifreyiGoster)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              >
                {sifreyiGoster ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Gönderme Butonu */}
          <button
            type="submit"
            disabled={yukleniyor}
            className="relative w-full py-3 px-4 font-semibold text-white rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden"
          >
            {yukleniyor ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <span>Giriş Yap</span>
            )}
          </button>

        </form>

        {/* Bilgilendirme Kartı */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Sisteme giriş yapmak için test bilgileri:
          </p>
          <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-950/30 p-2 rounded">
            Kullanıcı Adı: <span className="text-cyan-400 font-semibold">admin</span> | Şifre: <span className="text-cyan-400 font-semibold">sifre123</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GirisSayfasi;
