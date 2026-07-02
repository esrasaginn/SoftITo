import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Tema durumu
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('foodflow_dark') === 'true'
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('foodflow_dark', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('foodflow_dark', 'false');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate('/login');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar shadow-sm sticky-top px-3">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <i className="bi bi-egg-fried text-brand-secondary"></i>
          <span>NeYesek?</span>
        </Link>
        
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Role dayalı Navigasyon Linkleri */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && user.role === 'customer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">
                    <i className="bi bi-house-door me-1"></i> Restoranlar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/my-orders">
                    <i className="bi bi-receipt me-1"></i> Siparişlerim
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user.role === 'restaurant' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/restaurant/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Panel
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/restaurant/menu">
                    <i className="bi bi-card-list me-1"></i> Menü Yönetimi
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/restaurant/orders">
                    <i className="bi bi-list-check me-1"></i> Siparişler
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/dashboard">
                    <i className="bi bi-shield-lock me-1"></i> Panel
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/restaurants">
                    <i className="bi bi-shop me-1"></i> Restoran Onay
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/users">
                    <i className="bi bi-people me-1"></i> Kullanıcılar
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Sağ taraf öğeleri */}
          <div className="d-flex align-items-center gap-3">
            {/* Karanlık Mod Değiştirici */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-outline-light border-0 d-flex align-items-center justify-content-center p-2 rounded-circle"
              title="Koyu/Açık Tema"
              type="button"
            >
              {darkMode ? <i className="bi bi-sun-fill fs-5"></i> : <i className="bi bi-moon-stars-fill fs-5"></i>}
            </button>

            {/* Müşteri için Sepet Butonu */}
            {isAuthenticated && user.role === 'customer' && (
              <Link
                to="/cart"
                className="btn btn-brand-secondary d-flex align-items-center gap-2 fw-semibold shadow-sm text-white"
              >
                <i className="bi bi-cart3 fs-5"></i>
                <span>Sepetim</span>
                {totalCartCount > 0 && (
                  <span className="badge bg-danger rounded-pill px-2 py-1 fs-7">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Kullanıcı Profili ve Çıkış Yap Butonu */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{user.name}</span>
                  <span className="badge bg-light text-dark text-capitalize ms-1" style={{ fontSize: '10px' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/settings">
                      <i className="bi bi-gear"></i> Ayarlar
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      type="button"
                    >
                      <i className="bi bi-box-arrow-right"></i> Çıkış Yap
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light">Giriş Yap</Link>
                <Link to="/register" className="btn btn-light fw-semibold text-brand-primary">Kayıt Ol</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
