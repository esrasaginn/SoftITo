import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuByRestaurant, addMenuItem, deleteMenuItem, updateMenuItem } from '../../store/menuSlice';
import { fetchRestaurants } from '../../store/restaurantSlice';
import Modal from '../../components/Modal';

export const MenuManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: menuItems, status } = useSelector((state) => state.menu);
  const { list: restaurants } = useSelector((state) => state.restaurants);

  const [myRestaurant, setMyRestaurant] = useState(null);
  const [loadingRes, setLoadingRes] = useState(true);

  // Modal Kontrolü
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form Durumu
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const myRes = restaurants.find(r => r.userId === user.id);
      setMyRestaurant(myRes);
      setLoadingRes(false);
      if (myRes) {
        dispatch(fetchMenuByRestaurant(myRes.id));
      }
    }
  }, [restaurants, user, dispatch]);

  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedItemId(null);
    setName('');
    setPrice('');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditMode(true);
    setSelectedItemId(item.id);
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !myRestaurant) return;

    const priceNum = parseFloat(price);

    if (editMode) {
      dispatch(updateMenuItem({
        id: selectedItemId,
        name,
        price: priceNum,
        description
      })).then(() => handleCloseModal());
    } else {
      const newItem = {
        id: `m${Date.now()}`,
        restaurantId: myRestaurant.id,
        name,
        price: priceNum,
        description
      };
      dispatch(addMenuItem(newItem)).then(() => handleCloseModal());
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Bu yemek çeşidini menüden kaldırmak istediğinize emin misiniz?')) {
      dispatch(deleteMenuItem(id));
    }
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
          İşletmeniz onaylanmadığı için menü yönetimi erişime kapalıdır.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Başlık */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-brand-primary">Menü Yönetimi</h2>
          <p className="text-muted m-0">Menünüzdeki lezzetleri ekleyin, güncelleyin veya kaldırın.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-brand-primary d-flex align-items-center gap-2 fw-semibold shadow-sm"
          type="button"
        >
          <i className="bi bi-plus-lg"></i>
          <span>Yeni Yemek Ekle</span>
        </button>
      </div>

      {/* Menü Öğeleri Listesi */}
      <div className="card border-0 shadow-sm p-4">
        {status === 'loading' && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        )}

        {status === 'succeeded' && menuItems.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-card-list display-3 text-muted"></i>
            <h5 className="fw-bold text-secondary mt-3">Menünüz henüz boş.</h5>
            <p className="text-muted">Yukarıdaki butona tıklayarak ilk yemeğinizi ekleyin.</p>
          </div>
        )}

        {status === 'succeeded' && menuItems.length > 0 && (
          <div className="table-responsive">
            <table className="table align-middle table-striped table-hover">
              <thead>
                <tr>
                  <th>Yemek Adı</th>
                  <th>Açıklama</th>
                  <th className="text-end">Fiyat</th>
                  <th className="text-center" style={{ width: '150px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td className="text-muted small">{item.description}</td>
                    <td className="text-end fw-bold text-brand-primary">{item.price} TL</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="btn btn-sm btn-outline-primary"
                          title="Düzenle"
                          type="button"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Sil"
                          type="button"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Yemek Ekleme / Düzenleme Modalı */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editMode ? 'Yemeği Düzenle' : 'Yeni Yemek Ekle'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Yemek Adı</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: Adana Dürüm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Fiyat (TL)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              placeholder="Örn: 180"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Açıklama / Malzemeler</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Örn: 150gr zırh kıyması, közlenmiş soğan ve yeşillik ile"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="d-flex gap-2 justify-content-end">
            <button
              onClick={handleCloseModal}
              className="btn btn-secondary"
              type="button"
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-brand-primary fw-semibold"
            >
              {editMode ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default MenuManagement;
