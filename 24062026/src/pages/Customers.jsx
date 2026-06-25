import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addCustomer,
  editCustomer,
  deleteCustomer,
  selectCustomerForEdit,
  clearSelectedCustomer,
} from "../store/customerSlice";

export default function Customers() {
  const dispatch = useDispatch();
  const customerList = useSelector((state) => state.customers.list);
  const selectedCustomer = useSelector(
    (state) => state.customers.selecterCustomer,
  );
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    if (selectedCustomer) {
      setName(selectedCustomer.name);
      setCompany(selectedCustomer.company);
      setEmail(selectedCustomer.email);
      setPhone(selectedCustomer.phone);
      setStatus(selectedCustomer.status);
    } else {
      resetForm();
    }
  }, [selectedCustomer]);

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setStatus("Aktif");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const customerData = { name, company, email, phone, status };
    if (selectedCustomer) {
      dispatch(editCustomer({ id: selectedCustomer.id, ...customerData }));
    } else {
      dispatch(addCustomer(customerData));
    }
    resetForm();
  };

  const handleCancelEdit = () => {
    dispatch(clearSelectedCustomer());
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete.id));
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="tab-content customers-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Müşteri Yönetimi</h1>
          <p className="page-subtitle">
            Müşteri listesi, ekleme, düzenleme ve silme panelleri.
          </p>
        </div>
      </div>

      <div className="grid-two-cols">
        <div className="card-container col-span-two">
          <div className="card-title">
            <span>Kayıtlı Müşteriler</span>
            <span className="badge-info">
              Toplam {customerList.length} Müşteri
            </span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell">Müşteri Bilgisi</th>
                  <th className="table-header-cell">İletişim</th>
                  <th className="table-header-cell">Bakiye</th>
                  <th className="table-header-cell">Durum</th>
                  <th className="table-header-cell text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {customerList.map((c) => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="subtext">{c.company}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="text-xs">{c.email}</p>
                        <p className="subtext">{c.phone}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          c.balance < 0 ? "cell-value-debt" : "cell-value"
                        }
                      >
                        {c.balance < 0 ? "-" : ""}
                        {Math.abs(c.balance).toLocaleString("tr-TR")}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          c.status === "Aktif"
                            ? "badge-success"
                            : c.status === "Riskli"
                              ? "badge-warning"
                              : "badge-danger"
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="cell-actions">
                        <button
                          type="button"
                          className="btn-table-action"
                          onClick={() => dispatch(selectCustomerForEdit(c))}
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          className="btn-table-action-danger"
                          onClick={() => setCustomerToDelete(c)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-container">
          <div className="card-container">
            <div className="card-title">
              <span>
                {selectedCustomer ? "MüşteriDüzenle" : "Yeni Müşteri Ekle"}
              </span>
              {selectedCustomer && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="card-subtitle-link text-rose-600 hover:text-rose-800"
                >
                  Vazgeç
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Ad Soyad / Firma Yetkilisi</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Firma Ünvanı</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Yılmaz Mühendislik A.Ş."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">E-posta Adresi</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ahmet@firma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon Numarası</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+90 532 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Müşteri Durumu</label>
                <select
                  className="form-select"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                  <option value="Riskli">Riskli</option>
                </select>
              </div>
              <button type="submit" className="btn-submit">
                {selectedCustomer
                  ? "Değişiklikleri Kaydet"
                  : "Müşteriyi Kaydet"}
              </button>
            </form>
          </div>

          {customerToDelete && (
            <div className="card-alert-container">
              <div className="card-title text-rose-800">
                <span>Müşteri Silme Önizleme</span>
                <span className="text-rose-500 font-bold">⚠</span>
              </div>
              <p className="alert-text">
                <strong>{customerToDelete.name}</strong> isimli müşteriyi silmek
                istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex-actions">
                <button
                  type="button"
                  className="btn-danger flex-1"
                  onClick={handleConfirmDelete}
                >
                  Evet, Sil
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => setCustomerToDelete(null)}
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
