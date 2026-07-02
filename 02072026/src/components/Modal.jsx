import React, { useRef, useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
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

  // Diyalog kapatma olayını yönet (örneğin Escape tuşuna basıldığında)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  // Dışarı tıklama ile kapatma alternatifi (arkaplana tıklandığında modali kapatma)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Tarayıcının yerel closedby özelliğini destekleyip desteklemediğini kontrol et
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event) => {
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isDialogContent) {
          dialog.close();
          onClose();
        }
      };

      dialog.addEventListener('click', handleBackdropClick);
      return () => {
        dialog.removeEventListener('click', handleBackdropClick);
      };
    }
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="modal-title"
      className="p-0 border-0 rounded-3"
      style={{ outline: 'none' }}
    >
      <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light dark:bg-dark">
        <h5 className="modal-title fw-bold m-0" id="modal-title">{title}</h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Kapat"
          onClick={onClose}
        ></button>
      </div>
      <div className="p-3">
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
