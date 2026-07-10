import React from 'react';
import '../../styles/vfx.css';

// Fırtınalı havalarda ekranı flaşlatarak şimşek efekti sunan görsel katman
const LightningEffect = () => {
  return (
    <div className="vfx-layer" style={{ zIndex: 1.2 }}>
      {/* CSS'teki lightning-active animasyonu ile opaklığı rastgele oynayan beyaz katman */}
      <div className="lightning-flash-overlay lightning-active" />
    </div>
  );
};

export default LightningEffect;
