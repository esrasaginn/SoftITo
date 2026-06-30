// react-router-dom kütüphanesinden yönlendirici bileşenleri içe aktarır
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// react-redux kütüphanesinden Provider bileşenini içe aktarır
import { Provider } from 'react-redux';
// Redux veri deposunu (store) projeye dahil eder
import { store } from './store';
// Sayfa üst menü çubuğu bileşenini içe aktarır
import Navbar from './components/Navbar';
// Sayfa altlığı bileşenini içe aktarır
import Footer from './components/Footer';
// Anasayfa bileşenini içe aktarır
import Home from './pages/Home';
// Giriş sayfası bileşenini içe aktarır
import Login from './pages/Login';
// Kayıt sayfası bileşenini içe aktarır
import Register from './pages/Register';
// Sefer listesi ve filtreleme sayfası bileşenini içe aktarır
import Filter from './pages/Filter';
// Sefer detayı ve koltuk seçim sayfası bileşenini içe aktarır
import Detail from './pages/Detail';
// Ödeme sayfası bileşenini içe aktarır
import Payment from './pages/Payment';
// Makbuz ve bilet geçmişi sayfası bileşenini içe aktarır
import Receipt from './pages/Receipt';
// Yeni sefer (bilet) ekleme sayfası bileşenini içe aktarır
import AddTrip from './pages/AddTrip';

// Ana uygulama bileşeni olan App fonksiyonunu tanımlar
function App() {
  // Bileşenin render edeceği JSX yapısını döner
  return (
    // Redux Provider ile store'u tüm alt bileşenlerin erişimine açar
    <Provider store={store}>
      {/* react-router-dom yönlendiricisini başlatır */}
      <BrowserRouter>
        {/* Tüm sayfayı kaplayan dikey hizalı esnek arayüz konteyneri */}
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
          {/* Sayfa Üst Menüsü */}
          <Navbar />

          {/* Sayfa İçerik Alanı (Kalan yüksekliği kaplar) */}
          <main className="flex-grow flex flex-col">
            {/* Sayfa yönlendirme yolları tanımları */}
            <Routes>
              {/* Anasayfa rotası */}
              <Route path="/" element={<Home />} />
              {/* Giriş sayfası rotası */}
              <Route path="/login" element={<Login />} />
              {/* Kayıt sayfası rotası */}
              <Route path="/register" element={<Register />} />
              {/* Filtreleme ve sefer listeleme sayfası rotası */}
              <Route path="/filter" element={<Filter />} />
              {/* Dinamik id'ye göre sefer detay sayfası rotası */}
              <Route path="/detail/:id" element={<Detail />} />
              {/* Ödeme sayfası rotası */}
              <Route path="/payment" element={<Payment />} />
              {/* Makbuz ve bilet geçmişi sayfası rotası */}
              <Route path="/receipt" element={<Receipt />} />
              {/* Yeni sefer/bilet ekleme sayfası rotası */}
              <Route path="/add-trip" element={<AddTrip />} />
            </Routes>
          </main>

          {/* Sayfa Altlığı */}
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

// App bileşenini varsayılan olarak dışa aktarır
export default App;
