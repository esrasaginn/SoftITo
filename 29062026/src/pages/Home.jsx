// React kütüphanesinden durum yönetimi ve yönlendirme kancalarını içe aktarır
import { useState } from 'react';
// Yönlendirme işlemi için useNavigate kancasını içe aktarır
import { useNavigate } from 'react-router-dom';
// Redux thunk eylemlerini tetiklemek için dispatch kancasını içe aktarır
import { useDispatch } from 'react-redux';
// ticketSlice içindeki arama parametrelerini ve filtre sıfırlama thunk'larını içe aktarır
import { setSearchParams, resetFilters } from '../store/slices/ticketSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Bus, Plane, Calendar, MapPin, ArrowRightLeft, Users, Shield, Award } from 'lucide-react';

// Anasayfa (Home) bileşenini tanımlar
const Home = () => {
  // Sayfalar arası geçiş yapmak için navigate kancasını tanımlar
  const navigate = useNavigate();
  // Redux store durumunu güncellemek için dispatch kancasını tanımlar
  const dispatch = useDispatch();

  // Ulaşım türü (Otobüs 'bus' / Uçak 'flight') durumunu tutan state
  const [type, setType] = useState('bus');
  // Kalkış şehri bilgisini tutan state
  const [from, setFrom] = useState('');
  // Varış şehri bilgisini tutan state
  const [to, setTo] = useState('');
  // Seyahat tarihi bilgisini tutan state (varsayılan bugün/yarın gibi boş)
  const [date, setDate] = useState('');

  // Form gönderildiğinde (Sefer Bul'a tıklandığında) çalışan fonksiyon
  const handleSearch = (e) => {
    // Sayfa yenilenmesini engeller
    e.preventDefault();
    // Önceki filtreleme durumunu sıfırlar (eski aramaların filtreleri yeni aramayı kısıtlamasın)
    dispatch(resetFilters());
    // Redux store'daki arama parametrelerini günceller
    dispatch(setSearchParams({ from, to, type, date }));
    // Kullanıcıyı sefer listeleme (filtre) sayfasına yönlendirir
    navigate('/filter');
  };

  // Popüler rota kartlarına tıklandığında hızlı arama yapan fonksiyon
  const handleQuickSearch = (fromVal, toVal, typeVal, dateVal) => {
    // Önceki filtreleme durumunu sıfırlar
    dispatch(resetFilters());
    // Seçilen popüler rota arama kriterlerini store'a yazar
    dispatch(
      setSearchParams({
        from: fromVal,
        to: toVal,
        type: typeVal,
        date: dateVal,
      })
    );
    // Sefer listeleme sayfasına yönlendirir
    navigate('/filter');
  };

  // Kalkış ve varış şehirlerinin yerlerini değiştiren fonksiyon
  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Popüler Rotalar listesi verileri (görsel linkleriyle birlikte)
  const popularRoutes = [
    {
      from: 'İstanbul',
      to: 'Ankara',
      type: 'bus',
      price: '650 ₺',
      date: '2026-06-30',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&auto=format&fit=crop&q=80'
    },
    {
      from: 'İstanbul',
      to: 'Ankara',
      type: 'flight',
      price: '1420 ₺',
      date: '2026-06-30',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&auto=format&fit=crop&q=80'
    },
    {
      from: 'İzmir',
      to: 'İstanbul',
      type: 'bus',
      price: '720 ₺',
      date: '2026-06-30',
      image: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=600&auto=format&fit=crop&q=80'
    },
    {
      from: 'İzmir',
      to: 'İstanbul',
      type: 'flight',
      price: '1280 ₺',
      date: '2026-06-30',
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&auto=format&fit=crop&q=80'
    },
  ];

  // Bileşenin render edeceği JSX yapısını döner
  return (
    <div className="flex-1 space-y-16 pb-16 transition-colors duration-300">
      {/* Hero (Görsel Karşılama) ve Arama Barı Bölümü */}
      <section 
        className="relative h-[550px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&auto=format&fit=crop&q=80')` }}
      >
        {/* Görselin üzerine hafif siyah ve blur efekti veren katman */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"></div>

        {/* Arama Formu Konteyneri */}
        <div className="relative max-w-4xl w-full mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 transition-colors duration-300">
          {/* Seyahat Türü Seçim Sekmeleri */}
          <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            {/* Otobüs seçeneği butonu */}
            <button
              onClick={() => setType('bus')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                type === 'bus'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-55 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              type="button"
              id="busTabBtn"
            >
              <Bus size={18} />
              <span>Otobüs Bileti</span>
            </button>
            {/* Uçak seçeneği butonu */}
            <button
              onClick={() => setType('flight')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                type === 'flight'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-55 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              type="button"
              id="flightTabBtn"
            >
              <Plane size={18} />
              <span>Uçak Bileti</span>
            </button>
          </div>

          {/* Arama Form Alanı */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            {/* Kalkış Yeri (Nereden) Girdisi */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nereden</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm font-semibold transition-all outline-none text-slate-800 dark:text-slate-100"
                  placeholder="Kalkış Şehri"
                  id="fromInput"
                />
              </div>
            </div>

            {/* Şehir Değiştirme (Swap) Butonu */}
            <div className="flex justify-center md:col-span-1 pb-1">
              <button
                type="button"
                onClick={swapCities}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors border border-indigo-100/50 dark:border-indigo-900/40"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Varış Yeri (Nereye) Girdisi */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nereye</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm font-semibold transition-all outline-none text-slate-800 dark:text-slate-100"
                  placeholder="Varış Şehri"
                  id="toInput"
                />
              </div>
            </div>

            {/* Tarih Seçim Girdisi */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tarih</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm font-semibold transition-all outline-none text-slate-800 dark:text-slate-100"
                  id="dateInput"
                />
              </div>
            </div>

            {/* Arama Gönder Butonu */}
            <div className="md:col-span-7 mt-2">
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 transition-all hover:-translate-y-0.5 cursor-pointer"
                id="searchSubmitBtn"
              >
                Ucuza Sefer Bul
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popüler Rotalar Listesi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık ve alt bilgi */}
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Popüler Rotalar</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">En çok tercih edilen seyahat güzergahlarını uygun fiyatlarla keşfedin.</p>
        </div>

        {/* Popüler kartların grid yerleşimi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handleQuickSearch(route.from, route.to, route.type, route.date)}
              className="relative overflow-hidden rounded-3xl border border-slate-100/50 dark:border-slate-800/50 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between h-48 group text-white"
            >
              {/* Arka Plan Görseli */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${route.image})` }}
              ></div>
              {/* Okunabilirliği artırmak için koyu degrade maske */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/45 to-slate-950/30 group-hover:from-slate-950/95 group-hover:via-slate-950/60 transition-all duration-300"></div>

              {/* Kart İçeriği */}
              <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                {/* Kart üst kısmı: Ulaşım tipi ve seyahat tarihi */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center gap-1 border border-white/10">
                    {route.type === 'bus' ? <Bus size={10} /> : <Plane size={10} />}
                    {route.type === 'bus' ? 'Otobüs' : 'Uçak'}
                  </span>
                  <span className="text-[10px] text-white/80 font-semibold">{route.date}</span>
                </div>
                {/* Rota ve fiyat alt alanı */}
                <div>
                  <div className="text-left font-black text-white text-lg tracking-wide">
                    {route.from} → {route.to}
                  </div>
                  {/* Kart alt kısmı: Fiyat baremi */}
                  <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-3">
                    <span className="text-[10px] text-white/70 font-semibold">Başlayan fiyatlarla</span>
                    <span className="text-base font-black text-indigo-300">{route.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kurumsal Bilgi Kartları (Neden BiletiniAl?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/40 py-16 rounded-3xl border border-slate-100/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Neden BiletiniAl?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Güvenli, hızlı ve kullanıcı odaklı bir biletleme deneyimi sunuyoruz.</p>
        </div>

        {/* 3 sütunlu bilgi paneli */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kart 1: Hakkımızda */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 dark:hover:border-indigo-900 transition-all text-slate-800 dark:text-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-left">Hakkımızda</h3>
            <p className="text-sm text-slate-550 dark:text-slate-350 text-left leading-relaxed">
              BiletiniAl, Türkiye genelinde yüzlerce otobüs firması ve havayolu şirketini bir araya getirerek seyahat planlamanızı basitleştiren bir dijital seyahat asistanıdır.
            </p>
          </div>

          {/* Kart 2: Misyonumuz */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 dark:hover:border-indigo-900 transition-all text-slate-800 dark:text-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-left">Misyonumuz</h3>
            <p className="text-sm text-slate-555 dark:text-slate-355 text-left leading-relaxed">
              Kullanıcılarımızın bilet arama, karşılaştırma ve satın alma adımlarını en hızlı, en güvenli ve en şeffaf şekilde tamamlamalarını sağlamak, seyahatlerini keyfe dönüştürmektir.
            </p>
          </div>

          {/* Kart 3: Vizyonumuz */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 dark:hover:border-indigo-900 transition-all text-slate-800 dark:text-slate-100">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white text-left">Vizyonumuz</h3>
            <p className="text-sm text-slate-555 dark:text-slate-355 text-left leading-relaxed">
              Yenilikçi teknolojilerle entegre edilmiş, seyahat sektöründe pazar lideri ve kullanıcı memnuniyetinde birinci sırada yer alan seyahat portalı haline gelmektir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Home bileşenini dışa aktarır
export default Home;
