"use client";

import React, { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  //  lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  //  ESC key support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50'
      onClick={onCancel}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200'
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <h2 className='text-xl font-bold mb-3'>{title}</h2>

        <p className='mb-6 text-gray-600'>{message}</p>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition'
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
