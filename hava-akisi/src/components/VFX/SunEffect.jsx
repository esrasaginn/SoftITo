import React from 'react';
import '../../styles/vfx.css';

// Güneş ışığı parlaması ve dönme efektlerini barındıran hafif görsel efekt katmanı
const SunEffect = () => {
  return (
    <div className="vfx-layer" style={{ zIndex: 1 }}>
      <div className="sun-container">
        {/* Dönen ışınlar */}
        <div className="sun-ray"></div>
        {/* Güneşin sıcak parlak çekirdeği */}
        <div className="sun-core"></div>
        {/* Yatay mercek parlaması (lens flare) çizgisi */}
        <div className="sun-flare"></div>
      </div>
    </div>
  );
};

export default SunEffect;
