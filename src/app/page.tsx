"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors bg-white dark:bg-black text-gray-900 dark:text-gray-100 px-4">

      <h1 className="text-5xl font-bold mb-4 text-center">
        Bem-vindo ao Agendador
      </h1>

      <p className="text-lg text-center max-w-xl mb-8">
        Organize seus compromissos de forma rápida e fácil. Alterne entre o modo claro e escuro usando o botão no canto superior direito.
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
        >
          Entrar
        </a>
        <a
          href="/register"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Registrar
        </a>
      </div>

      <footer className="mt-12 text-gray-500 dark:text-gray-400 text-sm">
        &copy; 2025 Agendador. Todos os direitos reservados.
      </footer>
    </div>
  );
}
