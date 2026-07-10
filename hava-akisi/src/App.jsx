import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import CityDetail from './pages/CityDetail';
import Favorites from './pages/Favorites';

// Bootstrap Kütüphanesi Tasarımları
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Özel Cam Efekti Tasarımları
import './styles/glassmorphism.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<CityDetail />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </MainLayout>
      </Router>
    </Provider>
  );
}

export default App;
