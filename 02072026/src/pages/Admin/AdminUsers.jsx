import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Veri Tablosu Durumları
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (artan) | 'desc' (azalan)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsersList = () => {
    setLoading(true);
    axios.get('http://localhost:5000/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  // Arama veya filtre değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/users/${userId}`, { role: newRole });
      fetchUsersList(); // yeniden yükle
    } catch (err) {
      console.error(err);
      alert('Kullanıcı rolü güncellenirken hata oluştu.');
    }
  };

  // 1. Arama ve role göre filtrele
  const filtered = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 2. Sırala
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortBy] || '';
    const valB = b[sortBy] || '';
    return sortOrder === 'asc' 
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // 3. Sayfala
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

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
        <h2 className="fw-bold m-0 text-brand-primary">Kullanıcı Yönetimi</h2>
        <p className="text-muted m-0">Sistemdeki üye hesaplarını, rollerini ve erişim izinlerini denetleyin.</p>
      </div>

      {/* Filtreleme Seçenekleri */}
      <div className="card border-0 shadow-sm p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="İsim veya e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-4 col-lg-3">
            <select
              className="form-select bg-light"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tüm Roller</option>
              <option value="customer">Müşteriler (Customer)</option>
              <option value="restaurant">İşletmeler (Restaurant)</option>
              <option value="admin">Yöneticiler (Admin)</option>
            </select>
          </div>

          <div className="col-md-2 col-lg-5 text-md-end text-muted small">
            Toplam {sorted.length} üye listeleniyor.
          </div>
        </div>
      </div>

      {/* Gelişmiş Kullanıcı Veri Tablosu (Data Table) */}
      <div className="card border-0 shadow-sm p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people display-3 text-muted"></i>
            <h5 className="fw-bold text-secondary mt-3">Kayıtlı kullanıcı bulunamadı.</h5>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle table-striped table-hover">
                <thead>
                  <tr style={{ cursor: 'pointer' }}>
                    <th onClick={() => handleSort('name')}>Kullanıcı Adı {getSortIcon('name')}</th>
                    <th onClick={() => handleSort('email')}>E-posta Adresi {getSortIcon('email')}</th>
                    <th onClick={() => handleSort('role')} className="text-center" style={{ width: '180px' }}>Rol {getSortIcon('role')}</th>
                    <th className="text-center" style={{ width: '220px' }}>Rol Yetkilendirme</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-person-circle fs-5 text-secondary"></i>
                          <span className="fw-bold">{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td className="text-center">
                        <span className={`badge px-2 py-1 text-capitalize ${
                          u.role === 'admin'
                            ? 'bg-danger'
                            : u.role === 'restaurant'
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="customer">Customer (Müşteri)</option>
                          <option value="restaurant">Restaurant (İşletme)</option>
                          <option value="admin">Admin (Yönetici)</option>
                        </select>
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

    </div>
  );
};

export default AdminUsers;
