import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../store/authSlice';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'restaurant') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('123456');
    dispatch(loginUser({ email: quickEmail, password: '123456' }));
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow rounded-3 p-4">
            <div className="text-center mb-4">
              <i className="bi bi-egg-fried text-brand-primary fs-1"></i>
              <h2 className="fw-bold mt-2">NeYesek?'e Giriş Yap</h2>
              <p className="text-muted">Lezzete ulaşmak için giriş yapın</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">E-posta Adresi</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Şifre (Herhangi bir şifre girebilirsiniz)</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-brand-primary btn-lg w-100 fw-bold shadow-sm"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Giriş Yapılıyor...
                  </>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted">Hesabınız yok mu? </span>
              <Link to="/register" className="text-brand-primary fw-semibold">Kayıt Olun</Link>
            </div>

            <hr className="my-4" />

            {/* Test kolaylığı için hızlı giriş bilgileri */}
            <div className="bg-light dark:bg-dark p-3 rounded border">
              <h6 className="fw-bold mb-2 text-center text-secondary">
                <i className="bi bi-lightning-charge-fill me-1"></i> Hızlı Test Girişleri
              </h6>
              <div className="d-grid gap-2">
                <button
                  onClick={() => handleQuickLogin('can@mail.com')}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-between px-3"
                  type="button"
                >
                  <span>Müşteri</span>
                  <strong>can@mail.com</strong>
                </button>
                <button
                  onClick={() => handleQuickLogin('gazi@kebap.com')}
                  className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-between px-3"
                  type="button"
                >
                  <span>İşletme (Gazi Kebap)</span>
                  <strong>gazi@kebap.com</strong>
                </button>
                <button
                  onClick={() => handleQuickLogin('admin@foodflow.com')}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-between px-3"
                  type="button"
                >
                  <span>Yönetici (Admin)</span>
                  <strong>admin@foodflow.com</strong>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
