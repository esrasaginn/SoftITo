// React kütüphanesinden useEffect kancasını içe aktarır
import { useEffect } from 'react';
// Yönlendirme, konum ve Link durumları için ilgili kancaları içe aktarır
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// bookingSlice dosyasındaki rezervasyon çekme ve temizleme aksiyonlarını içe aktarır
import { fetchUserBookings, clearCurrentBooking } from '../store/slices/bookingSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { CheckCircle2, XCircle, Calendar, Clock, MapPin, Armchair, ChevronRight, User, Mail, CreditCard, Ticket, Bus, Plane } from 'lucide-react';

// Bilet Makbuzu ve Geçmiş Biletler (Receipt) sayfa bileşenini tanımlar
const Receipt = () => {
  // Yönlendirme ile gelen state verisini almak için location kancasını hazırlar
  const location = useLocation();
  // Sayfalar arası geçiş yapmak için navigate kancasını hazırlar
  const navigate = useNavigate();
  // Redux aksiyonlarını tetiklemek için dispatch kancasını tanımlar
  const dispatch = useDispatch();

  // Redux store'dan kullanıcı bilgilerini çeker
  const { user } = useSelector((state) => state.auth);
  // Redux store'dan rezervasyonlar listesini ve yüklenme durumunu çeker
  const { bookings, loading } = useSelector((state) => state.booking);

  // Yönlendirme state'i üzerinden aktarılan simülasyon ve rezervasyon detaylarını çeker
  const { status, booking, trip, selectedSeats, totalPrice, errorMessage } = location.state || {};

  // Sayfa yüklendiğinde kullanıcının rezervasyon geçmişini getiren efekt
  useEffect(() => {
    // Kullanıcı oturumu varsa rezervasyon geçmişini sunucudan yükler
    if (user) {
      dispatch(fetchUserBookings(user.id));
    }
    // Bileşen unmount (kapatıldığında) olduğunda aktif rezervasyonu temizler
    return () => {
      dispatch(clearCurrentBooking());
    };
  // user veya dispatch değiştikçe tetiklenir
  }, [user, dispatch]);

  // Yazıcı çıktı/PDF indirme işlemini tetikleyen fonksiyon
  const handlePrint = () => {
    window.print();
  };

  // 1. Durum: EĞER yeni yapılan bir ödeme sonucunu (başarılı/başarısız) gösteriyorsak
  if (status === 'success' || status === 'failed') {
    // İşlemin başarılı olup olmadığını kontrol eder
    const isSuccess = status === 'success';

    // Başarı veya başarısızlık ekranına ait JSX yapısını döner
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex-1 flex flex-col justify-center text-left">
        {isSuccess ? (
          /* BAŞARILI BİLET MAKBUZ KARTI */
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:border-0">
            {/* Yeşil geçişli Başarı Başlığı */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white space-y-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md mb-2">
                {/* Onay simgesi */}
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-black">Ödemeniz Başarılı!</h2>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                Bilet Rezervasyon Kaydınız Tamamlandı
              </p>
            </div>

            {/* Makbuz detay verileri */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* PNR Numarası ve İşlem Tarihi alanı */}
              <div className="flex justify-between items-center border-b border-slate-150 pb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PNR Numarası</span>
                  <span className="font-mono font-black text-slate-800 text-lg uppercase">
                    {/* Rezervasyon ID değerine göre PNR numarası oluşturur */}
                    {booking?.id ? `PNR-${booking.id.toString().toUpperCase()}` : 'PNR-MOCK123'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">İşlem Tarihi</span>
                  <span className="text-xs font-bold text-slate-600">
                    {/* Rezervasyon tarihi varsa biçimlendirerek yazar */}
                    {booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Seyahat/Sefer Özet Kartı */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  {/* Seyahat Firması adı */}
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {booking?.tripDetails?.company || 'Seyahat Firması'}
                  </span>
                  {/* Seyahat türü (Otobüs / Uçak) etiketi */}
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md">
                    {booking?.tripDetails?.type === 'bus' ? 'Otobüs' : 'Uçak'}
                  </span>
                </div>

                {/* Kalkış ve Varış Detayları gridi */}
                <div className="grid grid-cols-3 items-center text-center">
                  {/* Kalkış istasyonu ve saati */}
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Kalkış</span>
                    <span className="font-extrabold text-slate-855 text-base block">{booking?.tripDetails?.from}</span>
                    <span className="text-xs font-bold text-slate-500 block">{booking?.tripDetails?.time}</span>
                  </div>
                  {/* Görsel ara çizgi */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-0.5 bg-slate-200 relative my-1">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    </div>
                  </div>
                  {/* Varış istasyonu ve tarihi */}
                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Varış</span>
                    <span className="font-extrabold text-slate-855 text-base block">{booking?.tripDetails?.to}</span>
                    <span className="text-xs font-bold text-slate-500 block">{booking?.tripDetails?.date}</span>
                  </div>
                </div>

                {/* Koltuk numaraları ve toplam tutar satırı */}
                <div className="border-t border-slate-200/60 pt-3 flex justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Armchair size={14} className="text-slate-400" />
                    Koltuklar: {booking?.selectedSeats?.join(', ')}
                  </span>
                  <span>Tutar: {booking?.totalPrice} ₺</span>
                </div>
              </div>

              {/* Yolcu Faturalama Detayları */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Yolcu ve Fatura Bilgileri</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                  {/* Yolcu adı */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Ad Soyad</span>
                    <span>{booking?.passengerDetails?.name}</span>
                  </div>
                  {/* Yolcu telefonu */}
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Telefon</span>
                    <span>{booking?.passengerDetails?.phone}</span>
                  </div>
                  {/* Yolcu e-postası */}
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-bold">E-posta</span>
                    <span>{booking?.passengerDetails?.email}</span>
                  </div>
                </div>
              </div>

              {/* Yazdırma ve Arama sayfasına dönme butonları */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 print:hidden">
                {/* PDF/Yazdır butonu */}
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Yazdır / PDF İndir
                </button>
                {/* Yeni Arama başlatma butonu */}
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  Yeni Bilet Ara
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* BAŞARISIZ ÖDEME UYARI KARTI */
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-2">
              {/* Başarısızlık çarpı simgesi */}
              <XCircle size={44} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Ödemeniz Gerçekleştirilemedi</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {errorMessage || 'İşleminiz banka veya kart sağlayıcısı tarafından reddedildi.'}
              </p>
            </div>

            {/* Hata Kapsamı Detay Bilgisi */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl text-left text-xs font-bold text-slate-600 space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Hata Sebebi:</span>
                <span className="text-rose-600">{errorMessage || 'Reddedildi'}</span>
              </div>
              <div className="flex justify-between">
                <span>Denenecek Tutar:</span>
                <span className="text-slate-800">{totalPrice} ₺</span>
              </div>
            </div>

            {/* Tekrar deneme veya İptal etme aksiyon butonları */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {/* Geri dönüp bilgileri güncelleme butonu */}
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-colors"
              >
                Bilgileri Güncelle & Tekrar Dene
              </button>
              {/* Anasayfaya dönme butonu */}
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
              >
                İptal Et ve Anasayfaya Git
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Durum: EĞER genel Bilet Geçmişi sekmesini görüntülüyorsak
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col text-left space-y-6">
      {/* Sayfa başlığı ve alt başlık */}
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Ticket size={24} className="text-indigo-600" />
          <span>Biletlerim ve Rezervasyonlarım</span>
        </h2>
        <p className="text-xs text-slate-500">Satın aldığınız geçmiş seyahat biletleri ve detayları.</p>
      </div>

      {/* Yüklenme veya üyelik durumuna göre liste render edilir */}
      {loading ? (
        // Yükleniyor spinner'ı
        <div className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : !user ? (
        /* Giriş yapmamış kullanıcı uyarısı */
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <User size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Geçmiş Biletleri Görüntüle</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Satın aldığınız veya ayırtmış olduğunuz biletleri görüntülemek için lütfen hesabınıza giriş yapın.
            </p>
          </div>
          {/* Giriş sayfasına yönlendirme linki */}
          <Link
            to="/login"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      ) : bookings.length > 0 ? (
        /* Kullanıcı giriş yapmışsa ve rezervasyon kaydı varsa listeleme alanı */
        <div className="space-y-4">
          {/* Rezervasyon geçmişi döngüsü */}
          {bookings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 hover:border-indigo-50 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              {/* Rota ve Firma bilgileri */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Ulaşım türü ikonu (Otobüs / Uçak) */}
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  {item.tripDetails?.type === 'bus' ? <Bus size={18} /> : <Plane size={18} />}
                </div>
                <div>
                  {/* Nereden Nereye seyahat güzergahı */}
                  <h4 className="font-extrabold text-slate-800 text-sm">
                    {item.tripDetails?.from} → {item.tripDetails?.to}
                  </h4>
                  {/* Firma adı ve sefer cinsi */}
                  <span className="text-[10px] text-slate-400 font-bold">
                    {item.tripDetails?.company} • {item.tripDetails?.type === 'bus' ? 'Otobüs' : 'Uçak'}
                  </span>
                </div>
              </div>

              {/* Seyahat Zaman Ayrıntıları */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 shrink-0 w-full sm:w-60">
                {/* Sefer Tarih ve Saat bilgisi */}
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">TARİH & SAAT</span>
                  <span>{item.tripDetails?.date} - {item.tripDetails?.time}</span>
                </div>
                {/* Seçilen koltukların numaraları */}
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">KOLTUKLAR</span>
                  <span>{item.selectedSeats?.join(', ')}</span>
                </div>
              </div>

              {/* Bilet Fiyatı ve Makbuz Detaylarına gitme butonu */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-50 pt-4 sm:pt-0 sm:border-0">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] text-slate-400 block font-bold">TUTAR</span>
                  <span className="text-base font-extrabold text-indigo-600">{item.totalPrice} ₺</span>
                </div>
                {/* İlgili biletin makbuzunu gösteren detay butonu */}
                <button
                  onClick={() =>
                    navigate('/receipt', {
                      state: {
                        status: 'success',
                        booking: item,
                      },
                    })
                  }
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>Makbuz Detayı</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Giriş yapmış ama henüz hiç bilet satın almamış kullanıcı görünümü */
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-sm text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <Ticket size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">Henüz Seyahat Kaydınız Yok</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Satın almış olduğunuz herhangi bir otobüs veya uçak bileti bulunamadı.
            </p>
          </div>
          {/* Bilet aramaya yönlendiren buton */}
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            type="button"
          >
            Sefer Aramaya Başla
          </button>
        </div>
      )}
    </div>
  );
};

// Receipt bileşenini dışa aktarır
export default Receipt;
