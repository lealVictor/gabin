import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // <-- agora TypeScript reconhece
    };
  }

  interface User {
    role?: string;
  }
}
