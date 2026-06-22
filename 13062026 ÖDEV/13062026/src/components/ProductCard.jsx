export default function ProductCard({ productItem, activeQuantity, onBagAction }) {
    const { title, collection, price, maxStock } = productItem;
    const stockRemaining = maxStock - activeQuantity;

    return (
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-all">

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                        {collection} Koleksiyonu
                    </span>
                    {stockRemaining === 0 && (
                        <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded font-bold">
                            Tükendi
                        </span>
                    )}
                </div>
                <h3 className="text-stone-800 font-medium text-base leading-snug">{title}</h3>
                <p className="text-stone-400 text-xs">
                    Kalan Stok: <span className="font-semibold text-stone-600">{stockRemaining} adet</span>
                </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                <span className="text-base font-bold text-stone-900 tracking-tight">{price} TL</span>

                <button
                    onClick={() => onBagAction(productItem)}
                    disabled={stockRemaining <= 0}
                    className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all ${stockRemaining > 0
                        ? "bg-stone-800 hover:bg-stone-900 text-white cursor-pointer shadow-2xs"
                        : "bg-stone-100 text-stone-300 cursor-not-allowed"
                        }`}
                >
                    {stockRemaining > 0 ? "Sepete Ekle" : "Stok Yetersiz"}
                </button>
            </div>

        </div>
    );
}