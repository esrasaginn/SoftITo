import React from 'react';

// Hava durumu durumuna göre Bootstrap ikon sınıfını getiren fonksiyon
const getWeatherIconClass = (state, isNight) => {
  switch (state) {
    case 'Storm':
      return 'bi-cloud-lightning-rain-fill text-warning';
    case 'Rain':
      return 'bi-cloud-rain-heavy-fill text-info';
    case 'Clouds':
      return isNight ? 'bi-cloud-moon-fill text-light' : 'bi-cloud-sun-fill text-warning';
    case 'Clear':
    default:
      return isNight ? 'bi-moon-stars-fill text-primary' : 'bi-sun-fill text-warning';
  }
};

const WeatherCard = ({ data, selectedHour }) => {
  if (!data) return null;

  // Seçili saat verisi varsa onu kullanalım, yoksa anlık veriyi varsayılan yapalım
  const currentHourData = selectedHour || {
    temp: data.temp,
    windSpeed: data.windSpeed,
    humidity: data.humidity,
    weatherState: data.weatherState,
    description: data.description,
    time: 'Şimdi'
  };

  // Seçili saatin gece olup olmadığını anlayalım
  const isNight = currentHourData.time !== 'Şimdi' && 
                  (parseInt(currentHourData.time.split(':')[0], 10) >= 20 || 
                   parseInt(currentHourData.time.split(':')[0], 10) < 6);

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '30px',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Kart Arkasındaki Dekoratif Renkli Parlama (Hava durumuna göre değişir) */}
      <div 
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: currentHourData.weatherState === 'Storm' ? 'rgba(255, 193, 7, 0.15)' :
                      currentHourData.weatherState === 'Rain' ? 'rgba(13, 202, 240, 0.15)' :
                      isNight ? 'rgba(13, 110, 253, 0.15)' : 'rgba(255, 193, 7, 0.2)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Üst Bilgi Satırı */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <span 
            className="badge rounded-pill mb-2"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            Hava Durumu Raporu
          </span>
          <h2 className="m-0 fw-bold tracking-tight" style={{ fontSize: '2.2rem' }}>
            {currentHourData.weatherState === 'Storm' ? 'Gök Gürültülü Fırtına' :
             currentHourData.weatherState === 'Rain' ? 'Sağanak Yağışlı' :
             currentHourData.weatherState === 'Clouds' ? 'Parçalı Bulutlu' : 'Açık Hava'}
          </h2>
          <p className="text-white-50 mt-1 mb-0" style={{ fontSize: '0.9rem' }}>
            {currentHourData.description} &bull; Saat: {currentHourData.time}
          </p>
        </div>

        {/* Büyük Durum İkonu */}
        <div style={{ fontSize: '3.5rem', display: 'flex', alignItems: 'center' }}>
          <i className={`bi ${getWeatherIconClass(currentHourData.weatherState, isNight)}`} style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}></i>
        </div>
      </div>

      {/* Derece ve Yan Parametre Kutuları */}
      <div className="row align-items-end mt-4">
        
        {/* Sol: Derece Göstergesi */}
        <div className="col-7">
          <div className="d-flex align-items-start">
            <span className="fw-bold" style={{ fontSize: '5rem', lineHeight: '1', letterSpacing: '-2px' }}>
              {currentHourData.temp}
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: '500', marginTop: '10px', marginLeft: '5px' }}>
              &deg;C
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2 text-white-50" style={{ fontSize: '0.9rem' }}>
            <i className="bi bi-geo-alt-fill text-white"></i>
            <span className="text-white fw-medium">{data.city}</span>
          </div>
        </div>

        {/* Sağ: İkincil Parametreler (Rüzgar, Nem, Durum) */}
        <div className="col-5">
          <div 
            className="d-flex flex-column gap-3 p-3 rounded-4"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {/* Rüzgar Hızı */}
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-white-50" style={{ fontSize: '0.8rem' }}>Rüzgar</span>
              <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-wind me-1 text-white-50"></i> {currentHourData.windSpeed} km/h
              </span>
            </div>

            {/* Nem Oranı */}
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-white-50" style={{ fontSize: '0.8rem' }}>Nem</span>
              <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-droplet-fill me-1 text-info"></i> {currentHourData.humidity}%
              </span>
            </div>

            {/* Hava Durumu Tipi */}
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-white-50" style={{ fontSize: '0.8rem' }}>Durum</span>
              <span className="fw-semibold" style={{ fontSize: '0.85rem', color: '#ffc107' }}>
                {currentHourData.weatherState === 'Storm' ? 'Fırtına' :
                 currentHourData.weatherState === 'Rain' ? 'Yağmur' :
                 currentHourData.weatherState === 'Clouds' ? 'Bulutlu' : 'Açık'}
              </span>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default WeatherCard;
