import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, updateRestaurantStatus, updateRestaurantDetails } from '../../store/restaurantSlice';
import Modal from '../../components/Modal';

export const AdminRestaurants = () => {
  const dispatch = useDispatch();
  const { list: restaurants, status } = useSelector((state) => state.restaurants);

  // Veri Tablosu Durumları
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (artan) | 'desc' (azalan)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Düzenleme Modalı Durumları
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCuisine, setEditCuisine] = useState('');
  const [customCuisine, setCustomCuisine] = useState('');
  const [editImage, setEditImage] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Arama veya filtreler değiştiğinde sayfalamayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, cuisineFilter, statusFilter, ratingFilter]);

  // Sıralama ve Filtreleme mantığı
  const toggleStatus = (id, currentStatus) => {
    dispatch(updateRestaurantStatus({ id, isActive: !currentStatus }));
  };

  const handleOpenEditModal = (res) => {
    const standardCuisines = [
      'Kebap & Türk Mutfağı',
      'Burger & Fast Food',
      'İtalyan & Pizza',
      'Tatlı & Kahve',
      'Uzak Doğu & Sushi'
    ];

    setSelectedRes(res);
    setEditName(res.name);
    setEditImage(res.image);

    if (standardCuisines.includes(res.cuisine)) {
      setEditCuisine(res.cuisine);
      setCustomCuisine('');
    } else {
      setEditCuisine('Diğer');
      setCustomCuisine(res.cuisine);
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRes(null);
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (!selectedRes || !editName || !editCuisine) return;

    const finalCuisine = editCuisine === 'Diğer' ? customCuisine : editCuisine;
    if (!finalCuisine) return;

    dispatch(updateRestaurantDetails({
      id: selectedRes.id,
      name: editName,
      cuisine: finalCuisine,
      image: editImage
    })).then(() => handleCloseModal());
  };

  // 1. Filtrele
  const filtered = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || r.cuisine === cuisineFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = r.isActive === true;
    } else if (statusFilter === 'pending') {
      matchesStatus = r.isActive === false;
    }

    let matchesRating = true;
    if (ratingFilter === '4') {
      matchesRating = r.rating >= 4.0;
    } else if (ratingFilter === '3') {
      matchesRating = r.rating >= 3.0;
    }

    return matchesSearch && matchesCuisine && matchesStatus && matchesRating;
  });

  // 2. Sırala
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Durum boolean sıralaması
    if (sortBy === 'isActive') {
      valA = a.isActive ? 1 : 0;
      valB = b.isActive ? 1 : 0;
    }

    if (typeof valA === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
  });

  // 3. Sayfala
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const standardCuisines = [
    'Kebap & Türk Mutfağı',
    'Burger & Fast Food',
    'İtalyan & Pizza',
    'Tatlı & Kahve',
    'Uzak Doğu & Sushi'
  ];

  // Veritabanındaki tüm benzersiz mutfakları ayıkla
  const existingCuisines = Array.from(new Set(
    restaurants.map(r => r.cuisine).filter(Boolean)
  ));

  // Standart ve özel mutfakları birleştir, kopyaları temizle
  const allCuisines = Array.from(new Set([
    ...standardCuisines,
    ...existingCuisines
  ]));

  const getSortIcon = (field) => {
    if (sortBy !== field) return <i className="bi bi-arrow-down-up text-muted ms-1 small"></i>;
    return sortOrder === 'asc' 
      ? <i className="bi bi-sort-up text-brand-primary ms-1"></i>
      : <i className="bi bi-sort-down text-brand-primary ms-1"></i>;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container py-4">
      {/* Başlık */}
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-brand-primary">Restoran Yönetimi</h2>
        <p className="text-muted m-0">Sistemdeki restoran başvurularını ve detaylarını yönetin.</p>
      </div>

      {/* Arama ve Filtreleme Seçenekleri */}
      <div className="card border-0 shadow-sm p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-3">
            <label className="form-label small fw-bold text-secondary">Arama</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Restoran adı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <label className="form-label small fw-bold text-secondary">Mutfak Türü</label>
            <select
              className="form-select bg-light"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
            >
              <option value="all">Tüm Mutfaklar</option>
              {allCuisines.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label small fw-bold text-secondary">Durum</label>
            <select
              className="form-select bg-light"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="pending">Onay Bekliyor</option>
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label small fw-bold text-secondary">Değerlendirme</label>
            <select
              className="form-select bg-light"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">Tüm Puanlar</option>
              <option value="4">4.0 ve Üzeri ★</option>
              <option value="3">3.0 ve Üzeri ★</option>
            </select>
          </div>

          <div className="col-12 text-md-end text-muted small mt-2">
            Toplam {sorted.length} sonuç listeleniyor.
          </div>
        </div>
      </div>

      {/* Gelişmiş Veri Tablosu (Data Table) */}
      <div className="card border-0 shadow-sm p-4">
        {status === 'loading' && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        )}

        {status === 'succeeded' && currentItems.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-shop display-3 text-muted"></i>
            <h5 className="fw-bold text-secondary mt-3">Kayıtlı restoran bulunamadı.</h5>
          </div>
        )}

        {status === 'succeeded' && currentItems.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="table align-middle table-striped table-hover">
                <thead>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('name')}>Restoran Adı {getSortIcon('name')}</th>
                    <th onClick={() => handleSort('cuisine')}>Mutfak Türü {getSortIcon('cuisine')}</th>
                    <th onClick={() => handleSort('rating')} className="text-center">Değerlendirme {getSortIcon('rating')}</th>
                    <th onClick={() => handleSort('isActive')} className="text-center">Durum {getSortIcon('isActive')}</th>
                    <th className="text-center" style={{ width: '200px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={res.image}
                            alt={res.name}
                            className="rounded-3 object-fit-cover"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          />
                          <span className="fw-bold">{res.name}</span>
                        </div>
                      </td>
                      <td>{res.cuisine}</td>
                      <td className="text-center">
                        <span className="badge bg-light border text-dark">
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {res.rating}
                        </span>
                      </td>
                      <td className="text-center">
                        {res.isActive ? (
                          <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Aktif</span>
                        ) : (
                          <span className="badge bg-warning text-dark"><i className="bi bi-hourglass-split me-1"></i>Onay Bekliyor</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => toggleStatus(res.id, res.isActive)}
                            className={`btn btn-sm ${res.isActive ? 'btn-outline-warning' : 'btn-success'} fw-semibold`}
                            type="button"
                          >
                            {res.isActive ? 'Pasife Al' : 'Onayla'}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(res)}
                            className="btn btn-sm btn-outline-primary"
                            title="Düzenle"
                            type="button"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sayfalama Kontrolleri */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination shadow-sm">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link text-brand-primary" onClick={() => setCurrentPage(1)} type="button">İlk</button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link text-brand-primary" onClick={() => setCurrentPage(currentPage - 1)} type="button">Geri</button>
                  </li>
                  {[...Array(totalPages)].map((_, idx) => (
                    <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                      <button
                        className={`page-link ${currentPage === idx + 1 ? 'bg-brand-primary border-brand-primary text-white' : 'text-brand-primary'}`}
                        onClick={() => setCurrentPage(idx + 1)}
                        type="button"
                      >
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link text-brand-primary" onClick={() => setCurrentPage(currentPage + 1)} type="button">İleri</button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link text-brand-primary" onClick={() => setCurrentPage(totalPages)} type="button">Son</button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Bilgileri Düzenleme Modalı */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Restoran Bilgilerini Düzenle"
      >
        <form onSubmit={handleSaveDetails}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Restoran Adı</label>
            <input
              type="text"
              className="form-control"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Mutfak Türü</label>
            <select
              className="form-select"
              value={editCuisine}
              onChange={(e) => setEditCuisine(e.target.value)}
              required
            >
              <option value="">Seçiniz...</option>
              {allCuisines.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
              <option value="Diğer">Diğer (Yeni Ekle)</option>
            </select>
            {editCuisine === 'Diğer' && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Yeni mutfak türünü giriniz..."
                value={customCuisine}
                onChange={(e) => setCustomCuisine(e.target.value)}
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Görsel URL'i</label>
            <input
              type="url"
              className="form-control"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
            />
          </div>
          
          <div className="d-flex gap-2 justify-content-end">
            <button onClick={handleCloseModal} className="btn btn-secondary" type="button">İptal</button>
            <button type="submit" className="btn btn-brand-primary fw-semibold">Kaydet</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default AdminRestaurants;
