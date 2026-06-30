// React kütüphanesinden useEffect ve useState kancalarını içe aktarır
import { useEffect, useState } from 'react';
// Yönlendirme parametrelerini (id) ve yönlendirici kancasını react-router-dom'dan içe aktarır
import { useParams, useNavigate } from 'react-router-dom';
// Redux kütüphanesinden dispatch ve selector kancalarını içe aktarır
import { useDispatch, useSelector } from 'react-redux';
// ticketSlice içindeki id'ye göre sefer detayı getiren fetchTripById thunk'ını içe aktarır
import { fetchTripById } from '../store/slices/ticketSlice';
// lucide-react kütüphanesinden arayüzde gösterilecek ikonları içe aktarır
import { Bus, Plane, Calendar, Clock, MapPin, Armchair, ChevronLeft } from 'lucide-react';

// Sefer detayı ve koltuk seçimi (Detail) sayfa bileşenini tanımlar
const Detail = () => {
  // Dinamik URL parametresinden sefer id'sini alır
  const { id } = useParams();
  // Sayfalar arası geçiş yapmak için navigate kancasını hazırlar
  const navigate = useNavigate();
  // Redux store aksiyonlarını tetikleyen dispatch kancasını tanımlar
  const dispatch = useDispatch();

  // Redux store'dan seçilen sefer, yüklenme ve hata durumlarını çeker
  const { selectedTrip, loading, error } = useSelector((state) => state.tickets);
  // Seçilen koltuk numaralarını tutan local state
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Sayfa yüklendiğinde veya id değiştiğinde sefer detaylarını çeken efekt
  useEffect(() => {
    dispatch(fetchTripById(id));
  }, [id, dispatch]);

  // Koltuğa tıklandığında seçilmesini veya seçimden kaldırılmasını yöneten fonksiyon
  const handleSeatClick = (seatNumber) => {
    // Eğer koltuk zaten seçiliyse seçimden kaldırır
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((num) => num !== seatNumber));
    } else {
      // Bir satın alımda maksimum 4 bilet seçme sınırını denetler
      if (selectedSeats.length >= 4) {
        alert('Tek seferde en fazla 4 koltuk seçebilirsiniz.');
        return;
      }
      // Koltuğu seçilenler listesine ekler
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Ödeme sayfasına geçişi tetikleyen fonksiyon
  const handleProceedToPayment = () => {
    // En az bir koltuk seçildiğini kontrol eder
    if (selectedSeats.length === 0) {
      alert('Lütfen en az bir koltuk seçin.');
      return;
    }
    // Ödeme sayfasına yönlendirir ve seçilen verileri yönlendirici state'iyle taşır
    navigate('/payment', {
      state: {
        trip: selectedTrip,
        selectedSeats,
        totalPrice: selectedTrip.price * selectedSeats.length,
      },
    });
  };

  // Eğer veri yükleniyorsa gösterilecek yükleniyor arayüzü
  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center flex-1">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Hata durumunda veya sefer bulunamadığında gösterilecek uyarı arayüzü
  if (error || !selectedTrip) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4 flex-1">
        <h3 className="text-xl font-bold text-slate-800">Sefer Detayı Bulunamadı</h3>
        <p className="text-slate-500 text-sm">Aradığınız sefer kaldırılmış veya geçersiz olabilir.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          type="button"
        >
          Anasayfaya Dön
        </button>
      </div>
    );
  }

  // Otobüs Koltuk Şemasını Çizen fonksiyon (Örn: Koridorlu 2+2 düzeninde 30 koltuk)
  const renderBusSeats = () => {
    // Toplam 8 sıra çizilecektir
    const totalRows = 8;
    const seatLayout = [];

    // Satır satır koltuk dizilimlerini oluşturur
    for (let r = 0; r < totalRows; r++) {
      const rowSeats = [];
      for (let c = 1; c <= 4; c++) {
        // Koltuk numarasını formülize eder
        const seatNum = r * 4 + c;
        // 30 koltuğun dışına taşan numaraları yoksayar
        if (seatNum > 30) continue;

        // Sefer verisindeki koltuk durumuna göre dolu/boş durumunu sorgular
        const dbSeat = selectedTrip.seats.find((s) => Number(s.number) === seatNum) || {
          number: seatNum,
          isOccupied: false,
        };
        rowSeats.push(dbSeat);
      }
      seatLayout.push(rowSeats);
    }

    // Otobüs koltuk şeması JSX çıktısını döner
    return (
      <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-3xl max-w-sm mx-auto">
        {/* Ön Taraf / Şoför yönü belirtici */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4 text-xs font-bold text-slate-400">
          <span>Şoför</span>
          <span>ÖN Taraf</span>
        </div>

        {/* Koltuk Izgarası */}
        <div className="space-y-3">
          {seatLayout.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-between items-center gap-3">
              {/* Sol Taraf Koltukları (1. ve 2. koltuklar) */}
              <div className="flex gap-2">
                {row.slice(0, 2).map((seat) => {
                  const isSelected = selectedSeats.includes(seat.number);
                  return (
                    <button
                      key={seat.number}
                      disabled={seat.isOccupied}
                      onClick={() => handleSeatClick(seat.number)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${seat.isOccupied
                          ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150 scale-105'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      type="button"
                      title={seat.isOccupied ? 'Dolu' : `Koltuk ${seat.number}`}
                    >
                      <Armchair size={16} />
                      <span className="text-[9px] absolute mt-5 font-extrabold">{seat.number}</span>
                    </button>
                  );
                })}
              </div>

              {/* Otobüs Koridoru */}
              <div className="w-8 h-10 border-dashed border-r border-slate-250"></div>

              {/* Sağ Taraf Koltukları (3. ve 4. koltuklar) */}
              <div className="flex gap-2">
                {row.slice(2, 4).map((seat) => {
                  const isSelected = selectedSeats.includes(seat.number);
                  return (
                    <button
                      key={seat.number}
                      disabled={seat.isOccupied}
                      onClick={() => handleSeatClick(seat.number)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${seat.isOccupied
                          ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150 scale-105'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      type="button"
                      title={seat.isOccupied ? 'Dolu' : `Koltuk ${seat.number}`}
                    >
                      <Armchair size={16} />
                      <span className="text-[9px] absolute mt-5 font-extrabold">{seat.number}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Uçak Kabin Koltuk Şemasını Çizen fonksiyon (Örn: Koridorlu 3+3 düzeninde 1A, 1B vb.)
  const renderFlightSeats = () => {
    const rows = ['1', '2', '3', '4', '5'];
    const colsLeft = ['A', 'B', 'C'];
    const colsRight = ['D', 'E', 'F'];

    // Uçak koltuk şeması JSX çıktısını döner
    return (
      <div className="space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-3xl max-w-md mx-auto">
        {/* Kokpit yönü belirtici */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4 text-xs font-bold text-slate-400">
          <span>Kokpit</span>
          <span>KABİN</span>
        </div>

        {/* Sıra döngüsü */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex justify-between items-center gap-4">
              {/* Sol Taraf Koltukları (A, B, C) */}
              <div className="flex gap-1.5">
                {colsLeft.map((col) => {
                  const seatNum = `${row}${col}`;
                  const seat = selectedTrip.seats.find((s) => s.number === seatNum) || {
                    number: seatNum,
                    isOccupied: false,
                  };
                  const isSelected = selectedSeats.includes(seatNum);
                  return (
                    <button
                      key={seatNum}
                      disabled={seat.isOccupied}
                      onClick={() => handleSeatClick(seatNum)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${seat.isOccupied
                          ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150 scale-105'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      type="button"
                      title={seat.isOccupied ? 'Dolu' : `Koltuk ${seatNum}`}
                    >
                      <Armchair size={16} />
                      <span className="text-[8px] absolute mt-5 font-extrabold">{seatNum}</span>
                    </button>
                  );
                })}
              </div>

              {/* Uçak Sıra Numarası */}
              <div className="text-[10px] font-black text-slate-400 w-4 text-center">{row}</div>

              {/* Sağ Taraf Koltukları (D, E, F) */}
              <div className="flex gap-1.5">
                {colsRight.map((col) => {
                  const seatNum = `${row}${col}`;
                  const seat = selectedTrip.seats.find((s) => s.number === seatNum) || {
                    number: seatNum,
                    isOccupied: false,
                  };
                  const isSelected = selectedSeats.includes(seatNum);
                  return (
                    <button
                      key={seatNum}
                      disabled={seat.isOccupied}
                      onClick={() => handleSeatClick(seatNum)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${seat.isOccupied
                          ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150 scale-105'
                            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-700'
                        }`}
                      type="button"
                      title={seat.isOccupied ? 'Dolu' : `Koltuk ${seatNum}`}
                    >
                      <Armchair size={16} />
                      <span className="text-[8px] absolute mt-5 font-extrabold">{seatNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Bileşenin render edeceği ana JSX yapısını döner
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6 text-left">
      {/* Üst Kısım: Geri Dönüş Butonu */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Geri Dön</span>
        </button>
      </div>

      {/* İki Sütunlu Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Sütun: Koltuk Yerleşim Kartı */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800">Koltuk Seçimi</h2>
            <p className="text-xs text-slate-500">Koltuk yerleşim haritasından tercih etmek istediğiniz boş koltukları seçin.</p>
          </div>

          {/* Sefer cinsine göre otobüs ya da uçak şemasını render eder */}
          {selectedTrip.type === 'bus' ? renderBusSeats() : renderFlightSeats()}

          {/* Koltuk Şeması Renk Açıklama Alanı */}
          <div className="flex justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-white border border-slate-200 rounded-md"></div>
              <span>Boş</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-rose-50 border border-rose-100 text-rose-300 rounded-md flex items-center justify-center">
                <Armchair size={10} />
              </div>
              <span>Dolu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-indigo-600 rounded-md shadow shadow-indigo-150 flex items-center justify-center text-white">
                <Armchair size={10} />
              </div>
              <span>Seçili</span>
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Sefer Detay Özeti Kartı */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 h-fit">
          <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-3">Sefer Detayları</h3>

          {/* Sefer Özeti Listesi */}
          <div className="space-y-4">
            {/* Firma ve tip simgesi */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                {selectedTrip.type === 'bus' ? <Bus size={18} /> : <Plane size={18} />}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">{selectedTrip.company}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedTrip.type === 'bus' ? 'Otobüs' : 'Uçak'}</span>
              </div>
            </div>

            {/* Rota özet bilgileri */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Güzergah:</span>
                <span className="text-slate-800">{selectedTrip.from} → {selectedTrip.to}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Tarih:</span>
                <span className="text-slate-850 flex items-center gap-1">
                  <Calendar size={12} />
                  {selectedTrip.date}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Saat:</span>
                <span className="text-slate-850 flex items-center gap-1">
                  <Clock size={12} />
                  {selectedTrip.time}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Süre:</span>
                <span className="text-slate-600">{selectedTrip.duration}</span>
              </div>
            </div>

            {/* Seçim ve Fiyat detayı */}
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-slate-400">Seçilen Koltuklar:</span>
                <span className="text-indigo-600">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Seçilmedi'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Birim Fiyat:</span>
                <span className="text-slate-800">{selectedTrip.price} ₺</span>
              </div>
            </div>

            {/* Ayırıcı Çizgi */}
            <div className="border-t border-slate-100 my-2"></div>

            {/* Toplam Hesaplanan Tutar */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Toplam Tutar:</span>
              <span className="text-2xl font-black text-indigo-600">
                {selectedTrip.price * selectedSeats.length} ₺
              </span>
            </div>

            {/* Satın almaya devam etme butonu */}
            <button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-150 transition-all flex items-center justify-center gap-2"
              id="proceedPaymentBtn"
            >
              <span>Ödeme Yap Ekranına Git</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail bileşenini dışa aktarır
export default Detail;
