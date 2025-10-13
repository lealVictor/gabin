"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 w-full max-w-md relative">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Entrar
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Senha */}
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full mb-6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Botão de login normal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition flex justify-center items-center gap-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
            ou
          </span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Login com Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-4 h-4"
          />
          Entrar com Google
        </button>

        {/* Link para registrar */}
        <p className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Não tem conta?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Registre-se
          </span>
        </p>
      </div>
    </div>
  );
}
