"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

// Componentes para cada view
import UsersList from "./users/UserList"
import TasksList from "./tasks/TaskList"; // componente de tasks
import TicketsList from "./tickets/TicketList"; // componente de tickets

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: "tasks" | "tickets" | "users") => void;
};

function Sidebar({ isOpen, onClose, setView }: SidebarProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <aside
        className={`relative w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">⚡ Gabinete</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            onClick={() => setView("tasks")}
          >
            Demandas
          </button>
          <button
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            onClick={() => setView("tickets")}
          >
            Chamados
          </button>
          <button
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            onClick={() => setView("users")}
          >
            Assessores
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
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
  const [view, setView] = useState<"tasks" | "tickets" | "users">("tasks");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Carregando...</p>;

  // Breadcrumb dinâmico
  const breadcrumbMap: Record<"tasks" | "tickets" | "users", string> = {
    tasks: "Demandas",
    tickets: "Chamados",
    users: "Assessores",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {session?.user?.name ?? "Gabinete"}
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
              view === "tasks" ? "text-blue-600 font-semibold" : ""
            }`}
            onClick={() => setView("tasks")}
          >
            Demandas
          </button>
          <button
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
              view === "tickets" ? "text-blue-600 font-semibold" : ""
            }`}
            onClick={() => setView("tickets")}
          >
            Chamados
          </button>
          <button
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
              view === "users" ? "text-blue-600 font-semibold" : ""
            }`}
            onClick={() => setView("users")}
          >
            Assessores
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
            Sair
          </Button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Navbar */}
        <Navbar onOpenSidenav={() => setSidebarOpen(true)} brandText="Gabinete" activePage={breadcrumbMap[view]} />

        {/* Mobile Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} setView={setView} />

        {/* Conteúdo */}
        <main className="flex-1 p-6 mt-4 md:mt-6">
          {view === "tasks" && <TasksList />}
          {view === "tickets" && <TicketsList />}
          {view === "users" && <UsersList />}
        </main>
      </div>
    </div>
  );
}
