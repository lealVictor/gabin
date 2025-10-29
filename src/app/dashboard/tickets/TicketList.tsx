// src/app/dashboard/TicketsList.tsx
"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  titulo: string;
  descricao: string;
  createdAt: string;
  status?: string;
};

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) throw new Error("Erro ao buscar tickets");
        const data: Ticket[] = await res.json();
        setTickets(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Carregando tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4">
      {tickets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Nenhum ticket registrado.</p>
      ) : (
        tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{t.titulo}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.descricao}</p>
              <p className="text-xs text-gray-400">
                Criado em: {new Date(t.createdAt).toLocaleString()}
              </p>
              {t.status && (
                <p className="text-xs text-blue-500 font-medium mt-1">Status: {t.status}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
