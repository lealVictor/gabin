"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type User = { id: string; name: string };

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
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
    attachment: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Buscar usuários
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
      } catch (err) {
        console.error(err);
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "cep" && value.replace(/\D/g, "").length < 8) {
      setForm((prev) => ({
        ...prev,
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
      }));
    }
  };

  // Máscara WhatsApp
  const handleWhatsApp = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else if (value.length > 5) value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else if (value.length > 2) value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    else value = value.replace(/(\d*)/, "($1");
    e.target.value = value;
    setForm({ ...form, lead_whats: value });
  };
// Máscara CEP
const handleCep = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 8); // só números, max 8 dígitos
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d{0,3})/, "$1-$2"); // 12345678 -> 12345-678
  }
  e.target.value = value;
  setForm({ ...form, cep: value });
};

  // Buscar CEP
  const handleBlurCep = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm({
            ...form,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
          });
          setErrors((prev) => ({ ...prev, cep: "" }));
        } else setErrors((prev) => ({ ...prev, cep: "CEP não encontrado." }));
      } catch {
        setErrors((prev) => ({ ...prev, cep: "Erro ao buscar o CEP." }));
      }
    } else if (cep.length > 0) setErrors((prev) => ({ ...prev, cep: "CEP inválido." }));
  };

  // Upload de arquivo e preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, attachment: file });

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!form.assessorId) newErrors.assessorId = "Selecione o assessor.";
    if (!form.cep) newErrors.cep = "Informe o CEP.";
    if (!form.numero) newErrors.numero = "Informe o número.";
    if (!form.meta) newErrors.meta = "Selecione a meta.";
    if (!form.descricao) newErrors.descricao = "Descreva a demanda.";
    if ((form.lead_name && !form.lead_whats) || (!form.lead_name && form.lead_whats)) {
      newErrors.lead = "Informe nome e WhatsApp do lead ou deixe ambos em branco.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as any);
      });

      const res = await fetch("/api/tasks", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Falha ao cadastrar demanda");

      const data = await res.json();
      console.log("Demanda cadastrada:", data);
      alert("Demanda enviada com sucesso!");

      setForm({
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
        attachment: null,
      });
      setPreview(null);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar demanda. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] via-[#0069c2] to-[#00b7ff] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 flex flex-col items-center mb-4">
        <img src="/img/logo/logo.png" alt="Logo" className="w-40 md:w-48 drop-shadow-lg" />
      </div>

      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden relative z-10">
        <div className="md:w-1/2 h-auto">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80"
            alt="Gabinete de atendimento"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="md:w-1/2 p-5 space-y-3 overflow-y-auto">
          <h2 className="text-center text-gray-800 font-semibold mb-3 text-lg">Cadastro de Demanda</h2>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Assessor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Assessor *</label>
              <select
                name="assessorId"
                value={form.assessorId}
                onChange={handleChange}
                className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um assessor</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              {errors.assessorId && <p className="text-red-500 text-xs mt-0.5">{errors.assessorId}</p>}
            </div>

            {/* Lead opcional */}
            <fieldset className="border rounded-md p-2.5">
              <legend className="text-sm font-semibold text-gray-700 px-1.5">Solicitante (opcional)</legend>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="lead_name"
                  value={form.lead_name}
                  onChange={handleChange}
                  placeholder="Nome do solicitante"
                  className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                <input
                  type="text"
                  name="lead_whats"
                  value={form.lead_whats}
                  onChange={handleWhatsApp}
                  placeholder="(00) 00000-0000"
                  className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                />
              </div>
              {errors.lead && <p className="text-red-500 text-xs mt-0.5">{errors.lead}</p>}
            </fieldset>

            {/* Demanda */}
            <fieldset className="border rounded-md p-2.5">
              <legend className="text-sm font-semibold text-gray-700 px-1.5">Demanda</legend>

              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">CEP *</label>
                  <input
                    type="text"
                    name="cep"
                    value={form.cep}
                    onChange={handleCep} // <-- aqui
                    onBlur={handleBlurCep}
                    placeholder="00000-000"
                    className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                  />

                  {errors.cep && <p className="text-red-500 text-xs mt-0.5">{errors.cep}</p>}
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Número *</label>
                  <input
                    type="text"
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                    placeholder="Número"
                    className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                  />
                  {errors.numero && <p className="text-red-500 text-xs mt-0.5">{errors.numero}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                {["logradouro", "bairro", "cidade", "uf"].map((campo) => (
                  <input
                    key={campo}
                    type="text"
                    name={campo}
                    value={(form as any)[campo]}
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                    readOnly
                    className="border border-gray-200 rounded-md p-1.5 text-sm bg-gray-50"
                  />
                ))}
              </div>

              <div className="mt-1.5">
                <label className="block text-sm font-medium text-gray-700">Meta *</label>
                <select
                  name="meta"
                  value={form.meta}
                  onChange={handleChange}
                  className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="Visita">Visita</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Moção">Moção</option>
                </select>
                {errors.meta && <p className="text-red-500 text-xs mt-0.5">{errors.meta}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição *</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descreva a demanda"
                  className="mt-0.5 block w-full border border-gray-300 rounded-md p-1.5 text-sm"
                />
                {errors.descricao && <p className="text-red-500 text-xs mt-0.5">{errors.descricao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Anexar foto (opcional)</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="mt-0.5 block w-full text-sm"
                />
                {preview && <img src={preview} alt="Prévia" className="mt-2 w-32 h-32 object-cover rounded-md border" />}
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full bg-green-600 text-white rounded-md py-1.5 hover:bg-green-700 text-sm transition-colors"
            >
              Enviar demanda
            </button>
          </form>
        </div>
      </div>

      <Link
        href="/login"
        className="relative z-20 mt-2 text-white text-sm underline hover:text-gray-200 transition-colors"
      >
        Acessar sistema
      </Link>
    </div>
  );
}
