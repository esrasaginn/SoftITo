import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavorite, setSelectedCity } from '../store/slices/weatherSlice';

// Hava durumuna göre dinamik arka plan görselleri
const WEATHER_BACKGROUNDS = {
  'Clear': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=600&q=80',
  'Clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80',
  'Rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80',
  'Storm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=600&q=80'
};

// Çizgisel minimalist hava durumu ikonu
const renderMinimalIcon = (state, size = 18) => {
  const strokeWidth = size > 30 ? 1.4 : 1.2;
  switch (state) {
    case 'Clear':
      return (
        <svg viewBox="-12 -12 24 24" width={size} height={size} style={{ overflow: 'visible', color: '#fff' }}>
          <circle cx="0" cy="0" r="4.5" fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M 0 -7 L 0 -9 M 0 7 L 0 9 M -7 0 L -9 0 M 7 0 L 9 0 M -4.8 -4.8 L -6 -6 M 4.8 4.8 L 6 6 M -4.8 4.8 L -6 6 M 4.8 -4.8 L 6 -6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    case 'Clouds':
      return (
        <svg viewBox="-12 -12 24 24" width={size} height={size} style={{ overflow: 'visible', color: '#fff' }}>
          <path d="M -6 1.5 A 2.5 2.5 0 0 1 -3.5 -2.5 A 3.8 3.8 0 0 1 3.5 -3 A 3 3 0 0 1 6 1.5 Z" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'Rain':
      return (
        <svg viewBox="-12 -12 24 24" width={size} height={size} style={{ overflow: 'visible', color: '#fff' }}>
          <path d="M -6 1 A 2.5 2.5 0 0 1 -3.5 -3 A 3.8 3.8 0 0 1 3.5 -3.5 A 3 3 0 0 1 6 1 Z" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -2.5 3.5 L -3.5 6 M 0.5 3.5 L -0.5 6 M 3.5 3.5 L 2.5 6" stroke="currentColor" strokeWidth={strokeWidth - 0.2} strokeLinecap="round" />
        </svg>
      );
    case 'Storm':
      return (
        <svg viewBox="-12 -12 24 24" width={size} height={size} style={{ overflow: 'visible', color: '#fff' }}>
          <path d="M -6 1 A 2.5 2.5 0 0 1 -3.5 -3 A 3.8 3.8 0 0 1 3.5 -3.5 A 3 3 0 0 1 6 1 Z" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -0.5 2.5 L 1 4.5 L -1.5 6 L 0.5 8" fill="none" stroke="currentColor" strokeWidth={strokeWidth - 0.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="-12 -12 24 24" width={size} height={size} style={{ overflow: 'visible', color: '#fff' }}>
          <circle cx="0" cy="0" r="2.5" fill="currentColor" />
        </svg>
      );
  }
};

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, selectedCity } = useSelector((state) => state.weather);
  const { user } = useSelector((state) => state.auth);

  // Favori şehirlerin hava durumunu çek
  const [favWeatherData, setFavWeatherData] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);

  useEffect(() => {
    if (!user || favorites.length === 0) {
      setFavWeatherData([]);
      return;
    }

    const fetchFavWeather = async () => {
      setLoadingFav(true);
      try {
        const promises = favorites.map(async (fav) => {
          try {
            // Önce geocoding ile koordinat bul
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(fav.cityName)}&count=1&language=tr&format=json`);
            const geoData = await geoRes.json();
            if (!geoData.results || geoData.results.length === 0) {
              return { ...fav, temp: '--', weatherState: 'Clouds', description: 'Veri yok', humidity: 0, windSpeed: 0 };
            }
            const { latitude, longitude, country } = geoData.results[0];

            // Hava durumu verisi çek
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`);
            const data = await res.json();
            const temp = Math.round(data.current.temperature_2m);
            const wmoCode = data.current.weather_code;
            const humidity = data.current.relative_humidity_2m;
            const windSpeed = Math.round(data.current.wind_speed_10m);

            const mapWmoToState = (code) => {
              if (code === 0) return 'Clear';
              if ([1, 2, 3].includes(code)) return 'Clouds';
              if ([45, 48].includes(code)) return 'Clouds';
              if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
              if ([95, 96, 99].includes(code)) return 'Storm';
              return 'Clear';
            };

            const mapWmoToDesc = (code) => {
              if (code === 0) return 'Açık Gökyüzü';
              if (code === 1) return 'Çoğunlukla Açık';
              if (code === 2) return 'Parçalı Bulutlu';
              if (code === 3) return 'Bulutlu';
              if (code === 45 || code === 48) return 'Sisli';
              if ([51, 53, 55].includes(code)) return 'Çiseleyen Yağmur';
              if ([61, 63, 65].includes(code)) return 'Sağanak Yağış';
              if ([80, 81, 82].includes(code)) return 'Şiddetli Yağmur';
              if (code === 95) return 'Gök Gürültülü Fırtına';
              return 'Açık Hava';
            };

            return {
              ...fav,
              country: country || '',
              temp,
              humidity,
              windSpeed,
              weatherState: mapWmoToState(wmoCode),
              description: mapWmoToDesc(wmoCode)
            };
          } catch (e) {
            return {
              ...fav,
              country: '',
              temp: '--',
              weatherState: 'Clouds',
              description: 'Parçalı Bulutlu',
              humidity: 50,
              windSpeed: 10
            };
          }
        });
        const results = await Promise.all(promises);
        setFavWeatherData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFav(false);
      }
    };

    fetchFavWeather();
  }, [user, favorites]);

  const handleSelectFavorite = (cityName) => {
    dispatch(setSelectedCity(cityName));
    navigate('/');
  };

  const handleRemoveFavorite = (e, favoriteId) => {
    e.stopPropagation();
    if (user) {
      dispatch(removeFavorite({ favoriteId, userId: user.id }));
    }
  };

  return (
    <div className="container-fluid p-0" style={{ height: '100%' }}>

      {/* Başlık Bölümü */}
      <div className="mb-4 text-center text-sm-start animate-fade-in">
        <span
          className="badge rounded-pill px-3 py-2 mb-2"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.8rem',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}
        >
          <i className="bi bi-star-fill me-1" style={{ fontSize: '0.7rem' }} />
          Favorilerim
        </span>
        <h2 className="fw-bold text-white mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
          Favori Şehirlerim
        </h2>
        <p className="text-white-50" style={{ fontSize: '0.92rem', maxWidth: '600px' }}>
          Hızlıca erişmek istediğiniz şehirlerin anlık hava durumunu izleyin ve yönetin.
        </p>
      </div>

      {/* İçerik */}
      {!user ? (
        <div
          className="glass-panel p-5 text-center d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: '300px', borderRadius: '24px' }}
        >
          <i className="bi bi-shield-lock-fill text-warning mb-3" style={{ fontSize: '3rem' }} />
          <h4 className="fw-bold text-white">Giriş Yapılması Gerekiyor</h4>
          <p className="text-white-50" style={{ fontSize: '0.88rem' }}>
            Favori şehirlerinizi kaydetmek ve yönetmek için lütfen oturum açın.
          </p>
          <button
            onClick={() => navigate('/')}
            className="glass-btn px-4 py-2 mt-2 rounded-pill fw-semibold"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div
          className="glass-panel p-5 text-center d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: '300px', borderRadius: '24px' }}
        >
          <i className="bi bi-star text-white-50 mb-3" style={{ fontSize: '3rem', opacity: 0.5 }} />
          <h4 className="fw-bold text-white">Henüz Favori Eklenmedi</h4>
          <p className="text-white-50" style={{ fontSize: '0.88rem' }}>
            Ana sayfadaki hava tahmin kartının yanındaki yıldız ikonuna tıklayarak favori şehirlerinizi ekleyebilirsiniz.
          </p>
          <button
            onClick={() => navigate('/')}
            className="glass-btn px-4 py-2 mt-2 rounded-pill fw-semibold"
          >
            Şehir Keşfet
          </button>
        </div>
      ) : loadingFav ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-light mb-3" role="status" />
          <span className="text-white-50">Favori şehirler yükleniyor...</span>
        </div>
      ) : (
        <div className="row g-3 animate-fade-in">
          {favWeatherData.map((fav, idx) => (
            <div key={fav.id} className="col-xl-3 col-lg-4 col-md-6 col-12" style={{ animationDelay: `${idx * 60}ms` }}>
              <div
                onClick={() => handleSelectFavorite(fav.cityName)}
                className="position-relative overflow-hidden h-100"
                style={{
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                  minHeight: '220px',
                  border: selectedCity.toLowerCase() === fav.cityName.toLowerCase()
                    ? '2px solid rgba(255, 255, 255, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.08)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  const overlay = e.currentTarget.querySelector('.fav-overlay');
                  if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
                  if (selectedCity.toLowerCase() !== fav.cityName.toLowerCase()) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }
                  const overlay = e.currentTarget.querySelector('.fav-overlay');
                  if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)';
                }}
              >
                {/* Hava Durumuna Göre Dinamik Arka Plan */}
                <img
                  src={WEATHER_BACKGROUNDS[fav.weatherState] || WEATHER_BACKGROUNDS['Clear']}
                  alt={fav.description}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div
                  className="fav-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)',
                    transition: 'background 0.3s ease'
                  }}
                />

                {/* Sağ Üst: Hava Durumu İkonu + Silme Butonu */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 5
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '12px',
                      padding: '6px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: '1px solid rgba(255,255,255,0.12)'
                    }}
                  >
                    <div style={{ color: '#fff' }}>
                      {renderMinimalIcon(fav.weatherState, 16)}
                    </div>
                    <span className="text-white fw-semibold" style={{ fontSize: '0.7rem' }}>
                      {fav.description}
                    </span>
                  </div>

                  {/* Silme Butonu */}
                  <button
                    onClick={(e) => handleRemoveFavorite(e, fav.id)}
                    style={{
                      background: 'rgba(220, 53, 69, 0.2)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '10px',
                      padding: '6px 8px',
                      border: '1px solid rgba(220, 53, 69, 0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(220, 53, 69, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                    }}
                    title="Favorilerden Kaldır"
                  >
                    <i className="bi bi-trash-fill text-white" style={{ fontSize: '0.7rem' }} />
                  </button>
                </div>

                {/* Sol Üst: Seçili Göstergesi */}
                {selectedCity.toLowerCase() === fav.cityName.toLowerCase() && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'rgba(25, 135, 84, 0.3)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '10px',
                      padding: '4px 10px',
                      border: '1px solid rgba(25, 135, 84, 0.4)',
                      zIndex: 5
                    }}
                  >
                    <span className="text-white fw-semibold" style={{ fontSize: '0.62rem' }}>
                      <i className="bi bi-check-circle-fill me-1" />Aktif
                    </span>
                  </div>
                )}

                {/* Alt İçerik: Şehir Bilgileri */}
                <div
                  className="d-flex flex-column justify-content-end p-3 position-relative"
                  style={{ height: '100%', minHeight: '220px', zIndex: 2 }}
                >
                  {/* Şehir Adı */}
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.85rem' }} />
                    <h5 className="fw-bold text-white m-0" style={{ fontSize: '1.2rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                      {fav.cityName}
                    </h5>
                  </div>
                  <span className="text-white" style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                    {fav.country || ''}
                  </span>

                  {/* Sıcaklık ve Detaylar */}
                  <div className="d-flex align-items-end justify-content-between mt-2">
                    <span className="text-white fw-bold" style={{ fontSize: '2.8rem', lineHeight: '1', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                      {fav.temp}°
                    </span>

                    {/* Nem ve Rüzgar Kapsülleri */}
                    <div className="d-flex flex-column gap-1" style={{ marginBottom: '4px' }}>
                      <div
                        className="d-flex align-items-center gap-1 px-2 py-1"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '8px',
                          fontSize: '0.62rem',
                          color: 'rgba(255,255,255,0.85)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <i className="bi bi-droplet" style={{ fontSize: '0.58rem' }} />
                        <span>%{fav.humidity || 0}</span>
                      </div>
                      <div
                        className="d-flex align-items-center gap-1 px-2 py-1"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '8px',
                          fontSize: '0.62rem',
                          color: 'rgba(255,255,255,0.85)',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      >
                        <i className="bi bi-wind" style={{ fontSize: '0.58rem' }} />
                        <span>{fav.windSpeed || 0} km/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Favorites;
