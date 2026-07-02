import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../../store/restaurantSlice';
import { fetchOrders } from '../../store/ordersSlice';
import axios from 'axios';

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { list: restaurants, status: resStatus } = useSelector((state) => state.restaurants);
  const { list: orders, status: ordStatus } = useSelector((state) => state.orders);

  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchOrders());

    // Toplam kayıtlı kullanıcıları çek
    setLoadingUsers(true);
    axios.get('http://localhost:5000/users')
      .then(res => {
        setTotalUsers(res.data.length);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingUsers(false);
      });
  }, [dispatch]);

  // Platform istatistiklerini hesapla
  const totalRestaurantsCount = restaurants.length;
  const activeRestaurantsCount = restaurants.filter(r => r.isActive).length;
  
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'rejected')
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const pendingApprovalCount = restaurants.filter(r => !r.isActive).length;

  return (
    <div className="container py-4">
      {/* Başlık */}
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-brand-primary">Sistem Yöneticisi Paneli</h2>
        <p className="text-muted m-0">Platform genelindeki istatistikleri ve onay bekleyen talepleri izleyin.</p>
      </div>

      {pendingApprovalCount > 0 && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between p-3 mb-4 shadow-sm" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>
              <strong>Onay Bekleyen İşletmeler!</strong> Sistemde onaylanmayı bekleyen <strong>{pendingApprovalCount}</strong> yeni restoran başvurusu bulunuyor.
            </div>
          </div>
          <a href="/admin/restaurants" className="btn btn-sm btn-warning fw-bold">Başvuruları İncele</a>
        </div>
      )}

      {/* İstatistik Kartları Grid Yapısı */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 bg-brand-primary text-white scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 opacity-75">Toplam Hasılat</h6>
              <i className="bi bi-currency-try fs-3"></i>
            </div>
            <h3 className="fw-bold mb-0">{totalRevenue} TL</h3>
            <small className="opacity-75">Tüm siparişlerin toplam hacmi</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 text-muted">Kayıtlı Kullanıcılar</h6>
              <i className="bi bi-people text-primary fs-3"></i>
            </div>
            <h3 className="fw-bold mb-0 text-primary">
              {loadingUsers ? <span className="spinner-border spinner-border-sm" role="status"></span> : totalUsers} Üye
            </h3>
            <small className="text-muted">Müşteri, restoran ve adminler</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 text-muted">Aktif Restoranlar</h6>
              <i className="bi bi-shop text-success fs-3"></i>
            </div>
            <h3 className="fw-bold mb-0 text-success">{activeRestaurantsCount} / {totalRestaurantsCount}</h3>
            <small className="text-muted">Onaylanmış aktif işletmeler</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-4 h-100 scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 text-muted">Toplam Sipariş</h6>
              <i className="bi bi-bag-check text-brand-secondary fs-3"></i>
            </div>
            <h3 className="fw-bold mb-0 text-brand-secondary">{totalOrdersCount} Sipariş</h3>
            <small className="text-muted">Platformda verilen sipariş sayısı</small>
          </div>
        </div>
      </div>

      {/* Sistem Durumu ve Bilgi Kutuları */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Hızlı Erişim Linkleri</h5>
            <div className="d-grid gap-3">
              <a href="/admin/restaurants" className="btn btn-outline-brand-primary p-3 text-start d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold m-0">Restoran Onaylama & Yönetim</h6>
                  <small className="text-muted">Başvuruları listele, aktif/pasif durumlarını yönet.</small>
                </div>
                <i className="bi bi-chevron-right"></i>
              </a>
              <a href="/admin/users" className="btn btn-outline-brand-primary p-3 text-start d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold m-0">Kullanıcı Hesabı Denetimi</h6>
                  <small className="text-muted">Tüm üye listesini incele, rollerini denetle.</small>
                </div>
                <i className="bi bi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Platform Hakkında</h5>
            <p className="text-muted">
              NeYesek? platformunda yer alan tüm siparişler, işletmeler ve kullanıcı verileri JSON Server yerel veritabanında (`db.json`) tutulmaktadır.
            </p>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-muted">
              <li><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Veritabanı:</strong> JSON Server API (Port 5000)</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Kütüphane:</strong> React + Redux Toolkit</li>
              <li><i className="bi bi-check-circle-fill text-success me-2"></i><strong>Tema Arayüzü:</strong> Bootstrap 5 ve Icons</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
