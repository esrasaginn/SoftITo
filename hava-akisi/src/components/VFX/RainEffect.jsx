import React, { useMemo } from 'react';
import '../../styles/vfx.css';

// Performanslı yağmur damlası animasyon katmanı
const RainEffect = ({ density = 80 }) => {
  // Rastgele damla koordinatlarını, yüksekliklerini ve düşme sürelerini bir kez hesaplayalım
  const drops = useMemo(() => {
    const list = [];
    for (let i = 0; i < density; i++) {
      const left = Math.random() * 110 - 5; // Yağmur eğik yağdığı için ekranın % -5 ile 105 arasını kaplayalım
      const duration = 0.6 + Math.random() * 0.6; // 0.6s ile 1.2s arası düşüş hızı
      const delay = Math.random() * -2; // Sayfa açılır açılmaz yağmurun başlamış görünmesi için negatif gecikme
      const opacity = 0.2 + Math.random() * 0.6;
      const height = 60 + Math.random() * 50; // 60px ile 110px arası damla uzunluğu
      list.push({ left, duration, delay, opacity, height });
    }
    return list;
  }, [density]);

  return (
    <div className="vfx-layer" style={{ zIndex: 1.5 }}>
      {drops.map((drop, index) => (
        <div
          key={index}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            opacity: drop.opacity,
            height: `${drop.height}px`,
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;
