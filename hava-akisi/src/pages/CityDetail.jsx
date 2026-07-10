import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeather } from '../store/slices/weatherSlice';
import WeatherCard from '../components/WeatherCard';
import HourlyForecastChart from '../components/HourlyForecastChart';

const CityDetail = () => {
  const dispatch = useDispatch();
  const { weatherData, selectedCity, selectedHourIndex, loading } = useSelector((state) => state.weather);

  // Sayfa açıldığında hava durumu verisi yoksa verileri çekelim
  useEffect(() => {
    if (!weatherData) {
      dispatch(fetchWeather(selectedCity));
    }
  }, [dispatch, weatherData, selectedCity]);

  if (loading) {
    return (
      <div className="glass-panel d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  // Seçili saat verisini veya varsayılan olarak ilk saat verisini alalım
  const activeHourData = weatherData.forecast[selectedHourIndex] || weatherData.forecast[0];

  // Alt bilgi parametre kutularının verileri
  const detailPanels = [
    { title: 'Rüzgar Gücü', value: `${activeHourData.windSpeed} km/h`, desc: 'Kuzey-Kuzeydoğu Esintisi', icon: 'bi-wind', color: '#17a2b8' },
    { title: 'Bağıl Nem', value: `${activeHourData.humidity}%`, desc: 'Yoğunlaşma ve çiy riski orta seviyede', icon: 'bi-droplets-fill', color: '#0dcaf0' },
    { title: 'UV İndeksi', value: '4 / 10', desc: 'Orta seviye UV maruziyeti', icon: 'bi-sun-fill', color: '#ffc107' },
    { title: 'Görüş Mesafesi', value: '10 km', desc: 'Net ve açık görüş alanı', icon: 'bi-eye-fill', color: '#20c997' },
    { title: 'Gün Doğumu / Batımı', value: '05:42 / 20:34', desc: 'Gündüz süresi: 14s 52dk', icon: 'bi-sunrise-fill', color: '#fd7e14' },
    { title: 'Hava Basıncı', value: '1013 hPa', desc: 'Standart deniz seviyesi basıncı', icon: 'bi-speedometer', color: '#6f42c1' }
  ];

  // 5 günlük hava durumu görünümü için veri yapısı (derece aralıklarını aktif sıcaklığa göre esnetelim)
  const outlook = [
    { day: 'Bugün', icon: 'bi-cloud-sun-fill', tempMin: activeHourData.temp - 3, tempMax: activeHourData.temp + 4, state: activeHourData.weatherState },
    { day: 'Yarın', icon: 'bi-cloud-rain-heavy-fill', tempMin: activeHourData.temp - 4, tempMax: activeHourData.temp + 2, state: 'Rain' },
    { day: 'Cumartesi', icon: 'bi-cloud-lightning-rain-fill', tempMin: activeHourData.temp - 6, tempMax: activeHourData.temp + 1, state: 'Storm' },
    { day: 'Pazar', icon: 'bi-sun-fill', tempMin: activeHourData.temp - 2, tempMax: activeHourData.temp + 6, state: 'Clear' },
    { day: 'Pazartesi', icon: 'bi-cloud-fill', tempMin: activeHourData.temp - 1, tempMax: activeHourData.temp + 3, state: 'Clouds' },
  ];

  return (
    <div className="container-fluid p-0">
      
      {/* Başlık Bölümü */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="m-0 fw-bold">{weatherData.city} Detay Raporu</h2>
          <p className="text-white-50 m-0" style={{ fontSize: '0.9rem' }}>
            Saatlik hava durumu parametreleri ve 5 günlük genel görünüm.
          </p>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Sol Sütun: Ana Kart, Grafik ve Detay Widget'ları */}
        <div className="col-xl-8 col-lg-7">
          <WeatherCard data={weatherData} selectedHour={activeHourData} />
          
          <HourlyForecastChart />

          {/* 6'lı Detay İstatistik Kutuları Izgarası */}
          <div className="row g-3 mt-3">
            {detailPanels.map((panel, idx) => (
              <div key={idx} className="col-md-4 col-sm-6">
                <div 
                  className="glass-panel p-3"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '125px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="text-white-50 fw-semibold" style={{ fontSize: '0.8rem' }}>{panel.title}</span>
                    <i className={`bi ${panel.icon}`} style={{ fontSize: '1.2rem', color: panel.color }} />
                  </div>
                  <div className="mt-2">
                    <h4 className="fw-bold m-0" style={{ fontSize: '1.4rem' }}>{panel.value}</h4>
                    <p className="text-white-50 m-0 mt-1" style={{ fontSize: '0.75rem' }}>{panel.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Sütun: 5 Günlük Görünüm Kartı */}
        <div className="col-xl-4 col-lg-5">
          <div className="glass-panel p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-calendar-week-fill text-info"></i>
              5 Günlük Hava Görünümü
            </h5>

            <div className="d-flex flex-column gap-3">
              {outlook.map((day, idx) => (
                <div 
                  key={idx}
                  className="d-flex align-items-center justify-content-between p-3 rounded-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Gün İsmi */}
                  <div style={{ width: '90px' }}>
                    <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>{day.day}</span>
                  </div>

                  {/* Durum İkonu */}
                  <div style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center' }}>
                    <i 
                      className={`bi ${day.icon}`} 
                      style={{
                        color: day.state === 'Storm' ? '#ffc107' :
                               day.state === 'Rain' ? '#0dcaf0' :
                               day.state === 'Clear' ? '#ffc107' : '#fff'
                      }}
                    />
                  </div>

                  {/* Hava Durumu Sözel İfadesi */}
                  <div style={{ flex: 1, paddingLeft: '15px' }}>
                    <span className="text-white-50" style={{ fontSize: '0.8rem' }}>
                      {day.state === 'Storm' ? 'Fırtınalı' :
                       day.state === 'Rain' ? 'Yağmurlu' :
                       day.state === 'Clouds' ? 'Bulutlu' : 'Güneşli'}
                    </span>
                  </div>

                  {/* Sıcaklık Barı ve Derece Değerleri */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-white-50" style={{ fontSize: '0.8rem', width: '25px', textAlign: 'right' }}>
                      {day.tempMin}°
                    </span>
                    {/* Sıcaklık aralığı görsel barı */}
                    <div 
                      style={{
                        width: '60px',
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                        position: 'relative'
                      }}
                    >
                      <div 
                        style={{
                          position: 'absolute',
                          left: '20%',
                          right: '20%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #0dcaf0, #ffc107)',
                          borderRadius: '2px'
                        }}
                      />
                    </div>
                    <span className="fw-semibold" style={{ fontSize: '0.8rem', width: '25px' }}>
                      {day.tempMax}°
                    </span>
                  </div>

                </div>
              ))}
            </div>

            {/* Sabit Bilgilendirme Notu */}
            <div 
              className="mt-4 p-3 rounded-4"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                fontSize: '0.8rem'
              }}
            >
              <h6 className="fw-bold mb-2">Meteoroloji Notu</h6>
              <p className="text-white-50 m-0 leading-relaxed">
                Yüksek basınç sisteminin etkisiyle önümüzdeki günlerde yerel bulutlanmalar dışında sıcaklık mevsim normallerinde seyredecektir. Rüzgar güney yönlerden hafif esecek.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default CityDetail;
