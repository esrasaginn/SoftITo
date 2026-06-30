// React kütüphanesinden useState ve useEffect kancalarını içe aktarır
import { useState, useEffect } from 'react';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// Yönlendirme işlemleri ve Link bileşeni için react-router-dom kütüphanesini içe aktarır
import { useNavigate, Link } from 'react-router-dom';
// authSlice dosyasındaki giriş yapma ve hata temizleme aksiyonlarını içe aktarır
import { loginUser, clearAuthError } from '../store/slices/authSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

// Giriş Yapma (Login) sayfa bileşenini tanımlar
const Login = () => {
  // E-posta girdisi durumunu tutan local state
  const [email, setEmail] = useState('');
  // Şifre girdisi durumunu tutan local state
  const [password, setPassword] = useState('');
  // Şifreyi göster/gizle durumunu tutan local state
  const [showPassword, setShowPassword] = useState(false);

  // Redux aksiyonlarını tetiklemek için dispatch kancasını hazırlar
  const dispatch = useDispatch();
  // Sayfalar arası geçiş yapmak için navigate kancasını hazırlar
  const navigate = useNavigate();
  // Redux store'dan kullanıcı verisi, yüklenme ve hata durumlarını çeker
  const { user, loading, error } = useSelector((state) => state.auth);

  // Sayfa ilk yüklendiğinde (mount) auth hatalarını temizleyen efekt
  useEffect(() => {
    // Redux store'da bulunan önceki auth hatalarını temizler
    dispatch(clearAuthError());
  }, [dispatch]);

  // Kullanıcı oturum açtığında otomatik yönlendirme yapan efekt
  useEffect(() => {
    // Eğer kullanıcı oturumu mevcutsa anasayfaya yönlendirir
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Giriş formu gönderildiğinde çalışan fonksiyon
  const handleSubmit = (e) => {
    // Sayfanın yenilenmesini engeller
    e.preventDefault();
    // Girdilerin boş olup olmadığını kontrol eder
    if (!email || !password) return;
    // Giriş işlemini tetikleyen Redux thunk aksiyonunu dispatch eder
    dispatch(loginUser({ email, password }));
  };

  // Bileşenin render edeceği JSX yapısını döner
  return (
    // Ekranı dikey ve yatayda ortalayan esnek sayfa düzeni
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50">
      {/* Giriş kartı çerçevesi */}
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
        {/* Başlık Alanı */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tekrar Hoş Geldiniz</h2>
          <p className="text-sm text-slate-500">Bilet almak ve seyahatlerinizi yönetmek için giriş yapın.</p>
        </div>

        {/* Hata Mesajı Bölümü (Varsa gösterilir) */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-posta Adresi Girdisi */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                placeholder="ornek@mail.com"
                id="emailInput"
              />
            </div>
          </div>

          {/* Şifre Girdisi */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                placeholder="••••••••"
                id="passwordInput"
              />
              {/* Şifre Göster/Gizle Butonu */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Giriş Yap Form Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md shadow-indigo-150 transition-all flex items-center justify-center gap-2"
            id="loginSubmitBtn"
          >
            {/* Giriş yapılıyor durum animasyonu */}
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <span>Giriş Yap</span>
            )}
          </button>
        </form>

        {/* Kayıt Sayfası Yönlendirme Alt Bölümü */}
        <div className="text-center text-sm text-slate-500">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Kayıt Olun
          </Link>
        </div>
      </div>
    </div>
  );
};

// Login bileşenini dışa aktarır
export default Login;
