"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email ou senha inválidos");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] via-[#0069c2] to-[#00b7ff] relative overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Cabeçalho com imagem */}
        <div className="bg-blue-600 dark:bg-blue-700 flex justify-center items-center p-6">
          <img
            src="/img/logo/logo.png"
            alt="Logo"
            className="w-50 shadow-md "
          />
        </div>

        {/* Conteúdo */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Bem-vindo de volta
          </h1>

          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="password"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
              ou
            </span>
            <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-4 h-4"
            />
            Entrar com Google
          </button>

          <p className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
            É assessor e não tem conta?{" "}
            <span
              onClick={() => router.push("tickets/")}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Solicite seu cadastro
            </span>
          </p>
        </div>
      </div>
        <Link
          href="/"
          className="mt-2 text-white text-sm underline hover:text-gray-200 transition-colors"
        >
          Voltar para Cadastrar Demanda
        </Link>
    </div>
  );
}
