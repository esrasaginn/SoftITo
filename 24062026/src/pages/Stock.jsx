import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementStock,
  decrementStock,
  addStockMovement,
} from "../store/stockSlice";

export default function Stock() {
  const dispatch = useDispatch();
  const stockItems = useSelector((state) => state.stock.items);
  const movements = useSelector((state) => state.stock.movements);

  // Local Form State
  const [selectedSku, setSelectedSku] = useState(stockItems[0]?.sku || "");
  const [movementType, setMovementType] = useState("Giriş");
  const [quantity, setQuantity] = useState(5);
  const [note, setNote] = useState("");

  // Dynamic Warehouse capacity calculations
  const qtyDepoA = stockItems
    .filter((i) => i.location.includes("Depo-A"))
    .reduce((sum, i) => sum + i.quantity, 0);
  const qtyDepoB = stockItems
    .filter((i) => i.location.includes("Depo-B"))
    .reduce((sum, i) => sum + i.quantity, 0);

  // Capacity limits (Depo-A: 100 items, Depo-B: 30 items)
  const capacityA = Math.min(100, Math.round((qtyDepoA / 100) * 100));
  const capacityB = Math.min(100, Math.round((qtyDepoB / 30) * 100));

  const handleMovementSubmit = (e) => {
    e.preventDefault();
    if (!selectedSku || quantity <= 0) return;

    dispatch(
      addStockMovement({
        sku: selectedSku,
        type: movementType,
        quantity,
        note,
      }),
    );

    // Reset fields
    setQuantity(5);
    setNote("");
  };

  return (
    <div className="tab-content stock-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stok Yönetimi</h1>
          <p className="page-subtitle">
            Ürün stok miktarları, hareket giriş/çıkışları ve uyarı limitleri.
          </p>
        </div>
      </div>

      <div className="grid-two-cols">
        {/* Stock List */}
        <div className="card-container col-span-two">
          <div className="card-title">
            <span>Stok Durum Tablosu</span>
            <span className="badge-warning">
              {stockItems.filter((i) => i.quantity <= 10).length} Kritik Sınır
            </span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell">SKU / Kod</th>
                  <th className="table-header-cell">Ürün Adı</th>
                  <th className="table-header-cell">Kategori</th>
                  <th className="table-header-cell">Miktar</th>
                  <th className="table-header-cell">Durum</th>
                  <th className="table-header-cell text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell">
                      <span className="sku-code">{item.sku}</span>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="subtext">{item.location}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="category-tag">{item.category}</span>
                    </td>
                    <td className="table-cell">
                      <div className="stock-level-container">
                        <span className="font-semibold text-slate-900">
                          {item.quantity} Adet
                        </span>
                        <div className="stock-bar-wrapper">
                          <div
                            className={`stock-bar-fill ${
                              item.quantity === 0
                                ? "stock-bar-fill-danger"
                                : item.quantity <= 10
                                  ? "stock-bar-fill-warning"
                                  : "stock-bar-fill-success"
                            }`}
                            style={{
                              width: `${Math.min(100, (item.quantity / 50) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          item.quantity === 0
                            ? "badge-danger"
                            : item.quantity <= 10
                              ? "badge-warning"
                              : "badge-success"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="cell-actions">
                        <button
                          type="button"
                          onClick={() => dispatch(incrementStock(item.id))}
                          className="btn-stock-action"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(decrementStock(item.id))}
                          className="btn-stock-action"
                        >
                          -
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Control Panels */}
        <div className="flex-container">
          {/* Stock In/Out adjustment */}
          <div className="card-container">
            <div className="card-title">
              <span>Hızlı Stok Hareketi Girişi</span>
              <span className="text-xs text-emerald-600 font-semibold">
                Giriş / Çıkış
              </span>
            </div>
            <form onSubmit={handleMovementSubmit}>
              <div className="form-group">
                <label className="form-label">Ürün Seçin</label>
                <select
                  className="form-select"
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                >
                  {stockItems.map((item) => (
                    <option key={item.id} value={item.sku}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hareket Tipi</label>
                <div className="movement-selector">
                  <label className="movement-label">
                    <input
                      type="radio"
                      name="movement-type"
                      checked={movementType === "Giriş"}
                      onChange={() => setMovementType("Giriş")}
                      className="text-indigo-600"
                    />
                    Stok Ekle (+)
                  </label>
                  <label className="movement-label">
                    <input
                      type="radio"
                      name="movement-type"
                      checked={movementType === "Çıkış"}
                      onChange={() => setMovementType("Çıkış")}
                      className="text-indigo-600"
                    />
                    Stok Çıkar (-)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Miktar (Adet)</label>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  placeholder="5"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Açıklama / Fiş No</label>
                <input
                  type="text"
                  className="form-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Örn: Yeni sevkiyat girişi"
                />
              </div>

              <button type="submit" className="btn-submit">
                Hareketi Kaydet
              </button>
            </form>
          </div>

          {/* Warehouse status mockup */}
          <div className="card-container">
            <div className="card-title">
              <span>Depo Dağılımı</span>
              <span className="card-subtitle">Kapasite Doluluk</span>
            </div>
            <div className="flex-container">
              <div>
                <div className="warehouse-label-row">
                  <span>Merkez Depo (Depo-A)</span>
                  <span>{capacityA}% Dolu</span>
                </div>
                <div className="capacity-bar-wrapper">
                  <div
                    className="capacity-bar-fill capacity-bar-fill-primary"
                    style={{ width: `${capacityA}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="warehouse-label-row">
                  <span>Yedek Depo (Depo-B)</span>
                  <span>{capacityB}% Dolu</span>
                </div>
                <div className="capacity-bar-wrapper">
                  <div
                    className="capacity-bar-fill capacity-bar-fill-secondary"
                    style={{ width: `${capacityB}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
