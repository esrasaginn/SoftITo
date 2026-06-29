import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchTrips,
  setSearchParams,
  setFilters,
  resetFilters,
  applyFilters,
} from '../store/slices/ticketSlice';
import { Bus, Plane, Calendar, MapPin, SlidersHorizontal, ArrowUpDown, ChevronRight } from 'lucide-react';

const Filter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchParams, filters, filteredTrips, trips, loading } = useSelector((state) => state.tickets);

  // Local state for search controls on the left side
  const [localFrom, setLocalFrom] = useState(searchParams.from);
  const [localTo, setLocalTo] = useState(searchParams.to);
  const [localDate, setLocalDate] = useState(searchParams.date);
  const [localType, setLocalType] = useState(searchParams.type);

  // Local state for pricing filters
  const [priceRange, setPriceRange] = useState(filters.maxPrice);

  useEffect(() => {
    // If user enters filter page directly without params, let's fetch default trips
    if (trips.length === 0) {
      dispatch(fetchTrips()).then(() => {
        dispatch(applyFilters());
      });
    }
  }, [dispatch, trips.length]);

  // Synchronize local states when searchParams update
  useEffect(() => {
    setLocalFrom(searchParams.from);
    setLocalTo(searchParams.to);
    setLocalDate(searchParams.date);
    setLocalType(searchParams.type);
  }, [searchParams]);

  // Apply filters automatically on price, type or sorting change
  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setSearchParams({
        from: localFrom,
        to: localTo,
        date: localDate,
        type: localType,
      })
    );
    dispatch(fetchTrips()).then(() => {
      dispatch(applyFilters());
    });
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange(value);
    dispatch(setFilters({ maxPrice: value }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sortBy: e.target.value }));
  };

  const handleCompanyToggle = (company) => {
    let updatedCompanies = [...filters.companies];
    if (updatedCompanies.includes(company)) {
      updatedCompanies = updatedCompanies.filter((c) => c !== company);
    } else {
      updatedCompanies.push(company);
    }
    dispatch(setFilters({ companies: updatedCompanies }));
  };

  const handleReset = () => {
    setPriceRange(3000);
    dispatch(resetFilters());
    dispatch(applyFilters());
  };

  // Extract unique companies from matching search results type
  const availableCompanies = Array.from(
    new Set(
      trips
        .filter((t) => t.type === localType)
        .map((t) => t.company)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
      {/* Left Sidebar - Filters & Search Change */}
      <aside className="w-full md:w-80 shrink-0 space-y-6">
        {/* Search Change Form */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <SlidersHorizontal size={18} className="text-indigo-600" />
            <span>Aramayı Değiştir</span>
          </h3>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Travel Type Select */}
            <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-150">
              <button
                type="button"
                onClick={() => setLocalType('bus')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  localType === 'bus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Bus size={14} />
                <span>Otobüs</span>
              </button>
              <button
                type="button"
                onClick={() => setLocalType('flight')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  localType === 'flight' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Plane size={14} />
                <span>Uçak</span>
              </button>
            </div>

            {/* From Input */}
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

            {/* To Input */}
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

            {/* Date Input */}
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

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-150 transition-all"
            >
              Uygula ve Ara
            </button>
          </form>
        </div>

        {/* Filters Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 text-left">
          {/* Header */}
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

          {/* Pricing slider */}
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
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>0 ₺</span>
              <span>3000 ₺</span>
            </div>
          </div>

          {/* Company filter */}
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

      {/* Right Content - Listing */}
      <main className="flex-grow space-y-4">
        {/* Results Header */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg">
              {searchParams.from && searchParams.to
                ? `${searchParams.from} → ${searchParams.to} Seferleri`
                : 'Tüm Seferler'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {filteredTrips.length} sefer listeleniyor.
            </p>
          </div>

          {/* Sorting */}
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

        {/* Trips Cards List */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="space-y-4">
            {filteredTrips.map((trip) => {
              const emptySeatsCount = trip.seats.filter((s) => !s.isOccupied).length;
              return (
                <div
                  key={trip.id}
                  className="bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
                >
                  {/* Left: Company & Route Icon */}
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

                  {/* Center: Route, Time, Duration */}
                  <div className="grid grid-cols-3 items-center gap-4 w-full sm:w-80 text-center shrink-0">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 block">Kalkış</span>
                      <span className="font-extrabold text-slate-800 text-lg block">{trip.time}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-bold block">{trip.duration}</span>
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

                  {/* Right: Price & Selection Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-50 pt-4 sm:pt-0 sm:border-0">
                    <div className="space-y-0.5 text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Bilet Fiyatı</span>
                      <span className="font-black text-indigo-600 text-xl block">{trip.price} ₺</span>
                    </div>
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

export default Filter;
