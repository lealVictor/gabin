"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NovaTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    assessorId: "",
    lead_name: "",
    lead_whats: "",
    cep: "",
    numero: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    meta: "",
    descricao: "",
    arquivo: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setForm({ ...form, arquivo: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!form.assessorId) newErrors.assessorId = "Informe o ID do assessor.";
    if (!form.lead_name) newErrors.lead_name = "Informe o nome do lead.";
    if (!form.descricao) newErrors.descricao = "Informe a descrição da task.";
    if (!form.meta) newErrors.meta = "Informe a meta.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        assessorId: form.assessorId,
        lead_name: form.lead_name,
        lead_whats: form.lead_whats,
        cep: form.cep,
        numero: form.numero,
        logradouro: form.logradouro,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        meta: form.meta,
        descricao: form.descricao,
        tag: "GERAL",
        attachment: null, // por enquanto sem upload real
      };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar a task.");

      alert("Task criada com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrors({ geral: err.message || "Erro ao criar a task." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] via-[#0069c2] to-[#00b7ff] relative overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 dark:bg-blue-700 flex justify-center items-center p-6">
          <img src="/img/logo/logo.png" alt="Logo" className="w-50 shadow-md" />
        </div>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Nova Task
          </h1>

          {errors.geral && (
            <p className="text-red-500 text-center text-sm mb-4">
              {errors.geral}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID do Assessor *
              </label>
              <input
                type="text"
                name="assessorId"
                value={form.assessorId}
                onChange={handleChange}
                placeholder="ID do assessor"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.assessorId && (
                <p className="text-red-500 text-xs mt-0.5">{errors.assessorId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Lead *
                </label>
                <input
                  type="text"
                  name="lead_name"
                  value={form.lead_name}
                  onChange={handleChange}
                  placeholder="Nome do lead"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lead_name && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.lead_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp do Lead
                </label>
                <input
                  type="text"
                  name="lead_whats"
                  value={form.lead_whats}
                  onChange={handleChange}
                  placeholder="(99) 99999-9999"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva a tarefa"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.descricao && (
                <p className="text-red-500 text-xs mt-0.5">{errors.descricao}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                value={form.cep}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="numero"
                placeholder="Número"
                value={form.numero}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="text"
              name="logradouro"
              placeholder="Logradouro"
              value={form.logradouro}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={form.bairro}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="cidade"
              placeholder="Cidade"
              value={form.cidade}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="uf"
              placeholder="UF"
              value={form.uf}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta *
              </label>
              <input
                type="text"
                name="meta"
                value={form.meta}
                onChange={handleChange}
                placeholder="Meta da task"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.meta && (
                <p className="text-red-500 text-xs mt-0.5">{errors.meta}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Enviando..." : "Criar Task"}
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
