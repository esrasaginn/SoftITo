import { useState } from "react";
import ProductCard from "./components/ProductCard";

const DECOR_PRODUCTS = [
  { id: "dec-01", title: "Seramik Minimalist Vazo", collection: "İskandinav", price: 450, maxStock: 7 },
  { id: "dec-02", title: "Hasır Dokuma Duvar Aynası", collection: "Bohem", price: 890, maxStock: 4 },
  { id: "dec-03", title: "Beton Kaplı Kokulu Mum", collection: "Endüstriyel", price: 280, maxStock: 15 },
  { id: "dec-04", title: "Keten Koltuk Şalı (Haki)", collection: "Tekstil", price: 620, maxStock: 9 },
  { id: "dec-05", title: "Ahşap Ayaklı Lambader", collection: "Aydınlatma", price: 1750, maxStock: 3 },
  { id: "dec-06", title: "Mermer Sunum Tepsisi", collection: "Mutfak", price: 540, maxStock: 6 },
];

export default function App() {
  const [searchKey, setSearchKey] = useState("");
  const [shoppingBag, setShoppingBag] = useState([]);



  const handleAddToBag = (selectedItem) => {
    setShoppingBag((currentBag) => {
      const isAlreadyInBag = currentBag.find((item) => item.id === selectedItem.id);

      if (isAlreadyInBag) {
        if (isAlreadyInBag.orderedQuantity < selectedItem.maxStock) {
          return currentBag.map((item) =>
            item.id === selectedItem.id
              ? { ...item, orderedQuantity: item.orderedQuantity + 1 }
              : item
          );
        }
        return currentBag;
      }
      return [...currentBag, { ...selectedItem, orderedQuantity: 1 }];
    });
  };

  const handleRemoveFromBag = (itemId) => {
    setShoppingBag((currentBag) => currentBag.filter((item) => item.id !== itemId));
  };

  const totalBagAmount = shoppingBag.reduce(
    (total, item) => total + item.price * item.orderedQuantity,
    0
  );

  const filteredDecorProducts = DECOR_PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans py-12 px-4 md:px-12 pb-40">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="text-center md:text-left border-b border-stone-200 pb-6">
          <h1 className="text-3xl font-light tracking-wide text-stone-900 uppercase">Ev & Tasarım</h1>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-stone-200">
          <input
            type="text"
            placeholder="Koleksiyonlarda veya ürünlerde arayın..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">Ürünler</h2>

          {filteredDecorProducts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredDecorProducts.map((item) => {
                const bagState = shoppingBag.find((bagItem) => bagItem.id === item.id);
                const activeQuantity = bagState ? bagState.orderedQuantity : 0;

                return (
                  <ProductCard
                    key={item.id}
                    productItem={item}
                    activeQuantity={activeQuantity}
                    onBagAction={handleAddToBag}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl py-12 text-center text-stone-400 text-sm">
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-stone-100 shadow-2xl border-t border-stone-800 p-5 z-50">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto whitespace-nowrap py-1">
              <span className="text-sm font-semibold tracking-wider uppercase text-stone-400">Alışveriş Çantası ({shoppingBag.length}):</span>
              {shoppingBag.length > 0 ? (
                shoppingBag.map((item) => (
                  <div key={item.id} className="bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                    <span>{item.title} <b className="text-amber-200">x{item.orderedQuantity}</b></span>
                    <button
                      onClick={() => handleRemoveFromBag(item.id)}
                      className="text-stone-500 hover:text-red-400 ml-1 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-stone-500">Çantanız henüz boş.</span>
              )}
            </div>

            {shoppingBag.length > 0 && (
              <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-800">
                <div className="text-right">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest">Toplam Tutar</p>
                  <p className="text-lg font-bold text-amber-200">{totalBagAmount} TL</p>
                </div>
                <button
                  onClick={() => alert("Siparişiniz alındı! Toplam Tutar: " + totalBagAmount + " TL")}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-900 px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Siparişi Tamamla
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}