import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/ordersSlice';
import { fetchRestaurants } from '../../store/restaurantSlice';

export const MyOrders = () => {
  const dispatch = useDispatch();
  const { list: orders, status } = useSelector((state) => state.orders);
  const { list: restaurants } = useSelector((state) => state.restaurants);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Giriş yapmış kullanıcının siparişlerini filtrele ve en yeniye göre sırala
  const myOrders = orders
    .filter((order) => order.customerId === user.id)
    .sort((a, b) => b.id.localeCompare(a.id));

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Bilinmeyen Restoran';
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'pending':
        return <span className="badge bg-warning text-dark"><i className="bi bi-clock-history me-1"></i>Sipariş Alındı</span>;
      case 'preparing':
        return <span className="badge bg-success"><i className="bi bi-fire me-1"></i>Hazırlanıyor</span>;
      case 'on the way':
        return <span className="badge bg-info text-dark"><i className="bi bi-bicycle me-1"></i>Yolda</span>;
      case 'delivered':
        return <span className="badge bg-success"><i className="bi bi-check2-circle me-1"></i>Teslim Edildi</span>;
      case 'rejected':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>İptal Edildi</span>;
      default:
        return <span className="badge bg-secondary">{statusValue}</span>;
    }
  };

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

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-receipt text-brand-primary me-2"></i> Siparişlerim
      </h2>

      {status === 'loading' && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Siparişler yükleniyor...</span>
          </div>
        </div>
      )}

      {status === 'succeeded' && myOrders.length === 0 && (
        <div className="text-center py-5 border rounded bg-white">
          <i className="bi bi-clipboard-x text-muted display-4"></i>
          <h5 className="fw-bold mt-3 text-secondary">Henüz siparişiniz bulunmuyor.</h5>
          <p className="text-muted">Ana sayfaya gidip dilediğiniz restorandan sipariş verebilirsiniz.</p>
        </div>
      )}

      {status === 'succeeded' && myOrders.length > 0 && (
        <div className="d-flex flex-column gap-4">
          {myOrders.map((order) => (
            <div key={order.id} className="card border-0 shadow-sm overflow-hidden scale-hover">
              <div className="card-header bg-light d-flex flex-wrap align-items-center justify-content-between border-0 p-3 gap-2">
                <div>
                  <span className="text-muted small">Tarih: </span>
                  <span className="fw-bold me-3">{formatDate(order.date)}</span>
                  <span className="text-muted small">Sipariş No: </span>
                  <span className="text-secondary fw-semibold">#{order.id.slice(-6).toUpperCase()}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">{getRestaurantName(order.restaurantId)}</h5>
                <ul className="list-unstyled mb-3">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="border-bottom pb-2 mb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="text-muted">
                          <span className="fw-bold text-brand-primary me-2">{item.quantity}x</span>
                          <strong className="text-dark dark:text-white">{item.name}</strong>
                        </div>
                        <span className="fw-semibold">{item.price * item.quantity} TL</span>
                      </div>
                      
                      {/* Sipariş edilen her ürünün özelleştirmelerini göster */}
                      {item.customizations && (
                        <div className="ps-4 small text-muted">
                          {item.customizations.removedIngredients.length > 0 && (
                            <span className="text-danger d-block">
                              <i className="bi bi-dash-circle me-1"></i>
                              Çıkarılan: {item.customizations.removedIngredients.join(', ')}
                            </span>
                          )}
                          {item.customizations.note && (
                            <span className="text-secondary d-block italic">
                              <i className="bi bi-chat-left-text me-1"></i>
                              Not: {item.customizations.note}
                            </span>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                
                {/* Genel sipariş notunu göster */}
                {order.note && (
                  <div className="mt-3 p-3 bg-light dark:bg-dark rounded border">
                    <span className="fw-bold text-secondary small d-block mb-1">
                      <i className="bi bi-pencil-square me-1"></i> Sipariş Notu
                    </span>
                    <span className="text-muted small">{order.note}</span>
                  </div>
                )}

                {/* Teslimat adresini göster */}
                {order.deliveryAddress && (
                  <div className="mt-2 p-3 bg-light dark:bg-dark rounded border">
                    <span className="fw-bold text-secondary small d-block mb-1">
                      <i className="bi bi-geo-alt-fill me-1"></i> Teslimat Adresi
                    </span>
                    <span className="text-muted small">{order.deliveryAddress}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                  <span className="fw-bold text-muted">Ödenen Toplam</span>
                  <span className="fw-bold text-brand-primary fs-4">{order.totalPrice} TL</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyOrders;
