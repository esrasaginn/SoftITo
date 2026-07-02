import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../store/ordersSlice';
import { fetchRestaurants } from '../../store/restaurantSlice';
import axios from 'axios';

export const OrderManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orders, status } = useSelector((state) => state.orders);
  const { list: restaurants } = useSelector((state) => state.restaurants);

  const [myRestaurant, setMyRestaurant] = useState(null);
  const [loadingRes, setLoadingRes] = useState(true);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRestaurants());

    // Müşteri isimlerini göstermek için kullanıcı detaylarını çek
    axios.get('http://localhost:5000/users')
      .then(res => {
        const userMap = {};
        res.data.forEach(u => {
          userMap[u.id] = u.name;
        });
        setCustomers(userMap);
      })
      .catch(err => console.error(err));
  }, [dispatch]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const myRes = restaurants.find(r => r.userId === user.id);
      setMyRestaurant(myRes);
      setLoadingRes(false);
    }
  }, [restaurants, user]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  if (loadingRes) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!myRestaurant || !myRestaurant.isActive) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          İşletmeniz onaylanmadığı için sipariş yönetimi erişime kapalıdır.
        </div>
      </div>
    );
  }

  // Bu restoranın siparişlerini filtrele ve en yeniye göre sırala
  const myOrders = orders
    .filter(o => o.restaurantId === myRestaurant.id)
    .sort((a, b) => b.id.localeCompare(a.id));

  const getStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'pending':
        return <span className="badge bg-warning text-dark"><i className="bi bi-clock-history me-1"></i>Beklemede</span>;
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

  const getCustomerName = (customerId) => {
    return customers[customerId] || `Müşteri (ID: ${customerId})`;
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
      {/* Başlık */}
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-brand-primary">Sipariş Yönetimi</h2>
        <p className="text-muted m-0">Restoranınıza gelen siparişleri anlık olarak yönetin.</p>
      </div>

      {/* Siparişlerin Listesi */}
      <div className="card border-0 shadow-sm p-4">
        {status === 'loading' && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        )}

        {status === 'succeeded' && myOrders.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-bicycle display-3 text-muted"></i>
            <h5 className="fw-bold text-secondary mt-3">Henüz sipariş almadınız.</h5>
            <p className="text-muted">Müşteriler sipariş verdiğinde bu ekranda görünecektir.</p>
          </div>
        )}

        {status === 'succeeded' && myOrders.length > 0 && (
          <div className="table-responsive">
            <table className="table align-middle table-striped table-hover">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Sipariş İçeriği & Özelleştirmeler</th>
                  <th className="text-end">Tutar</th>
                  <th className="text-center">Durum</th>
                  <th className="text-center" style={{ width: '220px' }}>Durum Güncelle</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id.slice(-6).toUpperCase()}</strong></td>
                    <td>{getCustomerName(order.customerId)}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="mb-2">
                          <div>
                            <strong>{item.quantity}x</strong> {item.name}
                          </div>

                          {/* İşletme yöneticisi için yemek bazlı özelleştirmeleri göster */}
                          {item.customizations && (
                            <div className="ps-3 text-muted" style={{ fontSize: '11px' }}>
                              {item.customizations.removedIngredients.length > 0 && (
                                <span className="text-danger d-block">
                                  <i className="bi bi-dash-circle me-1"></i>
                                  Çıkarılan: {item.customizations.removedIngredients.join(', ')}
                                </span>
                              )}
                              {item.customizations.note && (
                                <span className="text-secondary d-block italic">
                                  <i className="bi bi-chat-left-text me-1"></i>
                                  Ürün Notu: {item.customizations.note}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* İşletme yöneticisi için genel sipariş notunu göster */}
                      {order.note && (
                        <div className="mt-2 p-2 bg-warning-subtle dark:bg-dark border rounded text-dark dark:text-white" style={{ fontSize: '12px' }}>
                          <i className="bi bi-pencil-square me-1"></i>
                          <strong>Sipariş Notu:</strong> {order.note}
                        </div>
                      )}

                      {/* İşletme yöneticisi için teslimat adresini göster */}
                      {order.deliveryAddress && (
                        <div className="mt-2 p-2 bg-light dark:bg-dark border rounded" style={{ fontSize: '12px' }}>
                          <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                          <strong>Teslimat Adresi:</strong> {order.deliveryAddress}
                        </div>
                      )}
                    </td>
                    <td className="text-end fw-bold text-brand-primary">{order.totalPrice} TL</td>
                    <td className="text-center">{getStatusBadge(order.status)}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                              className="btn btn-sm btn-success fw-semibold"
                              type="button"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'rejected')}
                              className="btn btn-sm btn-danger fw-semibold"
                              type="button"
                            >
                              Reddet
                            </button>
                          </>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'on the way')}
                            className="btn btn-sm btn-info text-dark fw-semibold"
                            type="button"
                          >
                            Yola Çıkar
                          </button>
                        )}

                        {order.status === 'on the way' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="btn btn-sm btn-success fw-semibold"
                            type="button"
                          >
                            Teslim Et
                          </button>
                        )}

                        {['delivered', 'rejected'].includes(order.status) && (
                          <span className="text-muted small">İşlem Tamamlandı</span>
                        )}
                      </div>
                    </td>
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

export default OrderManagement;
