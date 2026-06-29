import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Handle ESC key or backdrop click dismissals natively
    const handleClose = () => {
      onClose();
    };

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    // Click outside backdrop fallback for safari or general backdrop click
    const handleBackdropClick = (event) => {
      if (event.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isClickInside = (
          rect.top <= event.clientY &&
          event.clientY <= rect.bottom &&
          rect.left <= event.clientX &&
          event.clientX <= rect.right
        );
        if (!isClickInside) {
          dialog.close();
        }
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="p-0 rounded-2xl border-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-2xl w-full mx-4 overflow-hidden"
    >
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto leading-relaxed text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
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

export default Modal;
