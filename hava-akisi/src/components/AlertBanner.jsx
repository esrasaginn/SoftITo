import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAlerts } from '../store/slices/uiSlice';

// Acil durum meteorolojik uyarıları gösteren üst kayan band bileşeni
const AlertBanner = () => {
  const dispatch = useDispatch();
  const { alerts, loading } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  // Sadece aktif olan uyarıları süzelim
  const activeAlerts = alerts.filter((alert) => alert.active);

  if (activeAlerts.length === 0) return null;

  return (
    <div 
      className="alert-banner-container"
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'rgba(220, 53, 69, 0.18)',
        borderBottom: '1px solid rgba(220, 53, 69, 0.3)',
        backdropFilter: 'blur(12px)',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}
    >
      {/* Sol Sabit Gösterge (Badge) */}
      <div 
        style={{
          background: 'rgba(220, 53, 69, 0.8)',
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          boxShadow: '8px 0 16px rgba(0,0,0,0.2)',
          textShadow: '0 0 4px rgba(255,255,255,0.5)',
          whiteSpace: 'nowrap'
        }}
      >
        <span 
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ff4d4d',
            boxShadow: '0 0 8px #ff4d4d',
            animation: 'alert-pulse 1.2s infinite alternate'
          }}
        />
        Meteorolojik Alarm
      </div>

      {/* Kayan Yazı Kutusu */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        <div 
          className="alert-ticker"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '50px',
            animation: 'alert-scroll 35s linear infinite',
            paddingLeft: '20px'
          }}
        >
          {activeAlerts.map((alert) => (
            <span 
              key={alert.id}
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: alert.severity === 'danger' ? '#ff9999' : '#ffeb99',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className={`bi ${alert.severity === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'}`} />
              <strong>[{alert.city}]</strong> {alert.message}
            </span>
          ))}
          {/* Sonsuz döngüyü kesintisiz hissettirmek için listeyi klonlayıp arkasına ekleyelim */}
          {activeAlerts.map((alert) => (
            <span 
              key={`dup-${alert.id}`}
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: alert.severity === 'danger' ? '#ff9999' : '#ffeb99',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className={`bi ${alert.severity === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-circle-fill'}`} />
              <strong>[{alert.city}]</strong> {alert.message}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes alert-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes alert-pulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        .alert-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AlertBanner;
