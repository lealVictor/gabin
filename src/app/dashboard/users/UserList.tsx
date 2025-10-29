// src/app/dashboard/Users.tsx
"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string | null;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400">Carregando assessores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4">
      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Nenhum assessor cadastrado.</p>
      ) : (
        users.map((u) => (
          <div
            key={u.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={u.image ?? "/img/avatars/avatar4.png"}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{u.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                {u.phone && <p className="text-xs text-gray-400">📞 {u.phone}</p>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
