"use client";

import React, { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  // Controla animação de entrada/saída
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    // Adiciona delay para animação de saída
    setVisible(false);
    setTimeout(() => onClose(), 300); // 300ms = duração da animação
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
          <button onClick={handleClose} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            X
          </button>
        </div>
        {/* Conteúdo da sidebar */}
        <div className="p-4">
          <p>Notificações, informações, links...</p>
        </div>
      </div>
    </>
  );
}
