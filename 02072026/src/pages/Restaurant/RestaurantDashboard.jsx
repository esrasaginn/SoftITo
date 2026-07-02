import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/ordersSlice';
import { fetchRestaurants } from '../../store/restaurantSlice';
import axios from 'axios';

export const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orders } = useSelector((state) => state.orders);
  const { list: restaurants } = useSelector((state) => state.restaurants);

  const [restaurant, setRestaurant] = useState(null);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const myRes = restaurants.find(r => r.userId === user.id);
      setRestaurant(myRes);
      setLoadingRes(false);
    }
  }, [restaurants, user]);

  if (loadingRes) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
          <h4>İşletme Hesabınız Bulunmamaktadır</h4>
          <p className="mb-0">Lütfen sistem yöneticinizle iletişime geçin.</p>
        </div>
      </div>
    );
  }

  if (!restaurant.isActive) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 rounded-3">
          <i className="bi bi-clock-history text-warning display-1 mb-4 animate-pulse"></i>
          <h3 className="fw-bold mb-3">Onay Bekleniyor</h3>
          <p className="text-muted mb-0">
            <strong>{restaurant.name}</strong> restoran başvurunuz sistem yöneticisi (Admin) tarafından incelenmektedir.
          </p>
          <p className="text-muted">Onaylandığında paneliniz aktif hale gelecektir.</p>
        </div>
      </div>
    );
  }

  // Bu restoranın siparişlerini filtrele
  const myOrders = orders.filter(o => o.restaurantId === restaurant.id);
  
  // İstatistikleri hesapla
  const totalOrdersCount = myOrders.length;
  const completedOrders = myOrders.filter(o => o.status === 'delivered');
  const activeOrdersCount = myOrders.filter(o => ['pending', 'preparing', 'on the way'].includes(o.status)).length;
  
  // Günlük/toplam geliri hesapla (iptal edilenler hariç)
  const totalRevenue = myOrders
    .filter(o => o.status !== 'rejected')
    .reduce((acc, order) => acc + order.totalPrice, 0);

  // Son 5 sipariş
  const recentOrders = [...myOrders]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }
    return dateStr;
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Alındı</span>;
      case 'preparing':
        return <span className="badge bg-success">Hazırlanıyor</span>;
      case 'on the way':
        return <span className="badge bg-info text-dark">Yolda</span>;
      case 'delivered':
        return <span className="badge bg-success">Teslim Edildi</span>;
      case 'rejected':
        return <span className="badge bg-danger">İptal</span>;
      default:
        return <span className="badge bg-secondary">{statusValue}</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* Başlık */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-brand-primary">İşletme Yönetim Paneli</h2>
          <p className="text-muted m-0">{restaurant.name} - {restaurant.cuisine}</p>
        </div>
        <span className="badge bg-success py-2 px-3 fw-semibold">
          <i className="bi bi-check-circle me-1"></i> Aktif İşletme
        </span>
      </div>

      {/* İstatistik Kartları */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-brand-primary text-white scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 opacity-75">Toplam Ciro</h6>
              <i className="bi bi-wallet2 fs-3"></i>
            </div>
            <h2 className="fw-bold mb-0">{totalRevenue} TL</h2>
            <small className="opacity-75">İptaller hariç net kazanç</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 text-muted">Aktif Siparişler</h6>
              <i className="bi bi-bicycle text-brand-secondary fs-3"></i>
            </div>
            <h2 className="fw-bold mb-0 text-brand-secondary">{activeOrdersCount} Sipariş</h2>
            <small className="text-muted">Hazırlanan ve yoldaki siparişler</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100 scale-hover">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-uppercase fw-bold m-0 text-muted">Toplam Sipariş</h6>
              <i className="bi bi-bag-check text-success fs-3"></i>
            </div>
            <h2 className="fw-bold mb-0 text-success">{totalOrdersCount} Sipariş</h2>
            <small className="text-muted">Tüm geçmiş siparişler dahil</small>
          </div>
        </div>
      </div>

      {/* Son Siparişler Tablosu */}
      <div className="card border-0 shadow-sm p-4 mb-5">
        <h4 className="fw-bold mb-3 border-bottom pb-2">Son Gelen Siparişler</h4>
        {recentOrders.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-clipboard-x text-muted fs-1 d-block mb-2"></i>
            <p className="text-muted mb-0">Henüz sipariş almadınız.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Tarih</th>
                  <th>Ürünler</th>
                  <th className="text-end">Tutar</th>
                  <th className="text-center">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id.slice(-6).toUpperCase()}</strong></td>
                    <td>{formatDate(order.date)}</td>
                    <td>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="small">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="text-end fw-bold">{order.totalPrice} TL</td>
                    <td className="text-center">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default RestaurantDashboard;
