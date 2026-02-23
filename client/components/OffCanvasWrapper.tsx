"use client";

import React, { ReactNode } from "react";

interface OffCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const OffCanvasWrapper: React.FC<OffCanvasProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className='fixed inset-0 z-40 bg-opacity-50' onClick={onClose} />

      {/* Off-canvas panel */}
      <div className='fixed top-0 right-0 z-50 h-full w-3/4 max-w-[900px] bg-white shadow-lg p-6 overflow-auto transform transition-transform duration-300'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>{title || "Panel"}</h2>
          <button
            onClick={onClose}
            className='text-gray-600 hover:text-gray-800'
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default OffCanvasWrapper;
