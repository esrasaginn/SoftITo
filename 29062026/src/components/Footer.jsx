import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                B
              </div>
              <span className="font-bold text-lg text-white">BiletiniAl</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Otobüs ve uçak seyahatleriniz için en ucuz ve en konforlu biletleri bulun, güvenle satın alın.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Anasayfa</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Giriş Yap</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Kayıt Ol</Link>
              </li>
              <li>
                <Link to="/receipt" className="hover:text-white transition-colors">Biletlerim & Makbuzlar</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" />
                <span>+90 (850) 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                <span>destek@biletinial.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>Kadıköy, İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>

          {/* About/Corporate info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Kurumsal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seyahatlerinizi kolaylaştırmak ve en iyi fiyat garantisini sunmak için 2026 yılından beri hizmetinizdeyiz. Güvenli ödeme altyapımız ile işlemleriniz 256-bit SSL koruması altındadır.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BiletiniAl. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-slate-400">Gizlilik Politikası</span>
            <span className="cursor-pointer hover:text-slate-400">KVKK Aydınlatma Metni</span>
            <span className="cursor-pointer hover:text-slate-400">Çerez Tercihleri</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
