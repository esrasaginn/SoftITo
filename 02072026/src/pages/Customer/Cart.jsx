import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/ordersSlice';
import { updateUserInStore } from '../../store/authSlice';
import axios from 'axios';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [orderNote, setOrderNote] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Ödeme durumları
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Adres seçim durumları
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses && user.addresses.length > 0 ? user.addresses[0].id : 'new'
  );
  const [customAddressTitle, setCustomAddressTitle] = useState('');
  const [customAddressDetail, setCustomAddressDetail] = useState('');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setCardNumber(formatted);
  };

  const handleCardHolderChange = (e) => {
    let value = e.target.value.replace(/[^a-zA-ZıİğĞüÜşŞöÖçÇ ]/g, '');
    setCardHolder(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (value.length > 0) {
      formatted += value.slice(0, 2);
    }
    if (value.length > 2) {
      formatted += '/' + value.slice(2, 4);
    }
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0 || placingOrder) return;

    // Basit sahte kredi kartı doğrulaması
    if (cardNumber.length < 19 || cardHolder.trim().length < 3 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert("Lütfen tüm kart bilgilerini doğru bir şekilde doldurunuz.");
      return;
    }

    let finalAddress = '';
    if (selectedAddressId === 'new') {
      if (!customAddressTitle.trim() || !customAddressDetail.trim()) {
        alert("Lütfen teslimat adresinizi giriniz.");
        return;
      }
      finalAddress = `[${customAddressTitle.trim()}] ${customAddressDetail.trim()}`;

      if (saveAddressToProfile) {
        try {
          const newAddr = {
            id: `a${Date.now()}`,
            title: customAddressTitle.trim(),
            detail: customAddressDetail.trim()
          };
          const updatedAddresses = [...(user.addresses || []), newAddr];
          const response = await axios.patch(`http://localhost:5000/users/${user.id}`, {
            addresses: updatedAddresses
          });
          dispatch(updateUserInStore(response.data));
        } catch (error) {
          console.error("Adres profile kaydedilemedi:", error);
        }
      }
    } else {
      const found = user.addresses?.find(a => a.id === selectedAddressId);
      if (found) {
        finalAddress = `[${found.title}] ${found.detail}`;
      } else {
        alert("Lütfen geçerli bir teslimat adresi seçiniz.");
        return;
      }
    }

    setPlacingOrder(true);

    const orderData = {
      id: `o${Date.now()}`,
      customerId: user.id,
      restaurantId: cartItems[0].restaurantId,
      items: cartItems.map(item => ({
        menuItemId: item.id.split('-')[0], // orijinal yemek id'sini almak için özelleştirme benzersiz id'sini ayıkla
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations || null
      })),
      totalPrice: totalAmount,
      status: 'pending', // varsayılan sipariş durumu beklemede
      note: orderNote, // Genel sipariş notunu veritabanına kaydet
      deliveryAddress: finalAddress, // Sipariş teslimat adresi
      date: `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}` // GG.AA.YYYY
    };

    dispatch(placeOrder(orderData)).then((res) => {
      if (!res.error) {
        dispatch(clearCart());
        navigate('/my-orders');
      }
      setPlacingOrder(false);
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm p-5">
              <i className="bi bi-cart-x text-muted display-1 mb-4"></i>
              <h3 className="fw-bold text-secondary mb-3">Sepetiniz Boş</h3>
              <p className="text-muted mb-4">Henüz sepetinize bir lezzet eklemediniz.</p>
              <Link to="/" className="btn btn-brand-primary btn-lg fw-bold shadow-sm">
                Yemek Siparişi Ver
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-cart3 text-brand-primary me-2"></i> {showPayment ? 'Güvenli Ödeme' : 'Sepetim'}
      </h2>

      {!showPayment ? (
        <div className="row g-4 animate-fade-in">
          {/* Sepetteki ürün listesi */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4">
              <div className="table-responsive">
                <table className="table table-borderless align-middle">
                  <thead>
                    <tr className="border-bottom text-muted">
                      <th>Ürün</th>
                      <th className="text-center" style={{ width: '150px' }}>Adet</th>
                      <th className="text-end" style={{ width: '120px' }}>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-bottom">
                        <td>
                          <span className="fw-semibold d-block fs-5 text-dark dark:text-white">{item.name}</span>

                          {/* Sepet tablosunda ürün özelleştirmelerini göster */}
                          {item.customizations && (
                            <div className="small text-muted mb-2">
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

                          <span className="text-muted small">{item.price} TL / adet</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <button
                              onClick={() => dispatch(removeFromCart(item.id))}
                              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                              type="button"
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="fw-bold px-2 fs-5">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(addToCart(item))}
                              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                              type="button"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-brand-primary fs-5">
                          {item.price * item.quantity} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Genel Sipariş Notu Girişi */}
              <div className="mt-4 pt-3 border-top">
                <label className="form-label fw-bold text-secondary">
                  <i className="bi bi-pencil-square me-1"></i> Sipariş Notu Ekle
                </label>
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Kapıyı çalmayın bebek uyuyor, temassız teslimat vb..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                ></textarea>
              </div>

              {/* Teslimat Adresi Seçimi */}
              <div className="mt-2 pt-3 border-top">
                <label className="form-label fw-bold text-secondary mb-2">
                  <i className="bi bi-geo-alt-fill me-1 text-brand-primary"></i> Teslimat Adresi Seçin
                </label>

                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="mb-3">
                    <select
                      className="form-select bg-light mb-3"
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      {user.addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.title} - {addr.detail}
                        </option>
                      ))}
                      <option value="new">Yeni Adres Ekle...</option>
                    </select>
                  </div>
                ) : null}

                {(selectedAddressId === 'new' || !user?.addresses || user.addresses.length === 0) && (
                  <div className="bg-light dark:bg-dark p-3 border rounded mb-3 animate-fade-in">
                    <h6 className="fw-bold mb-3 text-secondary small">Yeni Adres Bilgileri</h6>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Adres Başlığı</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Örn: Evim, Ofisim"
                        value={customAddressTitle}
                        onChange={(e) => setCustomAddressTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Adres Detayı</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Örn: Kadıköy Mah. Atatürk Cad. No:12 D:4 Kadıköy/İstanbul"
                        value={customAddressDetail}
                        onChange={(e) => setCustomAddressDetail(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="form-check form-switch mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkoutSaveAddressSwitch"
                        checked={saveAddressToProfile}
                        onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      />
                      <label className="form-check-label small" htmlFor="checkoutSaveAddressSwitch">
                        Bu adresi profilime kaydet
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="btn btn-outline-danger btn-sm fw-semibold"
                  type="button"
                >
                  <i className="bi bi-trash3 me-1"></i> Sepeti Temizle
                </button>
                <Link to="/" className="btn btn-outline-brand-primary btn-sm fw-semibold">
                  <i className="bi bi-arrow-left me-1"></i> Ürün Ekle
                </Link>
              </div>

            </div>
          </div>

          {/* Sepet Toplamı ve Sipariş Tamamlama Formu */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 text-dark dark:text-white">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Sipariş Özeti</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Ara Toplam</span>
                <span className="fw-semibold">{totalAmount} TL</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Gönderim Ücreti</span>
                <span className="text-success fw-semibold">Ücretsiz</span>
              </div>

              <div className="d-flex justify-content-between align-items-center fw-bold border-top pt-2 mb-4">
                <span>Toplam Tutar</span>
                <span className="text-brand-primary fs-4">{totalAmount} TL</span>
              </div>

              <button
                onClick={() => {
                  if (selectedAddressId === 'new') {
                    if (!customAddressTitle.trim() || !customAddressDetail.trim()) {
                      alert("Lütfen teslimat adresinizi eksiksiz giriniz.");
                      return;
                    }
                  } else {
                    const exists = user.addresses?.some(a => a.id === selectedAddressId);
                    if (!exists) {
                      alert("Lütfen bir teslimat adresi seçin veya yeni bir adres tanımlayın.");
                      return;
                    }
                  }
                  setShowPayment(true);
                }}
                className="btn btn-brand-primary btn-lg w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                type="button"
              >
                <i className="bi bi-credit-card-2-front"></i>
                Ödeme Adımına Geç
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Güvenli Ödeme - Kart Dönüş Arayüzü Adımı */
        <div className="row g-4 animate-fade-in">
          {/* Kart Görseli ve Ödeme Formları */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4">

              {/* 3D İnteraktif Kart Önizleme Alanı */}
              <div className="credit-card-container">
                <div className={`credit-card-inner ${isFlipped ? 'flipped' : ''}`}>

                  {/* Kartın Ön Yüzü */}
                  <div className="credit-card-front">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="card-chip"></div>
                      <span className="card-logo text-brand-secondary">NeYesek? Pay</span>
                    </div>
                    <div className="card-number-display text-center">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="d-flex justify-content-between align-items-end">
                      <div className="card-holder-display">
                        <small className="opacity-50 d-block">Kart Sahibi</small>
                        <span className="fw-bold">{cardHolder || 'AD SOYAD'}</span>
                      </div>
                      <div className="card-expiry-display text-end">
                        <small className="opacity-50 d-block">S.K.T</small>
                        <span className="fw-bold">{cardExpiry || 'AA/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Kartın Arka Yüzü */}
                  <div className="credit-card-back">
                    <div className="card-strip"></div>
                    <div className="card-signature-cvv">
                      <div className="card-signature-bar"></div>
                      <div className="card-cvv-text">{cardCvv || 'CVV'}</div>
                    </div>
                    <div className="px-3 pt-3 text-end">
                      <span className="small text-white-50" style={{ fontSize: '0.65rem' }}>
                        Güvenliğiniz bizim için önemlidir. SSL 256-bit şifreleme etkindir.
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Güvenli Ödeme Formu */}
              <form onSubmit={handleCheckout} className="row g-3">
                <h5 className="fw-bold mb-3 mt-1 pb-2 border-bottom text-dark dark:text-white">Kart Bilgileri</h5>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">KART NUMARASI</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-credit-card"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-1"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">KART ÜZERİNDEKİ İSİM</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ad Soyad"
                    value={cardHolder}
                    onChange={handleCardHolderChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">SON KULLANMA TARİHİ</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="AA/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">GÜVENLİK KODU (CVV)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    value={cardCvv}
                    onChange={handleCvvChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    maxLength="3"
                    required
                  />
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center mt-4">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="btn btn-outline-secondary fw-semibold"
                    type="button"
                  >
                    <i className="bi bi-arrow-left me-1"></i> Sepete Geri Dön
                  </button>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="btn btn-brand-primary px-4 fw-bold"
                  >
                    {placingOrder ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Ödeniyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-lock-fill me-2"></i>
                        Ödemeyi Tamamla ({totalAmount} TL)
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Güvenli Ödeme Özeti */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 text-dark dark:text-white">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Ödeme Özeti</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Ara Toplam</span>
                <span className="fw-semibold">{totalAmount} TL</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Gönderim Ücreti</span>
                <span className="text-success fw-semibold">Ücretsiz</span>
              </div>

              <div className="d-flex justify-content-between align-items-center fw-bold border-top pt-2 mb-4">
                <span>Ödenecek Tutar</span>
                <span className="text-brand-primary fs-4">{totalAmount} TL</span>
              </div>

              <div className="p-3 bg-light dark:bg-dark border rounded mb-2">
                <div className="d-flex gap-2 align-items-center text-success mb-2">
                  <i className="bi bi-shield-fill-check fs-5"></i>
                  <strong className="small">256-Bit SSL Koruma</strong>
                </div>
                <p className="m-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  Ödeme bilgileriniz şifrelenir ve doğrudan anlaşmalı banka altyapısına iletir. Sunucularımızda kart verisi saklanmaz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
