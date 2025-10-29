"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NovoTicketPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Geral",
    prioridade: "Normal",
    arquivo: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const categorias = ["Geral", "Cadastro", "Suporte", "Demanda"];
  const prioridades = ["Baixa", "Normal", "Alta", "Urgente"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setForm({ ...form, arquivo: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.titulo) newErrors.titulo = "Informe o título do ticket.";
    if (!form.descricao) newErrors.descricao = "Informe a descrição do ticket.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        categoria: form.categoria,
        prioridade: form.prioridade,
      };

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar ticket");

      alert("Ticket criado com sucesso!");
      router.push("/dashboard/tickets");
    } catch (err: any) {
      console.error(err);
      setErrors({ geral: err.message || "Erro ao criar ticket" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] via-[#0069c2] to-[#00b7ff] relative overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-700 flex justify-center items-center p-6">
          <img
            src="/img/logo/logo.png"
            alt="Logo"
            className="w-50 shadow-md"
          />
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Novo Ticket
          </h1>

          {errors.geral && (
            <p className="text-red-500 text-center text-sm mb-4">{errors.geral}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Título do ticket"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-0.5">{errors.titulo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o problema"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.descricao && <p className="text-red-500 text-xs mt-0.5">{errors.descricao}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridade
                </label>
                <select
                  name="prioridade"
                  value={form.prioridade}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {prioridades.map((pri) => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Anexar arquivo (opcional)
              </label>
              <input
                type="file"
                name="arquivo"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Enviando..." : "Criar Ticket"}
            </button>
          </form>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="mt-2 text-white text-sm underline hover:text-gray-200 transition-colors"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
