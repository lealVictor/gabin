"use client";

import React, { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activePage: "Demandas" | "Assessores" | "Chamados";
  setActivePage: (page: "Demandas" | "Assessores" | "Chamados") => void;
};

export default function Sidebar({ isOpen, onClose, activePage, setActivePage }: Props) {
  // Controla animação de entrada/saída
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); 
  };

  const handleClick = (page: "Demandas" | "Assessores" | "Chamados" ) => {
    setActivePage(page);
    handleClose();
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
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Gabinete</h2>
          <button onClick={handleClose} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            X
          </button>
        </div>

        {/* Links do Dashboard */}
        <ul className="flex flex-col p-4 space-y-2">
          <li>
            <button
              onClick={() => handleClick("Demandas")}
              className={`w-full text-left p-2 rounded ${
                activePage === "Demandas" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              Demandas
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClick("Assessores")}
              className={`w-full text-left p-2 rounded ${
                activePage === "Assessores" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              Assessores
            </button>
          </li>
          <li>
            <button
              onClick={() => handleClick("Chamados")}
              className={`w-full text-left p-2 rounded ${
                activePage === "Chamados" ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              Chamados
            </button>
          </li>
          
        </ul>
      </div>
    </>
  );
}
