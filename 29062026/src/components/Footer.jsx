// Sayfalar arası geçiş için Link bileşenini react-router-dom kütüphanesinden içe aktarır
import { Link } from 'react-router-dom';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

// Uygulamanın alt bilgi (Footer) bileşenini tanımlar
const Footer = () => {
  // Bileşenin render edeceği JSX yapısını döner
  return (
    // Alt bilgi alanı için koyu arka planlı semantik HTML5 footer etiketi
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      {/* Genişliği sınırlandırılmış ve yatayda ortalanmış ana taşıyıcı */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dört sütunlu grid yerleşimi */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Birinci Sütun: Logo ve Firma Açıklaması */}
          <div className="space-y-4">
            {/* Logo alanı */}
            <div className="flex items-center gap-2">
              {/* Logo görsel kutusu */}
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
                B
              </div>
              {/* Marka ismi */}
              <span className="font-bold text-lg text-white">BiletiniAl</span>
            </div>
            {/* Firma kısa tanıtım yazısı */}
            <p className="text-sm text-slate-400 leading-relaxed">
              Otobüs ve uçak seyahatleriniz için en ucuz ve en konforlu biletleri bulun, güvenle satın alın.
            </p>
          </div>

          {/* İkinci Sütun: Hızlı Bağlantılar */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Hızlı Bağlantılar</h4>
            {/* Yönlendirme linklerinin listesi */}
            <ul className="space-y-2.5 text-sm">
              <li>
                {/* Anasayfa yönlendirme linki */}
                <Link to="/" className="hover:text-white transition-colors">Anasayfa</Link>
              </li>
              <li>
                {/* Giriş yap yönlendirme linki */}
                <Link to="/login" className="hover:text-white transition-colors">Giriş Yap</Link>
              </li>
              <li>
                {/* Kayıt ol yönlendirme linki */}
                <Link to="/register" className="hover:text-white transition-colors">Kayıt Ol</Link>
              </li>
              <li>
                {/* Biletlerim yönlendirme linki */}
                <Link to="/receipt" className="hover:text-white transition-colors">Biletlerim & Makbuzlar</Link>
              </li>
            </ul>
          </div>

          {/* Üçüncü Sütun: İletişim Bilgileri */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">İletişim</h4>
            {/* Telefon, E-posta ve adres detay listesi */}
            <ul className="space-y-3 text-sm">
              {/* Telefon satırı */}
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" />
                <span>+90 (850) 123 45 67</span>
              </li>
              {/* E-posta satırı */}
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                <span>destek@biletinial.com</span>
              </li>
              {/* Adres satırı */}
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>Kadıköy, İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>

          {/* Dördüncü Sütun: Kurumsal ve Güvenlik Açıklaması */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Kurumsal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seyahatlerinizi kolaylaştırmak ve en iyi fiyat garantisini sunmak için 2026 yılından beri hizmetinizdeyiz. Güvenli ödeme altyapımız ile işlemleriniz 256-bit SSL koruması altındadır.
            </p>
          </div>
        </div>

        {/* Alt Çizgi ve Telif/Yasal Bilgiler Alanı */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Telif Hakkı beyanı */}
          <p>© 2026 BiletiniAl. Tüm hakları saklıdır.</p>
          {/* Yasal linkler */}
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

// Footer bileşenini dışa aktarır
export default Footer;
