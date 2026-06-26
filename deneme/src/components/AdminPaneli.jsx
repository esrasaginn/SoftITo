import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cikisYap } from '../store/authSlice';

const AdminPaneli = () => {
  const dispatch = useDispatch();
  const { kullanici } = useSelector((durum) => durum.yetkilendirme);

  const oturumuKapat = () => {
    dispatch(cikisYap());
  };

  // Simüle edilmiş istatistik verileri
  const istatistikler = [
    { baslik: 'Toplam Kullanıcı', deger: '1,248', artis: '+%12.4', renk: 'text-emerald-400', ikon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { baslik: 'Sunucu Durumu', deger: 'Aktif / Stabil', artis: '%99.9 UP', renk: 'text-cyan-400', ikon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { baslik: 'Aktif Oturumlar', deger: '42', artis: 'Şu Anda', renk: 'text-purple-400', ikon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    )},
    { baslik: 'Hata Raporları', deger: '0', artis: 'Temiz', renk: 'text-rose-400', ikon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )},
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Yan Panel (Sidebar) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
              Y
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">Yönetim</h2>
              <p className="text-xs text-cyan-400 font-semibold">Admin Panel v1.0</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <a href="#panel" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white font-medium transition-colors">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Gösterge Paneli</span>
            </a>
            <a href="#kullanicilar" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Kullanıcı Yönetimi</span>
            </a>
            <a href="#ayarlar" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Sistem Ayarları</span>
            </a>
          </nav>
        </div>

        {/* Çıkış Yap Butonu */}
        <button
          onClick={oturumuKapat}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors w-full font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Oturumu Kapat</span>
        </button>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Üst Başlık (Header) */}
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-8 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Hoş Geldiniz, {kullanici?.isim}</h1>
            <p className="text-xs text-slate-400">{kullanici?.rol}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">{kullanici?.isim}</p>
              <p className="text-xs text-cyan-400 font-mono">{kullanici?.ePosta}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400 border border-slate-700">
              {kullanici?.isim.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Panel Gövdesi */}
        <div className="p-8 space-y-8 flex-1">
          
          {/* Hoş Geldin Kartı */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 p-8 shadow-xl">
            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Yönetici Paneli Aktif</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 mb-4">Sistem Kontrolü Tamamen Sizde</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Redux Toolkit ile yönetilen kimlik doğrulama oturumunuz başarıyla başlatıldı. Bu ekranı ve Redux durumlarını test etmek için sol paneldeki seçenekleri kullanabilir veya üst menüden oturumunuzu sonlandırabilirsiniz.
              </p>
            </div>
            {/* Arka plan süslemesi */}
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none pointer-events-none">
              <svg className="w-80 h-80 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 11.388c-.686-.184-1.166-.807-1.166-1.517v-1.742c0-.71.48-1.333 1.166-1.517l1.37-.367a7.994 7.994 0 011.085-2.62l-.766-1.2c-.38-.59-.26-1.37.28-1.815l1.233-1.026c.54-.445 1.3-.39 1.77.126l.95 1.047A7.99 7.99 0 0110 3a7.99 7.99 0 012.926.554l.95-1.047c.47-.516 1.23-.57 1.77-.126l1.233 1.026c.54.445.66 1.225.28 1.815l-.766 1.2a7.994 7.994 0 011.085 2.62l1.37.367c.686.184 1.166.807 1.166 1.517v1.742c0 .71-.48 1.333-1.166 1.517l-1.37.367a7.994 7.994 0 01-1.085 2.62l.766 1.2c.38.59.26 1.37-.28 1.815l-1.233 1.026c-.54.445-1.3.39-1.77-.126l-.95-1.047A7.99 7.99 0 0110 17a7.99 7.99 0 01-2.926-.554l-.95 1.047c-.47.516-1.23.57-1.77.126l-1.233-1.026c-.54-.445-.66-1.225-.28-1.815l.766-1.2a7.994 7.994 0 01-1.085-2.62l-1.37-.367zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {istatistikler.map((kart, index) => (
              <div key={index} className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-lg hover:border-slate-700 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-slate-400 font-medium">{kart.baslik}</span>
                  <span className={`p-2 rounded-lg bg-slate-950 ${kart.renk} border border-slate-800`}>
                    {kart.ikon}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-extrabold text-white">{kart.deger}</span>
                  <span className="text-xs text-slate-500 font-semibold">{kart.artis}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sistem Logları */}
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Son Sistem Hareketleri</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-300">Yönetici Girişi Başarılı</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">Az önce</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-300">Redux Toolkit Mağazası Başlatıldı</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">1 dakika önce</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="text-slate-300">Tailwind CSS v4 Derleme Motoru Hazırlandı</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">2 dakika önce</span>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default AdminPaneli;
