import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/authSlice';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' (müşteri) veya 'restaurant' (işletme)
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    dispatch(registerUser({ name, email, role })).then((res) => {
      if (!res.error) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow rounded-3 p-4">
            <div className="text-center mb-4">
              <i className="bi bi-egg-fried text-brand-primary fs-1"></i>
              <h2 className="fw-bold mt-2">NeYesek?'e Kayıt Ol</h2>
              <p className="text-muted">Hemen üye olun, lezzeti keşfedin</p>
            </div>

            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <div>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Ad Soyad / Restoran Yetkilisi</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Can Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <label className="form-label fw-semibold d-block">Hesap Türü</label>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="roleGroup"
                    id="roleCustomer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                  />
                  <label className="btn btn-outline-brand-primary py-2 fw-semibold" htmlFor="roleCustomer">
                    <i className="bi bi-person me-1"></i> Müşteri
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="roleGroup"
                    id="roleRestaurant"
                    checked={role === 'restaurant'}
                    onChange={() => setRole('restaurant')}
                  />
                  <label className="btn btn-outline-brand-primary py-2 fw-semibold" htmlFor="roleRestaurant">
                    <i className="bi bi-shop me-1"></i> İşletme / Restoran
                  </label>
                </div>
                {role === 'restaurant' && (
                  <div className="form-text text-warning mt-2 small">
                    <i className="bi bi-info-circle-fill me-1"></i> Restoran hesabı oluşturulduktan sonra Admin onayı gerekmektedir.
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-brand-primary btn-lg w-100 fw-bold shadow-sm"
                disabled={status === 'loading' || success}
              >
                {status === 'loading' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Kayıt Yapılıyor...
                  </>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-muted">Zaten hesabınız var mı? </span>
              <Link to="/login" className="text-brand-primary fw-semibold">Giriş Yapın</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
