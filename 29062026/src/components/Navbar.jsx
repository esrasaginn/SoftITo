// React kütüphanesinden Link ve navigate kancalarını, ayrıca useState ve useEffect kancalarını içe aktarır
import { Link, useNavigate } from 'react-router-dom';
// Redux kütüphanesinden selector ve dispatch kancalarını içe aktarır
import { useSelector, useDispatch } from 'react-redux';
// authSlice dosyasındaki çıkış yapma aksiyonunu içe aktarır
import { logoutUser } from '../store/slices/authSlice';
// lucide-react kütüphanesinden arayüzde kullanılacak ikonları içe aktarır
import { LogOut, User, Ticket, Sun, Moon, Plus } from 'lucide-react';
// React kütüphanesinden durum yönetimi için kancaları içe aktarır
import { useState, useEffect } from 'react';

// Sayfanın üst menü çubuğu (Navbar) bileşenini tanımlar
const Navbar = () => {
  // Redux store'dan kullanıcı bilgilerini çeker
  const { user } = useSelector((state) => state.auth);
  // Redux aksiyonlarını tetiklemek için dispatch kancasını tanımlar
  const dispatch = useDispatch();
  // Sayfalar arası geçiş yapmak için navigate kancasını hazırlar
  const navigate = useNavigate();

  // Gece modu durumunu localStorage veya sistem tercihine göre başlatır
  const [darkMode, setDarkMode] = useState(() => {
    // Tarayıcı belleğinden önceden kaydedilmiş şemayı sorgular
    const savedTheme = localStorage.getItem('color-scheme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Yoksa sistemin renk tercihine bakar
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Gece modu durumu değiştikçe html elementine sınıf ekleyen/kaldıran efekt
  useEffect(() => {
    if (darkMode) {
      // Html etiketine dark sınıfını ekler
      document.documentElement.classList.add('dark');
      // Tercihi dark olarak kaydeder
      localStorage.setItem('color-scheme', 'dark');
    } else {
      // Html etiketinden dark sınıfını temizler
      document.documentElement.classList.remove('dark');
      // Tercihi light olarak kaydeder
      localStorage.setItem('color-scheme', 'light');
    }
  }, [darkMode]);

  // Çıkış yap butonuna basıldığında çalışan fonksiyon
  const handleLogout = () => {
    // Redux store'da kullanıcı oturum durumunu sıfırlar
    dispatch(logoutUser());
    // Kullanıcıyı anasayfaya yönlendirir
    navigate('/');
  };

  // Bileşenin render edeceği JSX yapısını döner
  return (
    // Üstte yapışkan (sticky) duran, yarı şeffaf ve blurlu navigasyon alanı (gece modu destekli)
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      {/* Genişliği sınırlandırılmış ve ortalanmış esnek düzen konteyneri */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Sol Taraf: Logo ve Gece Modu Butonu Grubu */}
        <div className="flex items-center gap-4">
          {/* Logo Alanı */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Renk geçişli logo ikonu */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-150 group-hover:scale-105 transition-transform">
              B
            </div>
            {/* Logo marka metni */}
            <span className="font-extrabold text-xl bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent transition-colors">
              BiletiniAl
            </span>
          </Link>

          {/* Gece/Gündüz Modu Aç/Kapa Switch (Yuvarlak Sağa/Sola Kayan) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex items-center relative border border-slate-200/50 dark:border-slate-800 ${
              darkMode ? 'bg-indigo-650' : 'bg-slate-200'
            }`}
            type="button"
            title={darkMode ? 'Gündüz Moduna Geç' : 'Gece Moduna Geç'}
            id="themeToggleBtn"
          >
            {/* Kayan Daire */}
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Navigasyon / Kullanıcı Eylemleri Buton Grubu */}
        <div className="flex items-center gap-4">
          {/* Sefer Ekle Linki */}
          <Link
            to="/add-trip"
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-xs"
          >
            <Plus size={14} />
            <span>Sefer Ekle</span>
          </Link>

          {/* Kullanıcı oturum açmışsa gösterilecek alan */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Kullanıcı selamlama etiketi */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-950 dark:text-indigo-200 text-sm font-medium">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>{user.name}</span>
              </div>

              {/* Biletlerim sayfasına giden kısayol linki */}
              <Link
                to="/receipt"
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
              >
                <Ticket size={16} />
                <span>Biletlerim</span>
              </Link>

              {/* Çıkış Yap butonu */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                type="button"
                id="logoutBtn"
              >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          ) : (
            /* Kullanıcı oturum açmamışsa gösterilecek alan */
            <div className="flex items-center gap-2">
              {/* Giriş Yap butonu */}
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                id="navLoginBtn"
              >
                Giriş Yap
              </Link>
              {/* Kayıt Ol butonu */}
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                id="navRegisterBtn"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Navbar bileşenini dışa aktarır
export default Navbar;
