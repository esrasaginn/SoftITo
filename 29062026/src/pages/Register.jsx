import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
import Modal from '../components/Modal';
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Checkbox States
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  // Modal State
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted || !kvkkAccepted) {
      alert('Lütfen kullanım koşullarını ve KVKK metnini onaylayınız.');
      return;
    }
    dispatch(
      registerUser({
        name,
        phone,
        email,
        password,
      })
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hesap Oluşturun</h2>
          <p className="text-sm text-slate-500">Bizimle yeni seyahatlere başlamak için kaydolun.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Surname */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                placeholder="Ahmet Yılmaz"
                id="registerNameInput"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-medium transition-all outline-none"
                placeholder="5551234567"
                id="registerPhoneInput"
              />
            </div>
          </div>

          {/* Email */}
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
                id="registerEmailInput"
              />
            </div>
          </div>

          {/* Password */}
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
                id="registerPasswordInput"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2.5 py-1">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="termsCheckbox" className="text-xs text-slate-500 cursor-pointer select-none">
              Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.
            </label>
          </div>

          {/* KVKK Checkbox */}
          <div className="flex items-start gap-2.5 py-1">
            <input
              type="checkbox"
              id="kvkkCheckbox"
              checked={kvkkAccepted}
              onChange={(e) => setKvkkAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="kvkkCheckbox" className="text-xs text-slate-500 select-none cursor-pointer">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setIsKvkkModalOpen(true);
                }}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                id="kvkkLink"
              >
                KVKK Aydınlatma Metni
              </span>
              'ni okudum ve kabul ediyorum.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md shadow-indigo-150 transition-all flex items-center justify-center gap-2"
            id="registerSubmitBtn"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Hesap Oluşturuluyor...</span>
              </>
            ) : (
              <span>Kayıt Ol</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Giriş Yapın
          </Link>
        </div>
      </div>

      {/* KVKK Modal */}
      <Modal
        isOpen={isKvkkModalOpen}
        onClose={() => {
          setIsKvkkModalOpen(false);
          setKvkkAccepted(true); // Automatically accept on reading and closing, or let them click
        }}
        title="KVKK Aydınlatma Metni"
      >
        <div className="space-y-4 text-slate-600 text-xs">
          <p className="font-semibold text-slate-800">1. Veri Sorumlusu</p>
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca, kişisel verileriniz; veri sorumlusu olarak BiletiniAl A.Ş. (“Şirket”) tarafından aşağıda açıklanan kapsamda işlenebilecektir.
          </p>

          <p className="font-semibold text-slate-800">2. Kişisel Verilerin Hangi Amaçla İşleneceği</p>
          <p>
            Toplanan kişisel verileriniz, Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, bilet satış süreçlerinin yürütülmesi ve güvenli ödeme simülasyonunun gerçekleştirilmesi amacıyla Kanun’un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenecektir.
          </p>

          <p className="font-semibold text-slate-800">3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği</p>
          <p>
            Kişisel verileriniz; yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşları ile seyahatlerinizi gerçekleştirecek otobüs veya havayolu şirketlerine aktarılabilecektir.
          </p>

          <p className="font-semibold text-slate-800">4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</p>
          <p>
            Kişisel verileriniz, internet sitemiz üzerinden elektronik ortamda, üyelik formunun doldurulması ve bilet satın alma işlemlerinin yapılması sırasında toplanmaktadır. Hukuki sebebimiz, sözleşmenin kurulması ve ifası ile veri sorumlusunun meşru menfaatleridir.
          </p>

          <p className="font-semibold text-slate-800">5. Veri Sahibinin Hakları</p>
          <p>
            Kanun’un 11. maddesi uyarınca, veri sahibi olarak Şirketimize başvurarak; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, verilerinizin düzeltilmesini veya silinmesini talep etme haklarına sahipsiniz.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
