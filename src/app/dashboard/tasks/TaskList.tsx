// src/app/dashboard/TasksList.tsx
"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  meta?: string | null;
  cep?: string | null;
  cidade?: string | null;
  uf?: string | null;
  user?: {
    name: string | null;
    email: string | null;
  } | null;
  lead?: {
    lead_name: string;
    lead_whats: string | null;
  } | null;
};

export default function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks?status=IN_PROGRESS");
        if (!res.ok) throw new Error("Erro ao buscar tarefas");
        const data: Task[] = await res.json();
        setTasks(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Carregando demandas...
      </p>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma demanda aberta.
        </p>
      ) : (
        tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {t.title || "Sem título"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.description || "Sem descrição"}
              </p>

              {t.lead && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  👤 <strong>Lead:</strong> {t.lead.lead_name}{" "}
                  {t.lead.lead_whats && `(${t.lead.lead_whats})`}
                </p>
              )}

              {t.user && (
                <p className="text-xs text-gray-400">
                  🧑 Assessor: {t.user.name || "Desconhecido"}
                </p>
              )}

              <p className="text-xs text-gray-400">
                📅 Criado em: {new Date(t.createdAt).toLocaleString("pt-BR")}
              </p>

              {t.meta && (
                <p className="text-xs text-gray-400">🏷️ Meta: {t.meta}</p>
              )}

              {t.cidade && (
                <p className="text-xs text-gray-400">
                  📍 {t.cidade}/{t.uf}
                </p>
              )}

              <p className="text-xs text-blue-500 font-medium mt-1">
                Status: {t.status}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
