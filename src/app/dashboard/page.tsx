"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`relative w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">⚡ MyApp</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Home
          </a>
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Estatísticas
          </a>
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Configurações
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sair
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  if (status === "loading") return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">⚡ MyApp</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Home
          </a>
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Estatísticas
          </a>
          <a className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            Configurações
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sair
          </Button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Navbar */}
        <Navbar onOpenSidenav={() => setSidebarOpen(true)} brandText="MyApp" />

        {/* Mobile Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Conteúdo */}
        <main className="flex-1 p-6 mt-4 md:mt-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-gray-700 dark:text-white font-semibold mb-2">Bem-vindo</h3>
            <p className="text-gray-500 dark:text-gray-300">
              Você está logado como <b>{session?.user?.email}</b>.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
