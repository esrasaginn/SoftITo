// React kütüphanesinden useState kancasını içe aktarır
import { useState } from 'react';
// Yönlendirme işlemleri için useNavigate kancasını içe aktarır
import { useNavigate } from 'react-router-dom';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// ticketSlice içinden yeni sefer ekleyen addTrip thunk'ını içe aktarır
import { addTrip } from '../store/slices/ticketSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Bus, Plane, Calendar, Clock, MapPin, Plus, Loader2, ArrowLeft } from 'lucide-react';

// Yeni Sefer/Bilet Ekleme (AddTrip) sayfa bileşenini tanımlar
const AddTrip = () => {
  // Sayfalar arası geçişi sağlayan navigate kancasını hazırlar
  const navigate = useNavigate();
  // Redux aksiyonlarını tetikleyen dispatch kancasını tanımlar
  const dispatch = useDispatch();
  // ticketSlice store'undan yüklenme durumunu çeker
  const { loading } = useSelector((state) => state.tickets);

  // Form girdileri için yerel durum (state) tanımlamaları
  const [type, setType] = useState('bus');
  const [company, setCompany] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  // Form gönderildiğinde (Yeni Sefer Oluştur) çalışan fonksiyon
  const handleSubmit = (e) => {
    // Sayfanın yenilenmesini engeller
    e.preventDefault();

    // Zorunlu alanların girildiğini kontrol eder
    if (!company || !from || !to || !date || !time || !price || !duration) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    // Sefer tipine göre koltuk listesini otomatik üretir
    const seats = [];
    if (type === 'bus') {
      // Otobüs için 1'den 30'a kadar boş koltuk nesneleri üretir
      for (let i = 1; i <= 30; i++) {
        seats.push({ number: i, isOccupied: false });
      }
    } else {
      // Uçak için 1'den 5'e kadar sıralarda A-F arası koltuklar üretir (toplam 30 koltuk)
      const rows = ['1', '2', '3', '4', '5'];
      const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
      rows.forEach((row) => {
        cols.forEach((col) => {
          seats.push({ number: `${row}${col}`, isOccupied: false });
        });
      });
    }

    // Gönderilecek sefer nesnesini oluşturur
    const newTripData = {
      type,
      company,
      from,
      to,
      date,
      time,
      price: Number(price),
      duration,
      seats,
    };

    // Redux store aracılığıyla yeni seferi backend sunucusuna ekler
    dispatch(addTrip(newTripData))
      .unwrap()
      .then(() => {
        alert('Yeni sefer başarıyla sisteme eklendi!');
        // Seferler sayfasına yönlendirir
        navigate('/filter');
      })
      .catch((error) => {
        alert(`Sefer eklenirken hata oluştu: ${error}`);
      });
  };

  // Bileşenin render edeceği JSX yapısını döner
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6 text-left">
      {/* Geri Butonu */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          type="button"
        >
          <ArrowLeft size={16} />
          <span>Geri Dön</span>
        </button>
      </div>

      {/* Ana Form Konteyneri */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Sayfa başlığı ve alt açıklaması */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Plus size={24} className="text-indigo-600" />
            <span>Yeni Sefer (Bilet) Ekle</span>
          </h2>
          <p className="text-xs text-slate-500">Sisteme yeni bir otobüs veya uçak seferi tanımlayın. Koltuk şeması otomatik üretilecektir.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ulaşım Cinsi (Otobüs / Uçak) Seçim Sekmeleri */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sefer Tipi</label>
            <div className="flex gap-4">
              {/* Otobüs butonu */}
              <button
                type="button"
                onClick={() => setType('bus')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all border ${
                  type === 'bus'
                    ? 'bg-indigo-600 border-indigo-650 text-white shadow-md shadow-indigo-150'
                    : 'bg-slate-50 border-slate-150 text-slate-650'
                }`}
              >
                <Bus size={18} />
                <span>Otobüs Seferi</span>
              </button>
              {/* Uçak butonu */}
              <button
                type="button"
                onClick={() => setType('flight')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all border ${
                  type === 'flight'
                    ? 'bg-indigo-600 border-indigo-650 text-white shadow-md shadow-indigo-150'
                    : 'bg-slate-50 border-slate-150 text-slate-655'
                }`}
              >
                <Plane size={18} />
                <span>Uçak Seferi</span>
              </button>
            </div>
          </div>

          {/* Girdiler Grubu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Firma Adı Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Firma Adı</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                placeholder={type === 'bus' ? 'Örn: Kamil Koç' : 'Örn: Türk Hava Yolları'}
              />
            </div>

            {/* Fiyat Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bilet Fiyatı (₺)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                placeholder="Örn: 750"
              />
            </div>

            {/* Nereden Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nereden</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  placeholder="Kalkış Şehri"
                />
              </div>
            </div>

            {/* Nereye Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nereye</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                  placeholder="Varış Şehri"
                />
              </div>
            </div>

            {/* Tarih Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gidiş Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Saat Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kalkış Saati</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Seyahat Süresi Girdisi */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yolculuk Süresi</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold outline-none"
                placeholder="Örn: 6h 30m veya 1h 15m"
              />
            </div>
          </div>

          {/* Formu Kaydet Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="addTripSubmitBtn"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Sefer Kaydediliyor...</span>
              </>
            ) : (
              <span>Sefer Bilgilerini Sisteme Ekle</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// AddTrip bileşenini dışa aktarır
export default AddTrip;
