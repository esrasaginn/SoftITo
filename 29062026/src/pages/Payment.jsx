// React kütüphanesinden useState ve useEffect kancalarını içe aktarır
import { useState, useEffect } from 'react';
// Yönlendirme ve konum durumlarını almak için ilgili kancaları içe aktarır
import { useLocation, useNavigate } from 'react-router-dom';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// bookingSlice dosyasındaki rezervasyon tamamlama aksiyonunu içe aktarır
import { completeBooking } from '../store/slices/bookingSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { CreditCard, User, Mail, Phone, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

// Ödeme İşlemleri (Payment) sayfa bileşenini tanımlar
const Payment = () => {
  // Yönlendirme ile gelen state verisini almak için location kancasını hazırlar
  const location = useLocation();
  // Sayfalar arası geçiş yapmak için navigate kancasını hazırlar
  const navigate = useNavigate();
  // Redux aksiyonlarını tetiklemek için dispatch kancasını tanımlar
  const dispatch = useDispatch();

  // Redux store'dan kullanıcı bilgilerini çeker
  const { user } = useSelector((state) => state.auth);
  // Redux store'dan rezervasyonun yükleniyor durumunu çeker
  const { loading } = useSelector((state) => state.booking);

  // Yönlendirme state'i üzerinden aktarılan sefer, seçilen koltuklar ve toplam fiyatı çeker
  const { trip, selectedSeats, totalPrice } = location.state || {};

  // Yolcu adı soyadı bilgisini tutan state (oturum varsa kullanıcı adını varsayılan yapar)
  const [passengerName, setPassengerName] = useState(user ? user.name : '');
  // Yolcu e-posta bilgisini tutan state (oturum varsa e-postayı varsayılan yapar)
  const [passengerEmail, setPassengerEmail] = useState(user ? user.email : '');
  // Yolcu telefon bilgisini tutan state (oturum varsa telefonu varsayılan yapar)
  const [passengerPhone, setPassengerPhone] = useState(user ? user.phone : '');

  // Kredi kartı üzerindeki isim bilgisini tutan state
  const [cardName, setCardName] = useState('');
  // Kredi kartı numarasını tutan state
  const [cardNumber, setCardNumber] = useState('');
  // Kartın son kullanma tarihi bilgisini tutan state
  const [cardExpiry, setCardExpiry] = useState('');
  // Kartın CVV/CVC güvenlik kodu bilgisini tutan state
  const [cardCvv, setCardCvv] = useState('');

  // Simüle edilecek ödeme sonucunu (Başarılı / Başarısız) seçtiren state
  const [simulateSuccess, setSimulateSuccess] = useState(true);

  // Sayfa yüklendiğinde gerekli sefer ve koltuk bilgilerinin doğruluğunu denetleyen efekt
  useEffect(() => {
    // Eğer sefer bilgiisi veya seçilen koltuk bulunmuyorsa anasayfaya yönlendirir
    if (!trip || !selectedSeats || selectedSeats.length === 0) {
      navigate('/');
    }
  // trip, selectedSeats veya navigate değiştikçe tetiklenir
  }, [trip, selectedSeats, navigate]);

  // Kredi kartı numarası alanı değiştiğinde çalışan biçimlendirme fonksiyonu
  const handleCardNumberChange = (e) => {
    // Sayısal olmayan karakterleri temizler ve 16 haneyle sınırlar
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Kart numarasını 4'erli bloklar halinde ayırır
    const matches = val.match(/.{1,4}/g);
    // Aralara boşluk ekleyerek state değerini günceller
    setCardNumber(matches ? matches.join(' ') : '');
  };

  // Son kullanma tarihi alanı değiştiğinde çalışan biçimlendirme fonksiyonu
  const handleExpiryChange = (e) => {
    // Sayısal olmayanları siler ve 4 karakterle sınırlar
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    // AA/YY biçimine dönüştürerek state değerini günceller
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  // Cvv alanı değiştiğinde çalışan biçimlendirme fonksiyonu
  const handleCvvChange = (e) => {
    // Sayısal olmayanları siler ve 3 karakterle sınırlandırarak state günceller
    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
  };

  // Ödeme formu gönderildiğinde çalışan fonksiyon
  const handlePayment = (e) => {
    // Sayfa yenilenmesini engeller
    e.preventDefault();
    // Gerekli yolcu ve kart bilgilerinin girilme kurallarını denetler
    if (!passengerName || !passengerEmail || !passengerPhone || !cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Lütfen kart ve yolcu bilgilerini eksiksiz doldurun.');
      return;
    }

    // Ödeme simülasyonu başarısız olarak seçildiyse başarısız sonuç ekranına yönlendirir
    if (!simulateSuccess) {
      navigate('/receipt', {
        state: {
          status: 'failed',
          trip,
          selectedSeats,
          totalPrice,
          errorMessage: 'Kart bakiyesi yetersiz veya şüpheli işlem tespit edildi.',
        },
      });
      return;
    }

    // Ödeme başarılı simüle edildiyse Redux store'da rezervasyonu tamamlar
    dispatch(
      completeBooking({
        trip,
        selectedSeats,
        passengerDetails: {
          name: passengerName,
          email: passengerEmail,
          phone: passengerPhone,
        },
        user,
      })
    ).then((actionResult) => {
      // Eğer rezervasyon başarılıysa makbuz sayfasına yönlendirir
      if (completeBooking.fulfilled.match(actionResult)) {
        navigate('/receipt', {
          state: {
            status: 'success',
            booking: actionResult.payload,
          },
        });
      } else {
        // Redux tarafında hata oluştuysa kullanıcıya bildirir
        alert('Ödeme işlemi sırasında sistemsel bir hata oluştu.');
      }
    });
  };

  // trip bilgisi yoksa hiçbir şey render etmez
  if (!trip) return null;

  // Bileşenin render edeceği JSX yapısını döner
  return (
    // İki sütunlu (girdiler ve sipariş özeti) esnek sayfa yapısı
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8 text-left">
      {/* Sol Taraf: Giriş Formları */}
      <div className="flex-grow space-y-6">
        {/* Başlık ve güvenlik uyarısı */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-800">Ödeme İşlemi</h2>
          <p className="text-xs text-slate-500">Güvenli ödeme altyapımızla işleminizi 256-bit SSL korumasıyla tamamlayın.</p>
        </div>

        {/* Ödeme Formu */}
        <form onSubmit={handlePayment} className="space-y-6">
          {/* Yolcu Bilgileri Paneli */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-indigo-600" />
              <span>Yolcu Bilgileri</span>
            </h3>

            {/* Girdi alanları grid yerleşimi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Yolcu Ad Soyad girdisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yolcu Adı Soyadı</label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              {/* Yolcu Telefon Numarası girdisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telefon Numarası</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                    placeholder="5551234567"
                  />
                </div>
              </div>

              {/* Yolcu E-posta Adresi girdisi */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                    placeholder="ornek@mail.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kredi Kartı Bilgileri Paneli */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-indigo-600" />
              <span>Kart Bilgileri</span>
            </h3>

            {/* Kart girdileri */}
            <div className="space-y-4">
              {/* Kart üzerindeki isim girdisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  placeholder="AHMET YILMAZ"
                />
              </div>

              {/* Kart numarası girdisi */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kart Numarası</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none tracking-widest"
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              {/* Tarih ve Güvenlik kodu gridi */}
              <div className="grid grid-cols-2 gap-4">
                {/* Son kullanma tarihi girdisi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son Kullanma Tarihi</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                    placeholder="AA/YY"
                  />
                </div>

                {/* Güvenlik kodu girdisi */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CVC / Güvenlik Kodu</label>
                  <input
                    type="password"
                    required
                    value={cardCvv}
                    onChange={handleCvvChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test/Simülasyon ayarları paneli */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Ödeme Simülasyon Ayarları</h4>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Simüle edilecek ödeme sonucu:</span>
              <div className="flex gap-4">
                {/* Başarılı test seçeneği */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={simulateSuccess === true}
                    onChange={() => setSimulateSuccess(true)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    id="simSuccessRadio"
                  />
                  <span className="text-green-600">Başarılı Ödeme</span>
                </label>
                {/* Başarısız test seçeneği */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={simulateSuccess === false}
                    onChange={() => setSimulateSuccess(false)}
                    className="h-4 w-4 text-rose-600 focus:ring-indigo-500"
                    id="simFailRadio"
                  />
                  <span className="text-rose-600">Başarısız Ödeme</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form gönderim (Ödemeyi Tamamla) butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 transition-all flex items-center justify-center gap-2"
            id="paySubmitBtn"
          >
            {/* Banka onay durumu / Yükleniyor durumu animasyonu */}
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Banka Onayı Bekleniyor...</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={18} />
                <span>Güvenli Ödemeyi Tamamla ({totalPrice} ₺)</span>
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Sağ Taraf: Sipariş Özeti Kartı */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">Sipariş Özeti</h3>
          {/* Sipariş Detay Bilgileri listesi */}
          <div className="space-y-4 text-xs font-bold text-slate-600">
            <div className="flex justify-between">
              <span>Firma:</span>
              <span className="text-slate-800">{trip.company}</span>
            </div>
            <div className="flex justify-between">
              <span>Güzergah:</span>
              <span className="text-slate-800">{trip.from} → {trip.to}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarih & Saat:</span>
              <span className="text-slate-800">{trip.date} - {trip.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Seçilen Koltuklar:</span>
              <span className="text-indigo-600">{selectedSeats.join(', ')}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-500">Toplam Tutar:</span>
              <span className="text-xl font-black text-indigo-600">{totalPrice} ₺</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

// Payment bileşenini dışa aktarır
export default Payment;
