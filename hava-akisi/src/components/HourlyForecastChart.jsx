import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedHourIndex } from '../store/slices/weatherSlice';
import { updateVisualState } from '../store/slices/uiSlice';

const HourlyForecastChart = () => {
  const dispatch = useDispatch();
  const { weatherData, selectedHourIndex, selectedDayIndex = 0 } = useSelector((state) => state.weather);
  
  const rawForecast = weatherData?.forecast || [];
  const forecast = useMemo(() => {
    if (rawForecast.length <= 25) return rawForecast;
    return rawForecast.slice(selectedDayIndex * 24, (selectedDayIndex * 24) + 25);
  }, [rawForecast, selectedDayIndex]);

  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // SVG koordinatlarını ve boyutlarını hesaplayalım (Görsel referansa tam uyumlu şekilde dikey hizalandı)
  // SVG koordinatlarını ve boyutlarını hesaplayalım (Görsel referansa tam uyumlu şekilde dikey hizalandı)
  const chartData = useMemo(() => {
    if (forecast.length === 0) return { points: [], pathD: '', areaD: '' };

    const width = 800; // Enlemesine genişlik 800'e yükseltildi
    const height = 200; // Toplam yükseklik
    const paddingX = 20; // Yatay kenar boşluğu 20'ye düşürülerek genişlik maksimuma çıkarıldı

    // Grafik eğrisi Y koordinatlarının aralığı (geniş ve akıcı olması için esnetildi)
    const curveMinY = 75;  // En yüksek sıcaklığın (tepe) Y koordinatı
    const curveMaxY = 160; // En düşük sıcaklığın (vadi) Y koordinatı
    const curveHeight = curveMaxY - curveMinY;

    const temps = forecast.map(f => f.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempRange = maxTemp - minTemp || 1;

    const stepX = (width - paddingX * 2) / (forecast.length - 1);

    // 1. Aşama: Ham Nokta Koordinatlarını Çıkaralım
    const rawPoints = forecast.map((f, i) => {
      const x = paddingX + i * stepX;
      const y = curveMaxY - curveHeight * ((f.temp - minTemp) / tempRange);
      return { x, y, ...f, index: i };
    });

    // 2. Aşama: Çizgiyi İpeksi Yapmak İçin 3'lü Ağırlıklı Kayan Ortalama Filtresi (Gaussian Smoothing) Uygulayalım
    const points = rawPoints.map((pt, i) => {
      if (i === 0 || i === rawPoints.length - 1) return pt;
      const prevY = rawPoints[i - 1].y;
      const currY = pt.y;
      const nextY = rawPoints[i + 1].y;
      const smoothedY = (prevY + currY * 2 + nextY) / 4; // Yumuşatılmış Y değeri
      return { ...pt, y: smoothedY };
    });

    let pathD = '';
    let areaD = '';

    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        // Komşu noktaları bularak eğri teğetlerini daha da akışkan ve kıvrımlı yapalım
        const pMinus = i > 0 ? points[i - 1] : p0;
        const pPlus = i < points.length - 2 ? points[i + 2] : p1;

        // Gerginlik (tension) katsayısı - 0.40 çizgiyi ipek kadar yumuşak ve yuvarlak yapar
        const tension = 0.4;

        const cpX1 = p0.x + (p1.x - pMinus.x) * tension;
        const cpY1 = p0.y + (p1.y - pMinus.y) * tension;

        const cpX2 = p1.x - (pPlus.x - p0.x) * tension;
        const cpY2 = p1.y - (pPlus.y - p0.y) * tension;

        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }

      areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    }

    return { points, pathD, areaD, width, height };
  }, [forecast]);

  const activePoint = chartData.points[selectedHourIndex];

  // Sürükleme hareketiyle saat indeksini belirleme
  const updateIndexFromClientX = (clientX) => {
    if (!svgRef.current || forecast.length === 0) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;

    const scaleX = 800 / rect.width;
    const svgX = clickX * scaleX;

    const paddingX = 20;
    const width = 800;
    const usableWidth = width - 2 * paddingX;

    const pct = Math.max(0, Math.min(1, (svgX - paddingX) / usableWidth));
    const index = Math.round(pct * (forecast.length - 1));

    if (index !== selectedHourIndex && index >= 0 && index < forecast.length) {
      const pt = forecast[index];
      dispatch(setSelectedHourIndex(index));
      dispatch(updateVisualState({ weatherState: pt.weatherState, timeStr: pt.time }));
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateIndexFromClientX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateIndexFromClientX(e.clientX);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    updateIndexFromClientX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    updateIndexFromClientX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const preventDefault = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('mouseup', handleMouseUpOrLeave);

    return () => {
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
    };
  }, [isDragging]);

  if (forecast.length === 0) return null;

  // Çizgisel minimalist hava durumu ikonu oluşturucu
  const renderMinimalIcon = (state) => {
    switch (state) {
      case 'Clear':
        return (
          <g>
            <circle cx="0" cy="0" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 0 -7 L 0 -9 M 0 7 L 0 9 M -7 0 L -9 0 M 7 0 L 9 0 M -4.8 -4.8 L -6 -6 M 4.8 4.8 L 6 6 M -4.8 4.8 L -6 6 M 4.8 -4.8 L 6 -6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        );
      case 'Clouds':
        return (
          <path d="M -6 1.5 A 2.5 2.5 0 0 1 -3.5 -2.5 A 3.8 3.8 0 0 1 3.5 -3 A 3 3 0 0 1 6 1.5 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        );
      case 'Rain':
        return (
          <g>
            <path d="M -6 1 A 2.5 2.5 0 0 1 -3.5 -3 A 3.8 3.8 0 0 1 3.5 -3.5 A 3 3 0 0 1 6 1 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -2.5 3.5 L -3.5 6 M 0.5 3.5 L -0.5 6 M 3.5 3.5 L 2.5 6" stroke="#0dcaf0" strokeWidth="1.0" strokeLinecap="round" />
          </g>
        );
      case 'Storm':
        return (
          <g>
            <path d="M -6 1 A 2.5 2.5 0 0 1 -3.5 -3 A 3.8 3.8 0 0 1 3.5 -3.5 A 3 3 0 0 1 6 1 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -0.5 2.5 L 1 4.5 L -1.5 6 L 0.5 8" fill="none" stroke="#ffc107" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      default:
        return <circle cx="0" cy="0" r="2.5" fill="currentColor" />;
    }
  };

  const activePct = activePoint ? (activePoint.x / 800) * 100 : 0;

  return (
    <div
      style={{
        marginTop: '10px',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: '100%'
      }}
    >

      {/* SVG Grafik Alanı */}
      <div style={{ width: '100%', overflowX: 'hidden', position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartData.width} ${chartData.height}`}
          width="100%"
          height="230px"
          style={{ overflow: 'visible', cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <defs>
            {/* Alt alan gradyanı */}
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>

            {/* Dinamik Yıldız Kayması Gradyanı (Aktif noktanın konumuna göre dinamik ışık izi oluşturur) */}
            <linearGradient id="shootingStarLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset={`${Math.max(0, activePct - 15)}%`} stopColor="rgba(255, 255, 255, 0.28)" />
              <stop offset={`${activePct}%`} stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset={`${Math.min(100, activePct + 15)}%`} stopColor="rgba(255, 255, 255, 0.28)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
            </linearGradient>

            {/* İnce çizgi parlama efekti */}
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Yoğun Parlayan Top Efekti İçin Radyal Gradyan */}
            <radialGradient id="activeGlowBall" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="55%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="85%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>

            {/* Sağ ve sol sınırların akışkan bir geçişle/silinerek bitmesi için maske */}
            <linearGradient id="maskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="3%" stopColor="#666666" />
              <stop offset="12%" stopColor="#ffffff" />
              <stop offset="88%" stopColor="#ffffff" />
              <stop offset="97%" stopColor="#666666" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <mask id="fadeEdgesMask">
              <rect x="0" y="0" width="800" height="200" fill="url(#maskGradient)" />
            </mask>
          </defs>

          {/* Dikey Grid Çizgileri */}
          {chartData.points.map((pt, idx) => {
            if (idx % 2 !== 0) return null;
            return (
              <line
                key={`grid-${idx}`}
                x1={pt.x}
                y1={45}
                x2={pt.x}
                y2={chartData.height}
                stroke="rgba(255, 255, 255, 0.02)"
                strokeDasharray="4"
                strokeWidth="1"
              />
            );
          })}

          {/* Aktif noktanın dikey kılavuz çizgisi */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={25}
              x2={activePoint.x}
              y2={chartData.height}
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.0"
              style={{ transition: 'x1 0.1s ease, x2 0.1s ease' }}
            />
          )}

          {/* Maskelenmiş Akışkan Çizgiler ve Alan Dolgusu (Sol/Sağ sınır geçişlerinin yumuşak sonlanması için) */}
          <g mask="url(#fadeEdgesMask)">
            {/* Degrade Alan Dolgusu */}
            <path d={chartData.areaD} fill="url(#chartAreaGradient)" />

            {/* Arka Plan Yumuşak Parlama Çizgisi (Yıldızın arkasındaki parıltı) */}
            <path
              d={chartData.pathD}
              fill="none"
              stroke="url(#shootingStarLine)"
              strokeWidth="4.5"
              opacity="0.35"
              filter="url(#glow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Akışkan, İnce ve Zarif Dalgalı Çizgi (Yıldız Kayması gradyanı uygulandı) */}
            <path
              d={chartData.pathD}
              fill="none"
              stroke="url(#shootingStarLine)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Aktif Noktanın Dışındaki Yoğun Parlayan Top Aurası (22px boyutunda) */}
          {activePoint && (
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="22"
              fill="url(#activeGlowBall)"
              style={{ transition: 'cx 0.1s ease, cy 0.1s ease' }}
            />
          )}

          {/* Aktif Nokta Yıldız/Işık Göstergesi (Minik Yuvarlak Çekirdek - 3.5px) */}
          {activePoint && (
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="3.5"
              fill="#ffffff"
              style={{ transition: 'cx 0.1s ease, cy 0.1s ease', filter: 'drop-shadow(0 0 4px #fff)' }}
            />
          )}

          {/* ÜST SIRA HİZALANMIŞ DERECELER VE YANINDAKİ MİNİMALİST İKONLAR */}
          {chartData.points.map((pt, idx) => {
            const isActive = idx === selectedHourIndex;
            // En soldaki ilk (idx === 0) veya en sağdaki son (idx === 23) sıcaklık her zaman sabit gösterilsin
            const isFirst = idx === 0;
            const isLast = idx === chartData.points.length - 1;
            if (!isFirst && !isLast && idx % 2 !== 0 && !isActive) return null;
            return (
              <g
                key={`temp-label-${idx}`}
                style={{ opacity: isActive ? 1 : 0.45, transition: 'all 0.1s ease' }}
              >
                {/* Sıcaklık Metni - Saat çizgisiyle tam ortalanmış dengeli yerleşim */}
                <text
                  x={pt.x + 1}
                  y={30} // Yüksekliği sabitlendi, hepsi aynı hizada
                  textAnchor="end"
                  fill="#ffffff"
                  fontSize="15"
                  fontWeight={isActive ? '600' : '400'}
                  style={{ pointerEvents: 'none', transition: 'all 0.1s ease', letterSpacing: '-0.5px' }}
                >
                  {Math.round(pt.temp)}°
                </text>

                {/* Minimalist Çizgisel İkon - Derecelere göre orantılı küçültüldü ve tam ortalandı */}
                <g
                  transform={`translate(${pt.x + 7}, 24) scale(0.68)`}
                  style={{ color: '#ffffff' }}
                >
                  {renderMinimalIcon(pt.weatherState)}
                </g>

              </g>
            );
          })}
          {/* Alt Satır: Sadece Saat Etiketleri (Tüm saatler 1 saat arayla, küçük ve silik/faint biçimde) */}
          {chartData.points.map((pt, idx) => {
            const isActive = idx === selectedHourIndex;

            return (
              <text
                key={`hour-${idx}`}
                x={pt.x}
                y={192} // SVG yüksekliğinin (200) hemen üstünde
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight={isActive ? '600' : '300'}
                opacity={isActive ? 1 : 0.22}
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'all 0.1s ease',
                  userSelect: 'none'
                }}
                onClick={() => {
                  dispatch(setSelectedHourIndex(idx));
                  dispatch(updateVisualState({ weatherState: pt.weatherState, timeStr: pt.time }));
                }}
              >
                {pt.time}
              </text>
            );
          })}
        </svg>
      </div>

    </div>
  );
};

export default HourlyForecastChart;
