import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-custom pt-5 pb-4">
      <div className="container">
        {/* Ana Altbilgi İçeriği */}
        <div className="row g-4 mb-5 text-start">
          {/* 1. Kolon: Marka Logosu & Slogan */}
          <div className="col-lg-4 col-md-6">
            <h3 className="text-white text-uppercase tracking-widest fw-bold mb-3 fs-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              ESTRUCTURA
            </h3>
            <p className="text-secondary fs-7 mb-0" style={{ lineHeight: '1.7', maxWidth: '300px' }}>
              Yapısal rasyonalizm ve modern biçimlerin estetik bütünleşmesi. Disiplinlerarası mimarlık ve ürün tasarımı stüdyosu.
            </p>
          </div>

          {/* 2. Kolon: Hızlı Gezinti Bağlantıları */}
          <div className="col-lg-2 col-md-6">
            <h4 className="text-white font-monospace text-uppercase fs-8 tracking-widest mb-3">[ KEŞFET ]</h4>
            <ul className="list-unstyled p-0 m-0 fs-7" style={{ lineHeight: '2.0' }}>
              <li>
                <Link to="/" className="text-decoration-none text-secondary hover-white">Anasayfa</Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none text-secondary hover-white">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/projects" className="text-decoration-none text-secondary hover-white">Projelerimiz</Link>
              </li>
              <li>
                <Link to="/quote" className="text-decoration-none text-secondary hover-white">Teklif Alın</Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none text-secondary hover-white">İletişim</Link>
              </li>
            </ul>
          </div>

          {/* 3. Kolon: İletişim Bilgileri */}
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white font-monospace text-uppercase fs-8 tracking-widest mb-3">[ İLETİŞİM ]</h4>
            <ul className="list-unstyled p-0 m-0 fs-7 text-secondary" style={{ lineHeight: '1.8' }}>
              <li className="mb-2">
                <strong className="text-white d-block mb-1">İstanbul Ofis:</strong>
                Büyükdere Cd. No:120, Levent, Şişli / İstanbul
              </li>
              <li className="mb-2">
                <strong className="text-white d-block mb-1">Telefon:</strong>
                <a href="tel:+902125553456" className="text-decoration-none text-secondary hover-white">+90 (212) 555 34 56</a>
              </li>
              <li>
                <strong className="text-white d-block mb-1">E-Posta:</strong>
                <a href="mailto:contact@estructura.com" className="text-decoration-none text-secondary hover-white">contact@estructura.com</a>
              </li>
            </ul>
          </div>

          {/* 4. Kolon: Sosyal Ağ Bağlantıları */}
          <div className="col-lg-3 col-md-6">
            <h4 className="text-white font-monospace text-uppercase fs-8 tracking-widest mb-3">[ TAKİP ET ]</h4>
            <ul className="list-unstyled p-0 m-0 fs-7" style={{ lineHeight: '2.0' }}>
              <li>
                <a 
                  href="https://www.linkedin.com/in/esra-sa%C4%9Fin-79a495195" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none text-secondary hover-white"
                >
                  <i className="bi bi-linkedin me-2"></i> LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://www.behance.net/esrasagin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-decoration-none text-secondary hover-white"
                >
                  <i className="bi bi-behance me-2"></i> Behance
                </a>
              </li>
              <li>
                <a 
                  href="mailto:esrasaginn@gmail.com"
                  className="text-decoration-none text-secondary hover-white"
                >
                  <i className="bi bi-envelope-fill me-2"></i> E-Posta Gönder
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Altbilgi Alt Satırı */}
        <div className="row pt-4 border-top border-secondary border-opacity-25 align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="text-secondary fs-8 text-uppercase tracking-wider">
              &copy; {currentYear} ESTRUCTURA | Esra Sağın. Tüm Hakları Saklıdır.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-secondary fs-8 font-monospace text-uppercase select-none">
              [ SCALE 1:1 / SCALE 1:100 ]
            </span>
          </div>
        </div>
      </div>
      
      {/* Altbilgi içindeki özel hover stilleri */}
      <style>{`
        .hover-white {
          transition: color 0.15s ease;
        }
        .hover-white:hover {
          color: #FFFFFF !important;
        }
        footer.footer-custom .text-secondary {
          color: #999999 !important;
        }
      `}</style>
    </footer>
  );
}
