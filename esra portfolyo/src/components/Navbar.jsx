import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('color-scheme') || 'system';
  });
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('color-scheme', theme);
  }, [theme]);

  // İşletim sisteminin tema değişikliklerini dinle
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      document.documentElement.removeAttribute('data-theme');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    let currentResolved = theme;
    if (theme === 'system') {
      currentResolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(currentResolved === 'dark' ? 'light' : 'dark');
  };

  const isDark = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  };

  const getNavLinkClass = (path) => {
    return `nav-link ${location.pathname === path ? 'active' : ''}`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom py-3 sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          ESTRUCTURA <span className="fs-6 fw-light text-secondary d-none d-sm-inline">| Esra Sağın</span>
        </Link>
        
        <div className="d-flex align-items-center order-lg-last ms-2">
          {/* Tema Değiştirme Butonu */}
          <button 
            onClick={toggleTheme}
            className="btn btn-link nav-link p-2 text-decoration-none border-0" 
            aria-label="Toggle Theme"
            style={{ cursor: 'pointer' }}
          >
            {isDark() ? (
              <i className="bi bi-sun-fill fs-5" style={{ color: 'var(--color-terracotta)' }}></i>
            ) : (
              <i className="bi bi-moon-stars-fill fs-5" style={{ color: 'var(--color-safir)' }}></i>
            )}
          </button>

          <button 
            className="navbar-toggler border-0 ms-2" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-3" style={{ color: 'var(--text-primary)' }}></i>
          </button>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0 mt-3 mt-lg-0">
            <li className="nav-item">
              <Link className={getNavLinkClass('/')} to="/">Anasayfa</Link>
            </li>
            <li className="nav-item">
              <Link className={getNavLinkClass('/about')} to="/about">Hakkımızda</Link>
            </li>
            <li className="nav-item">
              <Link className={getNavLinkClass('/projects')} to="/projects">Projelerimiz</Link>
            </li>
            <li className="nav-item">
              <Link className={getNavLinkClass('/quote')} to="/quote">Teklif Alın</Link>
            </li>
            <li className="nav-item">
              <Link className={getNavLinkClass('/contact')} to="/contact">İletişim</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
