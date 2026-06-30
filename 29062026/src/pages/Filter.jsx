// React kütüphanesinden useEffect ve useState kancalarını içe aktarır
import { useEffect, useState } from 'react';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// Yönlendirme işlemleri için useNavigate kancasını içe aktarır
import { useNavigate } from 'react-router-dom';
// ticketSlice içindeki aksiyonları ve thunk fonksiyonlarını içe aktarır
import {
  fetchTrips,
  setSearchParams,
  setFilters,
  resetFilters,
  applyFilters,
} from '../store/slices/ticketSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Bus, Plane, Calendar, MapPin, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';

// Sefer listesi ve filtreleme (Filter) sayfa bileşenini tanımlar
const Filter = () => {
  // Redux store aksiyonlarını tetikleyen dispatch kancasını tanımlar
  const dispatch = useDispatch();
  // Sayfalar arası geçişi sağlayan navigate kancasını hazırlar
  const navigate = useNavigate();

  // Redux store'dan arama parametreleri, filtreler, filtrelenmiş seferler ve yüklenme durumlarını çeker
  const { searchParams, filters, filteredTrips, trips, loading } = useSelector((state) => state.tickets);

  // Sol taraftaki arama çubuğu için kalkış şehri durumunu tutan local state
  const [localFrom, setLocalFrom] = useState(searchParams.from);
  // Sol taraftaki arama çubuğu için varış şehri durumunu tutan local state
  const [localTo, setLocalTo] = useState(searchParams.to);
  // Sol taraftaki arama çubuğu için gidiş tarihi durumunu tutan local state
  const [localDate, setLocalDate] = useState(searchParams.date);
  // Sol taraftaki arama çubuğu için seyahat türü durumunu tutan local state (otobüs/uçak)
  const [localType, setLocalType] = useState(searchParams.type);

  // Fiyat aralığı filtresi için local state (maksimum bilet fiyatını kontrol eder)
  const [priceRange, setPriceRange] = useState(filters.maxPrice);

  // Sayfaya direkt veya parametresiz erişildiğinde seferleri çeken efekt
  useEffect(() => {
    // Eğer store içinde hiç sefer verisi yoksa sunucudan çeker ve filtreleri uygular
    if (trips.length === 0) {
      dispatch(fetchTrips()).then(() => {
        dispatch(applyFilters());
      });
    }
  // dispatch ve sefer uzunluğu değiştikçe çalışır
  }, [dispatch, trips.length]);

  // Arama parametreleri güncellendikçe local state durumlarını senkronize eden efekt
  useEffect(() => {
    setLocalFrom(searchParams.from);
    setLocalTo(searchParams.to);
    setLocalDate(searchParams.date);
    setLocalType(searchParams.type);
  }, [searchParams]);

  // Redux store filtreleri, arama parametreleri veya sıralama kriterleri değiştikçe filtreyi otomatik uygulayan efekt
  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, searchParams, dispatch]);

  // Sol paneldeki aramayı değiştir formu gönderildiğinde çalışan fonksiyon
  const handleSearchSubmit = (e) => {
    // Sayfa yenilenmesini engeller
    e.preventDefault();
    // Yeni arama kriterlerini Redux store'a yazar
    dispatch(
      setSearchParams({
        from: localFrom,
        to: localTo,
        date: localDate,
        type: localType,
      })
    );
    // Yeni kriterlere uygun güncel seferleri sunucudan çeker ve filtreleri uygular
    dispatch(fetchTrips()).then(() => {
      dispatch(applyFilters());
    });
  };

  // Fiyat aralığı değiştiğinde çalışan fonksiyon
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    // Local fiyat state'ini günceller
    setPriceRange(value);
    // Redux store filtrelerinde maksimum fiyat değerini günceller
    dispatch(setFilters({ maxPrice: value }));
  };

  // Sıralama kriteri (saat, artan fiyat vb.) değiştiğinde çalışan fonksiyon
  const handleSortChange = (e) => {
    // Redux store filtre sıralama ölçütünü günceller
    dispatch(setFilters({ sortBy: e.target.value }));
  };

  // Firma filtresindeki checkbox'lar seçildiğinde/kaldırıldığında çalışan fonksiyon
  const handleCompanyToggle = (company) => {
    // Seçili firmaların kopyasını alır
    let updatedCompanies = [...filters.companies];
    // Firma listede varsa çıkartır, yoksa listeye ekler
    if (updatedCompanies.includes(company)) {
      updatedCompanies = updatedCompanies.filter((c) => c !== company);
    } else {
      updatedCompanies.push(company);
    }
    // Güncellenmiş firmaları Redux store filtrelerinde günceller
    dispatch(setFilters({ companies: updatedCompanies }));
  };

  // Tüm filtreleri başlangıç değerlerine sıfırlayan buton fonksiyonu
  const handleReset = () => {
    // Fiyat aralığını 3000 ₺ olarak varsayılana getirir
    setPriceRange(3000);
    // Redux store'daki filtre ayarlarını ilk durumuna döndürür
    dispatch(resetFilters());
    // Filtreleri sıfırlanmış olarak tekrar sefer listesine uygular
    dispatch(applyFilters());
  };

  // Ulaşım türü (Otobüs / Uçak) değiştiğinde çalışan fonksiyon
  const handleTypeChange = (newType) => {
    setLocalType(newType);
    // Redux store'da arama tipini günceller
    dispatch(setSearchParams({ type: newType }));
    // Farklı tipe geçildiğinde önceki firmaların seçili kalmasını önlemek için firma filtrelerini sıfırlar
    dispatch(setFilters({ companies: [] }));
  };

  // Arama tipine (otobüs/uçak) uygun olan seferlerden benzersiz firma isimlerini ayırt eden liste
  const availableCompanies = Array.from(
    new Set(
      trips
        .filter((t) => t.type === localType)
        .map((t) => t.company)
    )
  );

  // Bileşenin render edeceği JSX yapısını döner
  return (
    // İki sütunlu esnek yerleşim sunan ana konteyner
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
      {/* Sol Sütun: Arama Değiştirme ve Filtre Paneli */}
      <aside className="w-full md:w-80 shrink-0 space-y-6">
        {/* Arama Değiştirme Kartı */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <SlidersHorizontal size={18} className="text-indigo-600" />
            <span>Aramayı Değiştir</span>
          </h3>

          {/* Aramayı Değiştirme Formu */}
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Ulaşım Cinsi (Otobüs / Uçak) Seçim Butonları */}
            <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-150">
              {/* Otobüs Seçeneği */}
              <button
                type="button"
                onClick={() => handleTypeChange('bus')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  localType === 'bus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Bus size={14} />
                <span>Otobüs</span>
              </button>
              {/* Uçak Seçeneği */}
              <button
                type="button"
                onClick={() => handleTypeChange('flight')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  localType === 'flight' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Plane size={14} />
                <span>Uçak</span>
              </button>
            </div>

            {/* Nereden Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nereden</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={localFrom}
                  onChange={(e) => setLocalFrom(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold transition-all outline-none"
                  placeholder="Kalkış Yeri"
                />
              </div>
            </div>

            {/* Nereye Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nereye</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={localTo}
                  onChange={(e) => setLocalTo(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold transition-all outline-none"
                  placeholder="Varış Yeri"
                />
              </div>
            </div>

            {/* Tarih Girdisi */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gidiş Tarihi</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold transition-all outline-none"
                />
              </div>
            </div>

            {/* Arama Butonu */}
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-150 transition-all"
            >
              Uygula ve Ara
            </button>
          </form>
        </div>

        {/* Filtreleme Ayarları Kartı */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          {/* Filtre Başlığı ve Sıfırla Butonu */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">Filtreleme</h3>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              type="button"
            >
              Sıfırla
            </button>
          </div>

          {/* Fiyat Sürgüsü Filtresi */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Maksimum Fiyat</span>
              <span className="text-indigo-600 font-bold">{priceRange} ₺</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={priceRange}
              onChange={handlePriceChange}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            {/* Alt fiyat sınırı etiketleri */}
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>0 ₺</span>
              <span>3000 ₺</span>
            </div>
          </div>

          {/* Firma Seçim Filtresi (Sefer tipine göre dinamik listelenir) */}
          {availableCompanies.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Firma</label>
              <div className="space-y-2">
                {availableCompanies.map((company, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company)}
                      onChange={() => handleCompanyToggle(company)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">{company}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Sağ Sütun: Sefer Listesi ve Sıralama Ayarları */}
      <main className="flex-grow space-y-4">
        {/* Sonuç Özeti ve Sıralama Seçimi alanı */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
          <div>
            {/* Dinamik Arama Başlığı */}
            <h2 className="font-extrabold text-slate-800 text-lg">
              {searchParams.from && searchParams.to
                ? `${searchParams.from} → ${searchParams.to} Seferleri`
                : 'Tüm Seferler'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {filteredTrips.length} sefer listeleniyor.
            </p>
          </div>

          {/* Sefer Sıralama Girdisi */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer"
            >
              <option value="time">Kalkış Saatine Göre</option>
              <option value="price-asc">En Düşük Fiyata Göre</option>
              <option value="price-desc">En Yüksek Fiyata Göre</option>
            </select>
          </div>
        </div>

        {/* Sefer Kartları Döngüsü */}
        {loading ? (
          // Yükleniyor spinner'ı
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="space-y-4">
            {filteredTrips.map((trip) => {
              // Boş olan koltuk sayısını hesaplar
              const emptySeatsCount = trip.seats.filter((s) => !s.isOccupied).length;
              return (
                // Sefer Detay Kartı
                <div
                  key={trip.id}
                  className="bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
                >
                  {/* Sol Kısım: Firma ve Sefer Tipi İkonu */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      {trip.type === 'bus' ? <Bus size={22} /> : <Plane size={22} />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{trip.company}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md">
                        {trip.type === 'bus' ? 'Otobüs' : 'Uçak'} Seferi
                      </span>
                    </div>
                  </div>

                  {/* Orta Kısım: Saat, Süre ve Boş Koltuk Bilgileri */}
                  <div className="grid grid-cols-3 items-center gap-4 w-full sm:w-80 text-center shrink-0">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 block">Kalkış</span>
                      <span className="font-extrabold text-slate-800 text-lg block">{trip.time}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-bold block">{trip.duration}</span>
                      {/* Görsel ara çizgi */}
                      <div className="w-16 h-0.5 bg-slate-200 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Direkt</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 block">Koltuk</span>
                      <span className="text-xs font-bold text-slate-600 block">{emptySeatsCount} Boş</span>
                    </div>
                  </div>

                  {/* Sağ Kısım: Bilet Fiyatı ve Koltuk Seç Butonu */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-50 pt-4 sm:pt-0 sm:border-0">
                    <div className="space-y-0.5 text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Bilet Fiyatı</span>
                      <span className="font-black text-indigo-600 text-xl block">{trip.price} ₺</span>
                    </div>
                    {/* Koltuk seçim ekranına (Detail) yönlendiren buton */}
                    <button
                      onClick={() => navigate(`/detail/${trip.id}`)}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-150 flex items-center gap-1.5 transition-all hover:translate-x-0.5"
                    >
                      <span>Koltuk Seç</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtrelemeler Sonucu Sefer Bulunamadığında Gösterilecek Alan */
          <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-sm text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <SlidersHorizontal size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Hiçbir Sefer Bulunamadı</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Seçtiğiniz filtrelere veya tarihlere uygun sefer bulunamadı. Lütfen filtrelerinizi sıfırlayın veya seyahat tarihlerinizi değiştirmeyi deneyin.
              </p>
            </div>
            {/* Filtreleri sıfırlama butonu */}
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl border border-indigo-100/50 transition-colors"
              type="button"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

// Filter bileşenini dışa aktarır
export default Filter;
