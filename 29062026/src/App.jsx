import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Filter from './pages/Filter';
import Detail from './pages/Detail';
import Payment from './pages/Payment';
import Receipt from './pages/Receipt';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
          {/* Main Navigation */}
          <Navbar />

          {/* Page Routing Container */}
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/receipt" element={<Receipt />} />
            </Routes>
          </main>

          {/* Footer Navigation */}
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
