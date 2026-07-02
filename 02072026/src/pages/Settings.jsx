import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { loginUser, updateUserInStore } from '../store/authSlice';

export const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Bildirim durumları
  const [notifications, setNotifications] = useState(
    localStorage.getItem('foodflow_notifications') !== 'false'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Adres yönetim durumları (Yalnızca Müşteri için)
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  // Redux store'daki adresler değiştikçe yerel durumu senkronize et
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // Sahte veritabanındaki kullanıcı detaylarını güncelle
      const response = await axios.patch(`http://localhost:5000/users/${user.id}`, {
        name,
        email
      });
      
      // Yerel depolamayı ve redux durumunu güncelle
      dispatch(updateUserInStore(response.data));

      // Bildirim tercihlerini yerel olarak kaydet
      localStorage.setItem('foodflow_notifications', notifications.toString());

      setSuccess(true);
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetail.trim()) return;

    const newAddr = {
      id: `a${Date.now()}`,
      title: newTitle.trim(),
      detail: newDetail.trim()
    };
    const updatedAddresses = [...addresses, newAddr];

    try {
      const response = await axios.patch(`http://localhost:5000/users/${user.id}`, {
        addresses: updatedAddresses
      });
      dispatch(updateUserInStore(response.data));
      setNewTitle('');
      setNewDetail('');
    } catch (error) {
      console.error('Adres eklenemedi:', error);
      alert('Adres kaydedilirken bir hata oluştu.');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    const updatedAddresses = addresses.filter(a => a.id !== addrId);
    try {
      const response = await axios.patch(`http://localhost:5000/users/${user.id}`, {
        addresses: updatedAddresses
      });
      dispatch(updateUserInStore(response.data));
    } catch (error) {
      console.error('Adres silinemedi:', error);
      alert('Adres silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-gear-fill text-brand-primary"></i> Ayarlar
          </h2>

          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4" role="alert">
              <i className="bi bi-check-circle-fill"></i>
              <div>Ayarlarınız başarıyla güncellendi!</div>
            </div>
          )}

          <div className="card shadow-sm border-0 rounded-3 p-4 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-person-fill me-1"></i> Profil Bilgileri
            </h5>
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Ad Soyad</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">E-posta Adresi</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Rol</label>
                <input
                  type="text"
                  className="form-control text-capitalize"
                  value={user?.role || ''}
                  disabled
                />
                <div className="form-text text-muted">Kullanıcı rolleri sistem yöneticileri tarafından belirlenir.</div>
              </div>

              <h5 className="fw-bold mb-3 border-bottom pb-2 pt-2">
                <i className="bi bi-bell-fill me-1"></i> Bildirimler & Tercihler
              </h5>
              
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="notifSwitch"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <label className="form-check-label fw-semibold" htmlFor="notifSwitch">
                  Sipariş Durum Bildirimlerini Al
                </label>
                <div className="form-text text-muted">Siparişiniz onaylandığında veya yola çıktığında anlık bildirim alırsınız.</div>
              </div>

              <button
                type="submit"
                className="btn btn-brand-primary w-100 fw-bold py-2 shadow-sm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Kaydediliyor...
                  </>
                ) : (
                  'Ayarları Kaydet'
                )}
              </button>
            </form>
          </div>

          {/* Adres Yönetimi (Yalnızca Müşteri Rolüne Sahip Üyeler İçin) */}
          {user?.role === 'customer' && (
            <div className="card shadow-sm border-0 rounded-3 p-4 mb-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">
                <i className="bi bi-geo-alt-fill me-1 text-brand-primary"></i> Kayıtlı Adreslerim
              </h5>
              
              {addresses.length === 0 ? (
                <p className="text-muted small mb-4">Henüz kayıtlı bir adresiniz bulunmuyor. Aşağıdaki formdan yeni bir adres ekleyebilirsiniz.</p>
              ) : (
                <div className="d-flex flex-column gap-2 mb-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="d-flex justify-content-between align-items-start p-3 bg-light dark:bg-dark border rounded">
                      <div>
                        <strong className="text-dark dark:text-white d-block">{addr.title}</strong>
                        <span className="text-muted small">{addr.detail}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                        type="button"
                        title="Sil"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddAddress} className="border-top pt-3">
                <h6 className="fw-bold text-secondary mb-3">Yeni Adres Ekle</h6>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Adres Başlığı</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Örn: Evim, İş Yerim"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Adres Detayı</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    placeholder="Örn: Kadıköy Mah. Atatürk Cad. No:12 D:4 Kadıköy/İstanbul"
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-brand-primary btn-sm fw-bold">
                  <i className="bi bi-plus-lg me-1"></i> Adresi Kaydet
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
