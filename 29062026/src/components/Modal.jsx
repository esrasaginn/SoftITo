// React kütüphanesinden useEffect ve useRef kancalarını içe aktarır
import { useEffect, useRef } from 'react';
// lucide-react kütüphanesinden X (kapatma) simgesi bileşenini içe aktarır
import { X } from 'lucide-react';

// Yeniden kullanılabilir bir Modal (Dialog) bileşeni tanımlar
const Modal = ({ isOpen, onClose, title, children }) => {
  // HTML5 dialog elementine doğrudan erişebilmek için ref referansı oluşturur
  const dialogRef = useRef(null);

  // Modal'ın açılma (isOpen) durumuna göre dialog elementini kontrol eden efekt
  useEffect(() => {
    // dialogRef referansına bağlı DOM nesnesini alır
    const dialog = dialogRef.current;
    // Eğer dialog nesnesi bulunmuyorsa durur
    if (!dialog) return;

    // Eğer isOpen parametresi true ise dialog penceresini açar
    if (isOpen) {
      // Dialog açık değilse modal olarak gösterir
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      // Eğer isOpen false ise ve dialog açıksa kapatır
      if (dialog.open) {
        dialog.close();
      }
    }
  // isOpen değişkeni güncellendikçe tetiklenir
  }, [isOpen]);

  // Dialog elementinin klavye veya dış tıklama olaylarını dinleyen efekt
  useEffect(() => {
    // dialogRef referansına bağlı DOM nesnesini alır
    const dialog = dialogRef.current;
    // Eğer dialog nesnesi bulunmuyorsa durur
    if (!dialog) return;

    // Kapatma olayı tetiklendiğinde onClose callback fonksiyonunu çalıştırır
    const handleClose = () => {
      onClose();
    };

    // ESC tuşuyla iptal etme talebini yakalayıp tarayıcının varsayılanını engeller ve onClose çağırır
    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    // Backdrop (arka plan karartısı) üzerine tıklandığında dialog penceresini kapatır
    const handleBackdropClick = (event) => {
      // Tıklanan hedef dialog elementinin kendisi ise (yani arka plan)
      if (event.target === dialog) {
        // Dialog sınır kutusunun ölçülerini alır
        const rect = dialog.getBoundingClientRect();
        // Tıklamanın dialog çerçevesinin içinde olup olmadığını belirler
        const isClickInside = (
          rect.top <= event.clientY &&
          event.clientY <= rect.bottom &&
          rect.left <= event.clientX &&
          event.clientX <= rect.right
        );
        // Tıklama dış alandaysa dialog'u kapatır
        if (!isClickInside) {
          dialog.close();
        }
      }
    };

    // Dialog elementine olay dinleyicilerini ekler
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);

    // Bileşen yok edildiğinde (unmount) olay dinleyicilerini temizler
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  // onClose fonksiyonu değiştikçe tetiklenir
  }, [onClose]);

  // Dialog elementini ve iç yerleşimini render eder
  return (
    // HTML5 standart dialog etiketi
    <dialog
      ref={dialogRef}
      className="p-0 rounded-2xl border-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-2xl w-full mx-4 overflow-hidden"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Modal Başlık Alanı (Header) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          {/* Kapatma Butonu */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal İçerik Alanı (Content) */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>

        {/* Modal Alt Bilgi Alanı (Footer) */}
        <div className="flex justify-end px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          {/* Onaylama/Kabul etme butonu */}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
            type="button"
          >
            Kabul Et ve Kapat
          </button>
        </div>
      </div>
    </dialog>
  );
};

// Modal bileşenini dışa aktarır
export default Modal;
