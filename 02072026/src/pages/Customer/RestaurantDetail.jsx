import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuByRestaurant, clearMenu } from '../../store/menuSlice';
import { addToCart } from '../../store/cartSlice';
import Modal from '../../components/Modal';
import axios from 'axios';

const getIngredientsForItem = (itemName) => {
  const name = itemName.toLowerCase();
  if (name.includes('pizza')) {
    return ["Mozzarella", "Mantar", "Mısır", "Zeytin", "Biber", "Sosis", "Domates Sosu"];
  }
  if (name.includes('kebap') || name.includes('dürüm')) {
    return ["Soğan", "Domates", "Maydanoz", "Sumak", "Köz Biber"];
  }
  if (name.includes('burger')) {
    return ["Marul", "Domates", "Turşu", "Cheddar", "Soğan", "Ketçap", "Mayonez"];
  }
  return ["Domates", "Soğan", "Turşu", "Sos"];
};

export const RestaurantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: menuItems, status } = useSelector((state) => state.menu);
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  
  const [restaurant, setRestaurant] = useState(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Özelleştirme Modalı Durumu
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [itemNote, setItemNote] = useState('');

  useEffect(() => {
    // Restoran detaylarını getir
    setLoadingRestaurant(true);
    axios.get(`http://localhost:5000/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
        setLoadingRestaurant(false);
      })
      .catch((err) => {
        console.error('Restoran yüklenemedi:', err);
        setLoadingRestaurant(false);
      });

    // Menü öğelerini getir
    dispatch(fetchMenuByRestaurant(id));

    return () => {
      dispatch(clearMenu());
    };
  }, [id, dispatch]);

  const handleOpenCustomizer = (item) => {
    setSelectedItem(item);
    setSelectedIngredients(getIngredientsForItem(item.name));
    setItemNote('');
    setCustomizerOpen(true);
  };

  const handleToggleIngredient = (ing) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    } else {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
  };

  const handleConfirmCustomization = () => {
    const allIngredients = getIngredientsForItem(selectedItem.name);
    const removedIngredients = allIngredients.filter(ing => !selectedIngredients.includes(ing));

    // Sepette ayırt edebilmek için yemek ve özelleştirmeleri birleştiren benzersiz ID oluştur
    const customId = `${selectedItem.id}-${removedIngredients.sort().join('-')}-${itemNote}`;

    dispatch(addToCart({
      id: customId,
      name: selectedItem.name,
      price: selectedItem.price,
      restaurantId: id,
      customizations: {
        removedIngredients,
        note: itemNote
      }
    }));

    setToastMessage(`${selectedItem.name} sepete eklendi!`);
    setTimeout(() => setToastMessage(''), 2000);
    setCustomizerOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loadingRestaurant) {
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
        <div className="alert alert-danger">Restoran bulunamadı.</div>
        <Link to="/" className="btn btn-brand-primary">Geri Dön</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Uyarı Balonu (Toast) */}
      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 p-3 bg-dark text-white rounded-3 shadow" 
          style={{ zIndex: 1080, transition: 'all 0.3s' }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill text-success"></i>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Restoran Başlığı */}
      <div className="card border-0 overflow-hidden shadow-sm mb-4">
        <div style={{ height: '300px', position: 'relative' }}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-100 h-100 object-fit-cover"
            style={{ objectFit: 'cover', filter: 'brightness(0.65)' }}
          />
          <div className="position-absolute bottom-0 start-0 p-4 text-white">
            <h1 className="fw-bold mb-1">{restaurant.name}</h1>
            <p className="lead mb-0 d-flex align-items-center gap-3">
              <span><i className="bi bi-egg-fried text-warning me-1"></i>{restaurant.cuisine}</span>
              <span><i className="bi bi-star-fill text-warning me-1"></i>{restaurant.rating} / 5.0</span>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Menü Öğeleri Listesi */}
        <div className="col-lg-8">
          <h3 className="fw-bold mb-4">Menü</h3>
          
          {status === 'loading' && (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Menü yükleniyor...</span>
              </div>
            </div>
          )}

          {status === 'succeeded' && menuItems.length === 0 && (
            <div className="alert alert-warning">Bu restoranın menüsü henüz eklenmemiş.</div>
          )}

          {status === 'succeeded' && menuItems.length > 0 && (
            <div className="d-flex flex-column gap-3 mb-4">
              {menuItems.map((item) => (
                <div key={item.id} className="card border-0 shadow-sm p-3 scale-hover">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h5 className="fw-bold mb-1">{item.name}</h5>
                      <p className="text-muted small mb-0">{item.description}</p>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold text-brand-primary fs-5 d-block mb-2">{item.price} TL</span>
                      <button
                        onClick={() => handleOpenCustomizer(item)}
                        className="btn btn-brand-primary btn-sm px-3 fw-semibold shadow-sm"
                        type="button"
                      >
                        <i className="bi bi-plus-lg me-1"></i> Ekle / Özelleştir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Yapışkan Sepet Yan Paneli */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '85px' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-cart3 me-1"></i> Sepet Özeti
            </h5>
            {totalCartCount === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-cart-x text-muted fs-1 d-block mb-2"></i>
                <p className="text-muted mb-0">Sepetiniz boş.</p>
              </div>
            ) : (
              <div>
                <ul className="list-unstyled mb-3 d-flex flex-column gap-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="border-bottom pb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <span className="fw-bold text-brand-primary me-2">{item.quantity}x</span>
                          <strong className="text-dark dark:text-white">{item.name}</strong>
                        </div>
                        <span className="text-muted fw-semibold">{item.price * item.quantity} TL</span>
                      </div>
                      
                      {/* Mini sepette özelleştirmeleri göster */}
                      {item.customizations && (
                        <div className="ps-4 small text-muted">
                          {item.customizations.removedIngredients.length > 0 && (
                            <div className="text-danger">
                              <i className="bi bi-dash-circle me-1"></i>
                              {item.customizations.removedIngredients.join(', ')} istemiyorum
                            </div>
                          )}
                          {item.customizations.note && (
                            <div className="text-secondary italic">
                              <i className="bi bi-chat-left-text me-1"></i>
                              Not: {item.customizations.note}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between align-items-center fw-bold border-top pt-2 mb-3">
                  <span>Toplam</span>
                  <span className="text-brand-primary fs-5">{totalAmount} TL</span>
                </div>
                <Link to="/cart" className="btn btn-brand-primary w-100 fw-bold shadow-sm py-2">
                  Sepete Git <i className="bi bi-chevron-right ms-1"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Malzeme Özelleştirici İletişim Modalı */}
      {selectedItem && (
        <Modal
          isOpen={customizerOpen}
          onClose={() => setCustomizerOpen(false)}
          title={`Ürün Özelleştirme: ${selectedItem.name}`}
        >
          <div className="mb-3">
            <h6 className="fw-bold text-secondary">Malzemeler (Çıkarmak istediklerinizi kaldırın)</h6>
            <div className="row g-2 mt-1">
              {getIngredientsForItem(selectedItem.name).map((ing, idx) => {
                const isChecked = selectedIngredients.includes(ing);
                return (
                  <div key={idx} className="col-6">
                    <div 
                      onClick={() => handleToggleIngredient(ing)}
                      className={`border p-2 rounded text-center cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'border-brand-primary bg-brand-primary text-white fw-semibold' 
                          : 'border-secondary-subtle bg-light text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={`bi ${isChecked ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                      {ing}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">Ürün Özel Notu (Opsiyonel)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: Soğanı bol olsun, acısız olsun..."
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <div>
              <span className="text-muted small d-block">Birim Fiyat</span>
              <span className="fw-bold text-brand-primary fs-4">{selectedItem.price} TL</span>
            </div>
            <div className="d-flex gap-2">
              <button 
                onClick={() => setCustomizerOpen(false)} 
                className="btn btn-secondary"
                type="button"
              >
                Vazgeç
              </button>
              <button 
                onClick={handleConfirmCustomization} 
                className="btn btn-brand-primary fw-bold"
                type="button"
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default RestaurantDetail;
