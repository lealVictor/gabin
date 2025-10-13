// src/lib/auth.ts
import { signIn } from "next-auth/react";

export async function handleLogin(email: string, password: string) {
  return signIn("credentials", { redirect: false, email, password });
}
