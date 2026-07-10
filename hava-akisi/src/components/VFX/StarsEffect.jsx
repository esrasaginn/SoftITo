import React, { useMemo } from 'react';
import '../../styles/vfx.css';

const StarsEffect = () => {
  // Rastgele yıldızların koordinatlarını ve parlama gecikmelerini hesaplayalım
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 70; i++) {
      const top = Math.random() * 80; // Gökyüzünün üst %80'inde görünsünler
      const left = Math.random() * 100;
      const size = 1 + Math.random() * 2; // 1px ile 3px arası büyüklük
      const delay = Math.random() * -5;
      const duration = 2 + Math.random() * 3; // 2s ile 5s arası parlama süresi
      list.push({ top, left, size, delay, duration });
    }
    return list;
  }, []);

  return (
    <div className="vfx-layer" style={{ zIndex: 1 }}>
      {/* Yıldızlar */}
      {stars.map((star, idx) => (
        <div
          key={idx}
          className="star-element"
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            animation: `twinkle ${star.duration}s linear infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: '0 0 4px #ffffff'
          }}
        />
      ))}

      {/* Hilal Ay */}
      <div 
        className="moon-element"
        style={{
          position: 'absolute',
          top: '12%',
          right: '15%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          boxShadow: '14px 14px 0 0 #f6f6f6',
          filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))',
          animation: 'moon-float 6s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default StarsEffect;
