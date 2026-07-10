import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWeather, setSelectedCity, setSelectedDayIndex, fetchFavorites, addFavorite, removeFavorite } from '../store/slices/weatherSlice';
import { updateVisualState, createAlert, deleteAlert } from '../store/slices/uiSlice';
import { loginUser, logoutUser } from '../store/slices/authSlice';
import HourlyForecastChart from '../components/HourlyForecastChart';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Mağaza Durumları
  const { weatherData, selectedCity, favorites, selectedHourIndex, selectedDayIndex, loading: weatherLoading, error: weatherError } = useSelector((state) => state.weather);
  const { user, error: authError } = useSelector((state) => state.auth);
  const { alerts } = useSelector((state) => state.ui);

  // Arayüz Görünürlük Durumları
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [popularWeatherData, setPopularWeatherData] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(false);

  const POPULAR_CITIES = [
    { name: 'İstanbul', country: 'Türkiye', lat: 41.0082, lon: 28.9784, flag: '🇹🇷' },
    { name: 'Ankara', country: 'Türkiye', lat: 39.9334, lon: 32.8597, flag: '🇹🇷' },
    { name: 'İzmir', country: 'Türkiye', lat: 38.4237, lon: 27.1428, flag: '🇹🇷' },
    { name: 'Antalya', country: 'Türkiye', lat: 36.8969, lon: 30.7133, flag: '🇹🇷' },
    { name: 'Bursa', country: 'Türkiye', lat: 40.1885, lon: 29.0610, flag: '🇹🇷' },
    { name: 'Paris', country: 'Fransa', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    { name: 'Londra', country: 'İngiltere', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    { name: 'New York', country: 'ABD', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
    { name: 'Tokyo', country: 'Japonya', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    { name: 'Dubai', country: 'BAE', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
    { name: 'Roma', country: 'İtalya', lat: 41.9028, lon: 12.4964, flag: '🇮🇹' },
    { name: 'Barselona', country: 'İspanya', lat: 41.3851, lon: 2.1734, flag: '🇪🇸' }
  ];

  // Hava durumuna göre dinamik arka plan görselleri
  const WEATHER_BACKGROUNDS = {
    'Clear': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=600&q=80',
    'Clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80',
    'Rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80',
    'Storm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=600&q=80'
  };

  // Form Verileri
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [alertCity, setAlertCity] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('danger');
  const [alertMessage, setAlertMessage] = useState('');

  // Ana şehir değişiminde hava durumunu çekelim
  useEffect(() => {
    dispatch(fetchWeather(selectedCity));
  }, [dispatch, selectedCity]);

  // Popüler şehirlerin hava durumunu ilk yüklemede çekelim
  useEffect(() => {
    const fetchPopular = async () => {
      setLoadingPopular(true);
      try {
        const promises = POPULAR_CITIES.map(async (city) => {
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`);
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
              ...city,
              temp,
              humidity,
              windSpeed,
              weatherState: mapWmoToState(wmoCode),
              description: mapWmoToDesc(wmoCode)
            };
          } catch (e) {
            return {
              ...city,
              temp: 15 + Math.round(Math.random() * 8),
              weatherState: 'Clouds',
              description: 'Parçalı Bulutlu'
            };
          }
        });
        const results = await Promise.all(promises);
        setPopularWeatherData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopular();
  }, []);

  // Harf girildiğinde otomatik şehir önerilerini yükleyen useEffect (Debounce özellikli)
  useEffect(() => {
    const query = searchVal.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=tr&format=json`);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results.map(r => ({
            name: r.name,
            country: r.country || '',
            admin: r.admin1 || ''
          })));
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 250); // 250ms debounce gecikmesi

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal]);

  // Ana hava durumu değişiminde görsel VFX ve arka plan durumunu güncelleyelim
  useEffect(() => {
    if (weatherData && weatherData.forecast.length > 0) {
      dispatch(updateVisualState({
        weatherState: weatherData.weatherState,
        timeStr: weatherData.forecast[0].time
      }));
    }
  }, [dispatch, weatherData]);

  // Oturum açıldığında favori listesini yükleyelim
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user]);

  // Arama formu gönderimi
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchVal.trim();
    if (query) {
      dispatch(setSelectedCity(query));
      setSearchVal('');
      setShowDetailView(true);
      // Formun hemen unmount olması bazı tarayıcılarda sayfa yenilenmesine sebep olabilir, setTimeout ile geciktirelim
      setTimeout(() => {
        setShowSearch(false);
      }, 50);
    }
  };

  // Oturum açma
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (emailInput && passwordInput) {
      dispatch(loginUser({ email: emailInput, password: passwordInput })).then((res) => {
        if (!res.error) {
          setShowLoginModal(false);
          setEmailInput('');
          setPasswordInput('');
        }
      });
    }
  };

  const handleQuickLogin = (email, password) => {
    dispatch(loginUser({ email, password })).then((res) => {
      if (!res.error) {
        setShowLoginModal(false);
      }
    });
  };

  // Favoriye ekleme/çıkarma
  const handleToggleFavorite = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const isFav = favorites.find(f => f.cityName.toLowerCase() === selectedCity.toLowerCase());
    if (isFav) {
      dispatch(removeFavorite({ favoriteId: isFav.id, userId: user.id }));
    } else {
      dispatch(addFavorite({ userId: user.id, cityName: selectedCity }));
    }
  };

  // Acil alarm yayınlama
  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (alertCity && alertMessage) {
      dispatch(createAlert({
        city: alertCity.trim(),
        severity: alertSeverity,
        message: alertMessage.trim(),
        active: true
      }));
      setAlertCity('');
      setAlertMessage('');
    }
  };

  const isFavorite = favorites.some(f => f.cityName.toLowerCase() === selectedCity.toLowerCase());

  // Türkçe hava durumu durum başlığı eşleşmeleri (Görsel 1 stiline göre)
  const weatherTitleMap = {
    'Storm': { main: 'Kuvvetli Fırtına', sub: 've Gök Gürültülü Yağış' },
    'Rain': { main: 'Yoğun Sağanak', sub: 've Kuvvetli Yağış' },
    'Clouds': { main: 'Bulutlu Gökyüzü', sub: 've Kapalı Arayüz' },
    'Clear': { main: 'Açık Hava', sub: 've Bol Güneşli Gün' }
  };

  const currentTitle = weatherData ? weatherTitleMap[weatherData.weatherState] : { main: 'Kuvvetli Fırtına', sub: 've Gök Gürültülü Yağış' };

  // Sağ taraftaki haftalık kapsüller ve ana kart için çizgisel minimalist hava durumu ikonu oluşturucu (Renksiz, sade beyaz)
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

  const selectedHourData = weatherData?.forecast?.[(selectedDayIndex * 24) + selectedHourIndex];
  const hourInt = selectedHourData ? parseInt(selectedHourData.time.split(':')[0]) : 12;
  const isSunny = selectedHourData?.weatherState === 'Clear';
  const isPartlyCloudy = selectedHourData?.weatherState === 'Clouds';

  // UV İndeksi hesaplama (seçili saate ve gökyüzü durumuna göre dinamik)
  let uvIndex = 1;
  if (isSunny) {
    uvIndex = Math.max(1, Math.round(7 - Math.abs(hourInt - 13) * 0.9));
  } else if (isPartlyCloudy) {
    uvIndex = Math.max(1, Math.round(4 - Math.abs(hourInt - 13) * 0.5));
  } else {
    uvIndex = 1;
  }

  const needsSunscreen = uvIndex >= 3;

  return (
    <div className="container-fluid p-0" style={{ height: '100%' }}>

      {/* ÜST BAŞLIK SATIRI (Karşılama Alanı ve Butonlar) */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        {/* Karşılama Metni ve Geri Dön Butonu */}
        <div className="d-flex align-items-center gap-3">
          <div>
            <span className="text-white-50 fw-light" style={{ fontSize: '0.85rem' }}>Hoş Geldiniz</span>
            {user && (
              <h4
                className="fw-bold text-white m-0"
                style={{ fontSize: '1.15rem' }}
              >
                {user.name}
              </h4>
            )}
          </div>
          {showDetailView && (
            <button
              onClick={() => setShowDetailView(false)}
              className="glass-btn px-2 py-1 rounded-pill text-white-50 d-flex align-items-center gap-1"
              style={{ fontSize: '0.72rem', height: '28px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              title="Şehir Seçimine Geri Dön"
            >
              <i className="bi bi-arrow-left" /> Şehir Listesi
            </button>
          )}
        </div>

        {/* Eylem Butonları Barı */}
        <div className="d-flex align-items-center gap-2">

          {/* Şehir Arama Butonu ve Arama Kutusu */}
          {showSearch ? (
            <div className="position-relative">
              <form onSubmit={handleSearchSubmit} className="d-flex align-items-center gap-1.5">
                <input
                  type="text"
                  className="glass-input py-1 px-3"
                  placeholder="Şehir Ara..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoFocus
                  style={{ fontSize: '0.8rem', width: '130px', height: '38px', borderRadius: '19px' }}
                />
                <button
                  type="submit"
                  className="glass-btn p-0 rounded-circle"
                  style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Ara"
                >
                  <i className="bi bi-search" style={{ fontSize: '0.85rem' }} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSuggestions([]);
                  }}
                  className="btn btn-sm btn-link text-white-50 p-0 ms-1"
                >
                  <i className="bi bi-x-lg" style={{ fontSize: '0.85rem' }} />
                </button>
              </form>

              {/* Arama Önerileri Dropdown Menüsü */}
              {suggestions.length > 0 && (
                <div
                  className="glass-panel position-absolute mt-2"
                  style={{
                    top: '38px',
                    left: 0,
                    width: '220px',
                    zIndex: 1100,
                    background: 'rgba(15, 23, 42, 0.96)',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                    padding: '6px 0',
                    maxHeight: '220px',
                    overflowY: 'auto'
                  }}
                >
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        dispatch(setSelectedCity(item.name));
                        setSearchVal('');
                        setSuggestions([]);
                        setShowSearch(false);
                        setShowDetailView(true);
                      }}
                      className="px-3 py-2 text-white-50 d-flex flex-column"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontSize: '0.8rem',
                        lineHeight: '1.2',
                        borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      }}
                    >
                      <strong className="text-white">{item.name}</strong>
                      <span className="text-white-50" style={{ fontSize: '0.68rem', marginTop: '2px' }}>
                        {item.admin ? `${item.admin}, ` : ''}{item.country}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="glass-btn p-0 rounded-circle"
              style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              title="Şehir Ara"
            >
              <i className="bi bi-search" />
            </button>
          )}

          {/* Alarm Oluşturma Eylemi (+) - Admin / Editörler için */}
          {user && (user.role === 'admin' || user.role === 'editor') && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="glass-btn p-0 rounded-circle"
              style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.15)' }}
              title="Meteorolojik Alarm Yayınla"
            >
              <i className="bi bi-plus-lg" />
            </button>
          )}

          {user && (
            <button
              onClick={() => navigate('/favorites')}
              className="glass-btn p-0 rounded-circle"
              style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              title="Favorilerim"
            >
              <i className="bi bi-star" />
            </button>
          )}

          {/* Bildirim Zili ve Açılır Menüsü */}
          <div className="position-relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="glass-btn p-0 rounded-circle"
              style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              title="Meteorolojik Bildirimler"
            >
              <i className="bi bi-bell" />
              {alerts.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {alerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="glass-panel p-3 position-absolute end-0 mt-2"
                style={{
                  width: '280px',
                  zIndex: 1100,
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="fw-bold mb-2 pb-2 border-bottom border-secondary border-opacity-25">Aktif Uyarılar</div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {alerts.length === 0 ? (
                    <div className="text-white-50 text-center py-2" style={{ fontSize: '0.8rem' }}>Aktif alarm yok.</div>
                  ) : (
                    alerts.map(al => (
                      <div
                        key={al.id}
                        className="mb-2 p-2 rounded d-flex justify-content-between align-items-start gap-1"
                        style={{
                          fontSize: '0.75rem',
                          background: al.severity === 'danger' ? 'rgba(220, 53, 69, 0.12)' : 'rgba(255, 193, 7, 0.12)',
                          border: al.severity === 'danger' ? '1px solid rgba(220, 53, 69, 0.25)' : '1px solid rgba(255, 193, 7, 0.25)',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <strong className={al.severity === 'danger' ? 'text-danger' : 'text-warning'} style={{ fontSize: '0.72rem' }}>
                            [{al.city}]
                          </strong>{' '}
                          <span className="text-white-50" style={{ fontSize: '0.72rem' }}>{al.message}</span>
                        </div>
                        {user && (user.role === 'admin' || user.role === 'editor') && (
                          <button
                            onClick={() => dispatch(deleteAlert(al.id))}
                            className="btn btn-link p-0 text-white-50 hover-text-danger border-0 ms-1"
                            style={{ background: 'transparent', outline: 'none' }}
                            title="Alarmı Kaldır"
                          >
                            <i className="bi bi-trash" style={{ fontSize: '0.75rem' }} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Giriş Yap Butonu (Oturum Kapalıyken) / Kullanıcı Avatarı (Oturum Açıkken) */}
          {!user ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="glass-btn px-3 py-1.5 rounded-pill fw-semibold text-white d-flex align-items-center gap-1.5 ms-1"
              style={{ fontSize: '0.74rem', height: '38px', background: 'rgba(255,255,255,0.08)' }}
            >
              <i className="bi bi-box-arrow-in-right" /> Giriş Yap
            </button>
          ) : (
            <img
              src={user.avatar}
              alt="Profil"
              onClick={() => setShowLoginModal(true)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.15)',
                marginLeft: '4px'
              }}
              title={`${user.name} (${user.role.toUpperCase()})`}
            />
          )}
        </div>

      </div>

      {/* ANA GÖVDE PANELİ */}
      {!showDetailView ? (
        /* POPÜLER ŞEHİRLER DASHBOARD'U */
        <div className="py-2">
          {/* Başlık ve Kapsül Rozeti */}
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
              HavaAkışı &bull; Popüler Lokasyonlar
            </span>
            <h2 className="fw-bold text-white mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>
              Küresel Hava Durumu
            </h2>
            <p className="text-white-50" style={{ fontSize: '0.92rem', maxWidth: '600px' }}>
              Dünyanın en popüler destinasyonlarının anlık hava durumu raporunu aşağıdan inceleyebilir veya yukarıdaki arama alanından dilediğiniz şehri arayabilirsiniz.
            </p>
          </div>

          {/* Grid Listesi */}
          {loadingPopular ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
              <div className="spinner-border text-light mb-3" role="status" />
              <span className="text-white-50">Küresel veriler yükleniyor...</span>
            </div>
          ) : (
            <div className="row g-3 animate-fade-in">
              {popularWeatherData.map((city, idx) => (
                <div key={city.name} className="col-xl-3 col-lg-4 col-md-6 col-12" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div
                    onClick={() => {
                      dispatch(setSelectedCity(city.name));
                      setShowDetailView(true);
                    }}
                    className="position-relative overflow-hidden h-100"
                    style={{
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                      minHeight: '220px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.45), 0 0 30px rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                      const overlay = e.currentTarget.querySelector('.city-overlay');
                      if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      const overlay = e.currentTarget.querySelector('.city-overlay');
                      if (overlay) overlay.style.background = 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)';
                    }}
                  >
                    {/* Hava Durumuna Göre Dinamik Arka Plan */}
                    <img
                      src={WEATHER_BACKGROUNDS[city.weatherState] || WEATHER_BACKGROUNDS['Clear']}
                      alt={city.description}
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
                      className="city-overlay"
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

                    {/* Sağ Üst: Hava Durumu İkonu */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
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
                        {renderMinimalIcon(city.weatherState, 16)}
                      </div>
                      <span className="text-white fw-semibold" style={{ fontSize: '0.7rem' }}>
                        {city.description}
                      </span>
                    </div>

                    {/* Alt İçerik: Şehir Bilgileri */}
                    <div
                      className="d-flex flex-column justify-content-end p-3 position-relative"
                      style={{ height: '100%', minHeight: '220px', zIndex: 2 }}
                    >
                      {/* Bayrak ve Şehir Adı */}
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span style={{ fontSize: '1.2rem' }}>{city.flag}</span>
                        <h5 className="fw-bold text-white m-0" style={{ fontSize: '1.2rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                          {city.name}
                        </h5>
                      </div>
                      <span className="text-white" style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                        {city.country}
                      </span>

                      {/* Sıcaklık ve Detaylar */}
                      <div className="d-flex align-items-end justify-content-between mt-2">
                        <span className="text-white fw-bold" style={{ fontSize: '2.8rem', lineHeight: '1', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                          {city.temp}°
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
                            <span>%{city.humidity || 55}</span>
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
                            <span>{city.windSpeed || 12} km/s</span>
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
      ) : (
        /* DETAYLI HAVA DURUMU GÖRÜNÜMÜ */
        <div className="row g-4 align-items-stretch">

          {/* SOL BÖLÜM (Hava Durumu Başlığı, Açıklama ve Sürüklenebilir Grafik - GENİŞLETİLDİ) */}
          <div className="col-lg-9 d-flex flex-column justify-content-between">
            <div className="my-auto py-2">

              {/* "Hava Tahmini Raporu" Kapsül Rozeti */}
              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}
              >
                Hava Tahmini Raporu
              </span>

              {/* Büyük Durum Başlığı (Türkçe) */}
              <h1 className="responsive-title fw-bold tracking-tight m-0 text-white" style={{ fontSize: '4rem', lineHeight: '1.05' }}>
                {currentTitle.main}
              </h1>
              <h2 className="responsive-title fw-bold tracking-tight m-0 text-white" style={{ fontSize: '4rem', lineHeight: '1.05' }}>
                {currentTitle.sub}
              </h2>

              {/* Sözel Açıklama Paragrafı */}
              <p className="text-white-50 mt-4 mb-4 leading-relaxed" style={{ fontSize: '0.9rem', maxWidth: '520px' }}>
                {weatherData?.description ? `${weatherData.description}. Hissedilen sıcaklık değerleri mevsim normallerinde seyrediyor.` : ''} Bölgesel rüzgarlar kuzeydoğu yönünden saatte ortalama {weatherData?.windSpeed || 12} km hızla esiyor. Güncel verilere göre havada yağış ve nem oranı yüksek seviyededir.
              </p>

            </div>

            {/* Sürüklenebilir Zaman Akış Grafiği (Aşağıda konumlu) */}
            <div className="mt-auto pt-3">
              {weatherLoading ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-light spinner-border-sm" />
                </div>
              ) : (
                <HourlyForecastChart />
              )}
            </div>
          </div>

          {/* SAĞ BÖLÜM (Haftalık Hava Durumu ve Gelişmiş Detay Kartı - Çizgisel Minimalist) */}
          <div className="col-lg-3">

            {/* Birleşik Cam Efektli Detay ve Haftalık Tahmin Kartı */}
            <div
              className="glass-panel p-4 h-100 d-flex flex-column justify-content-between position-relative"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '26px',
                position: 'relative'
              }}
            >
              {/* Favori Ekleme/Çıkarma Yuvarlak Butonu (Kartın Sağ Üstünde Yüzer) */}
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className="glass-btn p-0 rounded-circle position-absolute"
                  style={{
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    zIndex: 10
                  }}
                  title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                >
                  <i className={`bi ${isFavorite ? 'bi-star-fill text-warning' : 'bi-star'}`} style={{ fontSize: '0.9rem' }} />
                </button>
              )}

              {/* Üst Kısım: Konum, Derece ve Büyük Minimalist Çizgisel İkon */}
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-white-50 fw-light" style={{ fontSize: '0.78rem' }}>
                      {selectedDayIndex === 0 ? 'Bugün' : (weatherData?.dailyForecast?.[selectedDayIndex]?.day || 'Gelecek Gün')}, {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h4 className="fw-bold text-white m-0 mt-1" style={{ fontSize: '1.15rem', paddingRight: '24px' }}>
                      {weatherData?.city || selectedCity}{weatherData?.country ? `, ${weatherData.country}` : ''}
                    </h4>
                    {/* Ek Koordinat Detayları */}
                    <div className="text-white-30 fw-light mt-0.5" style={{ fontSize: '0.68rem', opacity: 0.45 }}>
                      41.02° K, 40.52° D &bull; Rakım 12m
                    </div>
                    <div className="text-white-50 mt-2" style={{ fontSize: '0.85rem' }}>
                      {selectedHourData?.description || weatherData?.description || 'Açık'} {selectedHourData?.temp || weatherData?.temp || 10}°C
                    </div>
                  </div>

                  {/* Büyük Minimalist Çizgisel İkon (Renksiz, Sade Beyaz) */}
                  <div style={{ color: '#ffffff', opacity: 0.9, marginTop: '2px' }}>
                    {renderMinimalIcon(selectedHourData?.weatherState || weatherData?.weatherState, 42)}
                  </div>
                </div>

                {/* Günbatımı ve Gündoğumu Kapsülü (Mockup Tarzı Karanlık Pill) */}
                <div
                  className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '24px',
                    fontSize: '0.78rem',
                    marginTop: '16px'
                  }}
                >
                  <span className="d-flex align-items-center gap-1.5">
                    <i className="bi bi-sunrise text-white opacity-70" style={{ fontSize: '0.85rem' }} /> 05:32
                  </span>
                  <span className="opacity-30">14s 40d</span>
                  <span className="d-flex align-items-center gap-1.5">
                    20:12 <i className="bi bi-sunset text-white opacity-70" style={{ fontSize: '0.85rem' }} />
                  </span>
                </div>

                {/* Yağış Oranı Kapsülü */}
                <div
                  className="d-flex align-items-center justify-content-center gap-2 py-2 text-white-50"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '24px',
                    fontSize: '0.78rem',
                    marginTop: '8px'
                  }}
                >
                  <i className="bi bi-cloud-rain text-white opacity-75" style={{ fontSize: '0.9rem' }} />
                  <span>Yağış İhtimali: %{(weatherData?.humidity > 60) ? 80 : 15}</span>
                </div>

                {/* Ek Parametre Bilgileri (Nem, Rüzgar, UV ve Hava Kalitesi) */}
                <div className="mt-3 pt-3 border-top border-white border-opacity-5">
                  <div className="d-flex justify-content-between text-white-50" style={{ fontSize: '0.74rem' }}>
                    <span className="d-flex align-items-center gap-1"><i className="bi bi-droplet text-white opacity-60" /> Nem: %{weatherData?.humidity || 40}</span>
                    <span className="d-flex align-items-center gap-1"><i className="bi bi-wind text-white opacity-60" /> Rüzgar: {weatherData?.windSpeed || 12} km/s</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2 text-white-50" style={{ fontSize: '0.74rem' }}>
                    <span className="d-flex align-items-center gap-1"><i className="bi bi-sun text-white opacity-60" /> UV: {uvIndex} ({uvIndex >= 6 ? 'Çok Yüksek' : uvIndex >= 3 ? 'Orta' : 'Düşük'})</span>
                    <span className="d-flex align-items-center gap-1"><i className="bi bi-activity text-white opacity-60" /> AKİ: 42 (İyi)</span>
                  </div>
                </div>

                {/* Apple Hava Durumu Tarzı Dinamik UV / Güneş Kremi Uyarı Kartı */}
                <div
                  className="p-3 mt-3"
                  style={{
                    background: needsSunscreen ? 'rgba(234, 88, 12, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: needsSunscreen ? '1px solid rgba(234, 88, 12, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1.5">
                    <span className="fw-semibold text-white d-flex align-items-center gap-1.5" style={{ fontSize: '0.74rem' }}>
                      <i className={`bi ${needsSunscreen ? 'bi-sun-fill text-warning' : 'bi-sun text-white-50'}`} />
                      Güneş Koruması
                    </span>
                    <span
                      className="badge px-2 py-0.5"
                      style={{
                        background: needsSunscreen ? 'rgba(234, 88, 12, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: needsSunscreen ? '#ffd8a8' : '#94a3b8',
                        fontSize: '0.66rem',
                        fontWeight: '600'
                      }}
                    >
                      {needsSunscreen ? 'Öneriliyor' : 'Gerekli Değil'}
                    </span>
                  </div>

                  <p className="m-0 text-white-50 fw-light" style={{ fontSize: '0.7rem', lineHeight: '1.3' }}>
                    {needsSunscreen ? (
                      <span>
                        <strong>Güneş kremi kullanın!</strong> Şu an UV düzeyi yüksek. Saat 10:00 - 16:00 arasında koruyucu kullanılması tavsiye edilir.
                      </span>
                    ) : (
                      <span>
                        Şu an UV düzeyi düşük. Güneş koruması gerekli değil; açık havada güvenle vakit geçirebilirsiniz.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Alt Kısım: 7 Günlük Haftalık Kapsüller (Görseldeki gibi dikey hap kartlar - Çizgisel İkonlu) */}
              <div className="mt-4">
                <div className="text-white-50 fw-medium mb-2 px-1" style={{ fontSize: '0.8rem' }}>
                  Haftalık Tahmin
                </div>
                <div className="d-flex justify-content-between gap-1">
                  {weatherData?.dailyForecast?.map((dayObj, i) => (
                    <div
                      key={i}
                      onClick={() => dispatch(setSelectedDayIndex(i))}
                      className="d-flex flex-column align-items-center justify-content-between"
                      style={{
                        flex: 1,
                        padding: '10px 2px',
                        borderRadius: '16px',
                        background: i === selectedDayIndex
                          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%)'
                          : 'rgba(255, 255, 255, 0.04)',
                        border: i === selectedDayIndex
                          ? '1px solid rgba(255, 255, 255, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.04)',
                        boxShadow: i === selectedDayIndex ? '0 0 12px rgba(255, 255, 255, 0.08)' : 'none',
                        minWidth: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (i !== selectedDayIndex) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (i !== selectedDayIndex) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.04)';
                        }
                      }}
                    >
                      {/* Gün İsmi */}
                      <span className="text-white-50 fw-medium" style={{ fontSize: '0.62rem' }}>
                        {dayObj.day}
                      </span>

                      {/* Hava Durumu Çizgisel İkonu (Renksiz, Sade Beyaz) */}
                      <div className="my-1.5" style={{ height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                        {renderMinimalIcon(dayObj.weatherState, 14)}
                      </div>

                      {/* Dereceler (En Yüksek ve En Düşük) */}
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-white fw-bold" style={{ fontSize: '0.72rem', lineHeight: '1.2' }}>
                          {dayObj.maxTemp}°
                        </span>
                        <span className="text-white-50" style={{ fontSize: '0.62rem', opacity: 0.4, lineHeight: '1.2' }}>
                          {dayObj.minTemp}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Haftalık Özet Rapor Paragrafı */}
                <div
                  className="mt-3 p-2 text-white-50 fw-light text-center"
                  style={{
                    fontSize: '0.68rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    lineHeight: '1.3'
                  }}
                >
                  Haftalık Görünüm: Genel olarak serin ve yağış geçişli havalar etkisini sürdürüyor. Sıcaklıklar mevsim normalleri düzeyindedir.
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ALARM EKLEME PANELİ (Modal) */}
      {showAdminPanel && user && (user.role === 'admin' || user.role === 'editor') && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 8, 16, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel p-4"
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '24px'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                Meteorolojik Alarm Yayınla
              </h5>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="btn btn-sm btn-link text-white-50 p-0"
              >
                <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-white-50 mb-1" style={{ fontSize: '0.8rem' }}>Hedef Şehir</label>
                <input
                  type="text"
                  className="glass-input w-100"
                  placeholder="Örn: İzmir"
                  value={alertCity}
                  onChange={(e) => setAlertCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label text-white-50 mb-1" style={{ fontSize: '0.8rem' }}>Renk Kodu (Şiddet)</label>
                <select
                  className="glass-select w-100"
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                >
                  <option value="danger">Kırmızı Kod (Çok Tehlikeli)</option>
                  <option value="warning">Turuncu Kod (Tehlikeli / Uyarı)</option>
                </select>
              </div>
              <div>
                <label className="form-label text-white-50 mb-1" style={{ fontSize: '0.8rem' }}>Uyarı Açıklaması</label>
                <textarea
                  className="glass-input w-100"
                  rows="3"
                  placeholder="Meteorolojik uyarı açıklaması girin..."
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="glass-btn glass-btn-primary w-100 justify-content-center py-2 mt-2">
                Alarmı Yayınla
              </button>
            </form>
          </div>
        </div>
      )}

      {/* YETKİLİ GİRİŞ PANELİ (Modal) */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 8, 16, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel p-4"
            style={{
              width: '100%',
              maxWidth: '380px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '24px'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">Sisteme Giriş Yap</h5>
              <button
                onClick={() => setShowLoginModal(false)}
                className="btn btn-sm btn-link text-white-50 p-0"
              >
                <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {authError && (
              <div className="alert alert-danger py-2 px-3 border-0 rounded-3 text-danger mb-3" style={{ background: 'rgba(220,53,69,0.15)', fontSize: '0.85rem' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-white-50 mb-1" style={{ fontSize: '0.8rem' }}>E-Posta</label>
                <input
                  type="email"
                  className="glass-input w-100"
                  placeholder="ornek@havaakisi.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label text-white-50 mb-1" style={{ fontSize: '0.8rem' }}>Şifre</label>
                <input
                  type="password"
                  className="glass-input w-100"
                  placeholder="Şifreniz"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="glass-btn glass-btn-primary w-100 justify-content-center py-2 mt-2">
                Giriş Yap
              </button>
            </form>

            <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 text-center">
              <span className="text-white-50" style={{ fontSize: '0.75rem' }}>Hızlı Test Girişleri:</span>
              <div className="d-flex gap-2 mt-2">
                <button onClick={() => handleQuickLogin('admin@havaakisi.com', 'admin')} className="glass-btn p-1 flex-grow-1 justify-content-center" style={{ fontSize: '0.7rem' }}>Admin</button>
                <button onClick={() => handleQuickLogin('editor@havaakisi.com', 'editor')} className="glass-btn p-1 flex-grow-1 justify-content-center" style={{ fontSize: '0.7rem' }}>Editör</button>
                <button onClick={() => handleQuickLogin('user@havaakisi.com', 'user')} className="glass-btn p-1 flex-grow-1 justify-content-center" style={{ fontSize: '0.7rem' }}>Vatandaş</button>
              </div>
              {user && (
                <button
                  onClick={() => { dispatch(logoutUser()); setShowLoginModal(false); }}
                  className="glass-btn glass-btn-danger w-100 mt-3 justify-content-center"
                  style={{ fontSize: '0.8rem' }}
                >
                  Oturumu Kapat
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
