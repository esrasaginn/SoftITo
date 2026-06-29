import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeBooking } from '../store/slices/bookingSlice';
import { CreditCard, User, Mail, Phone, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.booking);

  // Retrieve routing state (selected trip and seats)
  const { trip, selectedSeats, totalPrice } = location.state || {};

  // Form states
  const [passengerName, setPassengerName] = useState(user ? user.name : '');
  const [passengerEmail, setPassengerEmail] = useState(user ? user.email : '');
  const [passengerPhone, setPassengerPhone] = useState(user ? user.phone : '');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Payment simulation configuration (Simulate Success / Failure)
  const [simulateSuccess, setSimulateSuccess] = useState(true);

  useEffect(() => {
    // If no trip state, redirect home
    if (!trip || !selectedSeats || selectedSeats.length === 0) {
      navigate('/');
    }
  }, [trip, selectedSeats, navigate]);

  const handleCardNumberChange = (e) => {
    // Basic format: #### #### #### ####
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : '');
  };

  const handleExpiryChange = (e) => {
    // Basic format: MM/YY
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCvvChange = (e) => {
    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!passengerName || !passengerEmail || !passengerPhone || !cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Lütfen kart ve yolcu bilgilerini eksiksiz doldurun.');
      return;
    }

    if (!simulateSuccess) {
      // Simulate failed payment directly
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

    // Complete successful payment simulation
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
      if (completeBooking.fulfilled.match(actionResult)) {
        navigate('/receipt', {
          state: {
            status: 'success',
            booking: actionResult.payload,
          },
        });
      } else {
        alert('Ödeme işlemi sırasında sistemsel bir hata oluştu.');
      }
    });
  };

  if (!trip) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8 text-left">
      {/* Left: Input Forms */}
      <div className="flex-grow space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-800">Ödeme İşlemi</h2>
          <p className="text-xs text-slate-500">Güvenli ödeme altyapımızla işleminizi 256-bit SSL korumasıyla tamamlayın.</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Passenger Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-indigo-600" />
              <span>Yolcu Bilgileri</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Credit Card Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-indigo-600" />
              <span>Kart Bilgileri</span>
            </h3>

            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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

          {/* Simulation Toggle Option */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Ödeme Simülasyon Ayarları</h4>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Simüle edilecek ödeme sonucu:</span>
              <div className="flex gap-4">
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

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-150 transition-all flex items-center justify-center gap-2"
            id="paySubmitBtn"
          >
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

      {/* Right: Summary panel */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">Sipariş Özeti</h3>
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

export default Payment;
