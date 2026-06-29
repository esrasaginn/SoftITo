import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchParams, fetchTrips, applyFilters } from '../store/slices/ticketSlice';
import { Plane, Bus, Calendar, MapPin, ArrowRightLeft, Shield, Users, Award, Eye } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ticketState = useSelector((state) => state.tickets);

  const [type, setType] = useState('bus'); // 'bus' veya 'flight'
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert('Lütfen tüm arama alanlarını doldurun.');
      return;
    }
    // Update store params
    dispatch(setSearchParams({ from, to, date, type }));
    // Fetch and navigate
    dispatch(fetchTrips()).then(() => {
      dispatch(applyFilters());
      navigate('/filter');
    });
  };

  const handleQuickSearch = (qFrom, qTo, qType, qDate = '2026-06-30') => {
    dispatch(setSearchParams({ from: qFrom, to: qTo, date: qDate, type: qType }));
    dispatch(fetchTrips()).then(() => {
      dispatch(applyFilters());
      navigate('/filter');
    });
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Popular routes data
  const popularRoutes = [
    { from: 'İstanbul', to: 'Ankara', type: 'bus', price: '650 ₺', date: '2026-06-30' },
    { from: 'İstanbul', to: 'Ankara', type: 'flight', price: '1420 ₺', date: '2026-06-30' },
    { from: 'İzmir', to: 'İstanbul', type: 'bus', price: '720 ₺', date: '2026-06-30' },
    { from: 'İzmir', to: 'İstanbul', type: 'flight', price: '1280 ₺', date: '2026-06-30' },
  ];

  return (
    <div className="flex-1 space-y-16 pb-16">
      {/* Hero and Search Bar */}
      <section 
        className="relative h-[550px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"></div>

        {/* Search Container */}
        <div className="relative max-w-4xl w-full mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
            <button
              onClick={() => setType('bus')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                type === 'bus'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
              type="button"
              id="busTabBtn"
            >
              <Bus size={18} />
              <span>Otobüs Bileti</span>
            </button>
            <button
              onClick={() => setType('flight')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                type === 'flight'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
              type="button"
              id="flightTabBtn"
            >
              <Plane size={18} />
              <span>Uçak Bileti</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            {/* From */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nereden</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-semibold transition-all outline-none"
                  placeholder="Kalkış Şehri"
                  id="fromInput"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:col-span-1 pb-1">
              <button
                type="button"
                onClick={swapCities}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors border border-indigo-100/50"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nereye</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-semibold transition-all outline-none"
                  placeholder="Varış Şehri"
                  id="toInput"
                />
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-semibold transition-all outline-none"
                  id="dateInput"
                />
              </div>
            </div>

            {/* Search Submit */}
            <div className="md:col-span-7 mt-2">
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 transition-all hover:-translate-y-0.5"
                id="searchSubmitBtn"
              >
                Ucuza Sefer Bul
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Popüler Rotalar</h2>
          <p className="text-sm text-slate-500">En çok tercih edilen seyahat güzergahlarını uygun fiyatlarla keşfedin.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handleQuickSearch(route.from, route.to, route.type, route.date)}
              className="bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between h-44 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full flex items-center gap-1">
                  {route.type === 'bus' ? <Bus size={12} /> : <Plane size={12} />}
                  {route.type === 'bus' ? 'Otobüs' : 'Uçak'}
                </span>
                <span className="text-xs text-slate-400 font-medium">{route.date}</span>
              </div>
              <div className="text-left font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors mt-2">
                {route.from} → {route.to}
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                <span className="text-xs text-slate-400 font-semibold">Başlayan fiyatlarla</span>
                <span className="text-lg font-extrabold text-indigo-600">{route.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hakkımızda / Vizyon / Misyon (Corporate Info Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/50 py-16 rounded-3xl border border-slate-100/50">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Neden BiletiniAl?</h2>
          <p className="text-sm text-slate-500">Güvenli, hızlı ve kullanıcı odaklı bir biletleme deneyimi sunuyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Hakkımızda */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-left">Hakkımızda</h3>
            <p className="text-sm text-slate-500 text-left leading-relaxed">
              BiletiniAl, Türkiye genelinde yüzlerce otobüs firması ve havayolu şirketini bir araya getirerek seyahat planlamanızı basitleştiren bir dijital seyahat asistanıdır.
            </p>
          </div>

          {/* Card 2: Misyonumuz */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-left">Misyonumuz</h3>
            <p className="text-sm text-slate-500 text-left leading-relaxed">
              Kullanıcılarımızın bilet arama, karşılaştırma ve satın alma adımlarını en hızlı, en güvenli ve en şeffaf şekilde tamamlamalarını sağlamak, seyahatlerini keyfe dönüştürmektir.
            </p>
          </div>

          {/* Card 3: Vizyonumuz */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md hover:border-indigo-50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-left">Vizyonumuz</h3>
            <p className="text-sm text-slate-500 text-left leading-relaxed">
              Yenilikçi teknolojilerle entegre edilmiş, seyahat sektöründe pazar lideri ve kullanıcı memnuniyetinde birinci sırada yer alan seyahat portalı haline gelmektir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
