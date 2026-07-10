import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import AlertBanner from './AlertBanner';
import RainEffect from './VFX/RainEffect';
import LightningEffect from './VFX/LightningEffect';
import SunEffect from './VFX/SunEffect';
import StarsEffect from './VFX/StarsEffect';
import '../styles/glassmorphism.css';

// Unsplash Yüksek Çözünürlüklü Arka Plan Görselleri Eşleşmesi
const BACKGROUNDS = {
  'day-clear': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1920&q=80',
  'day-clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
  'day-rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80',
  'day-storm': 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=1920&q=80',
  'night-clear': 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80',
  'night-clouds': 'https://images.unsplash.com/photo-1532982902487-18655c7013b6?auto=format&fit=crop&w=1920&q=80',
  'night-rain': 'https://images.unsplash.com/photo-1437964706703-40b90bdf563a?auto=format&fit=crop&w=1920&q=80',
  'night-storm': 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&w=1920&q=80',
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { currentBackground, activeVFX } = useSelector((state) => state.ui);

  // Arka plan durumundan gece olup olmadığını öğrenelim
  const isNight = currentBackground && currentBackground.startsWith('night-');

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Pürüzsüz Opaklık Geçişi (Crossfade) Yapan Arka Plan Katmanları */}
      {Object.entries(BACKGROUNDS).map(([key, url]) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentBackground === key ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Gece gökyüzü (yıldızlar ve ay) efekti */}
      {isNight && <StarsEffect />}

      {/* VFX Efekt Katmanları */}
      {activeVFX.includes('sun') && <SunEffect />}
      {activeVFX.includes('rain') && <RainEffect />}
      {activeVFX.includes('lightning') && <LightningEffect />}

      {/* Ana Arayüz Düzeni */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw'
        }}
      >
        {/* En Üst Acil Durum Uyarı Bandı */}
        <AlertBanner />

        {/* İçerik Gövdesi */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Sol Üst Logo Alanı (Tıklanınca Ana Sayfaya Yönlendirir ve State Sıfırlar) */}
          <Link 
            to="/"
            className="responsive-logo"
            onClick={(e) => {
              // Zaten anasayfadaysak, sayfayı yeniden yükleyerek showDetailView gibi state'leri sıfırlayalım
              if (location.pathname === '/') {
                e.preventDefault();
                window.location.href = '/';
              }
            }}
            style={{ 
              position: 'absolute', 
              top: '24px', 
              left: '24px', 
              zIndex: 1000,
              fontSize: '2.1rem', 
              color: '#fff', 
              textShadow: '0 0 10px rgba(255,255,255,0.4)',
              transition: 'all 0.25s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.textShadow = '0 0 16px rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.4)';
            }}
            title="Ana Sayfa"
          >
            <i className="bi bi-wind"></i>
          </Link>

          {/* Sol Alt Sayfa Navigasyon İkonları (Sidebar olmadan zemin üzerinde yüzer) */}
          <nav 
            className="responsive-nav"
            style={{ 
              position: 'absolute', 
              bottom: '24px', 
              left: '24px', 
              zIndex: 1000,
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px'
            }}
          >
            <Link 
              to="/" 
              className="sidebar-icon-link"
              title="Ana Sayfa"
              style={{
                fontSize: '1.15rem',
                color: location.pathname === '/' ? '#fff' : 'rgba(255,255,255,0.5)',
                textShadow: location.pathname === '/' ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
                transition: 'all 0.3s ease',
                transform: location.pathname === '/' ? 'scale(1.15)' : 'scale(1)',
                display: 'inline-block'
              }}
            >
              <i className="bi bi-grid"></i>
            </Link>
            <Link 
              to="/detail" 
              className="sidebar-icon-link"
              title="Hava Durumu Detayı"
              style={{
                fontSize: '1.15rem',
                color: location.pathname === '/detail' ? '#fff' : 'rgba(255,255,255,0.5)',
                textShadow: location.pathname === '/detail' ? '0 0 10px rgba(255,255,255,0.6)' : 'none',
                transition: 'all 0.3s ease',
                transform: location.pathname === '/detail' ? 'scale(1.15)' : 'scale(1)',
                display: 'inline-block'
              }}
            >
              <i className="bi bi-cloud-sun"></i>
            </Link>
          </nav>

          {/* Ana İçerik Alanı (Sol kenardan butonlar için 80px boşluk bırakılmıştır) */}
          <main 
            className="responsive-main"
            style={{
              flex: 1,
              padding: '24px 32px 24px 80px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ flex: 1 }}>
              {children}
            </div>
            
            {/* Minik Footer - Sağ Alt ve Minimum Yükseklik */}
            <footer 
              style={{
                marginTop: '12px',
                paddingTop: '8px',
                paddingBottom: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                textAlign: 'right',
                fontSize: '0.72rem',
                color: 'rgba(255, 255, 255, 0.28)',
                fontWeight: '300',
                letterSpacing: '0.5px'
              }}
            >
              HavaAkışı &copy; {new Date().getFullYear()} &bull; Güvenilir Meteoroloji Portalı
            </footer>
          </main>

        </div>
      </div>

      <style>{`
        .sidebar-icon-link:hover {
          color: #ffffff !important;
          transform: scale(1.15) !important;
        }
      `}</style>

    </div>
  );
};

export default MainLayout;
