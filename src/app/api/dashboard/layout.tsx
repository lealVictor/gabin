"use client";

import { ReactNode } from "react";
import Navbar from "@/components/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar brandText="Dashboard" />

      <main className="flex-1 p-6 mt-4 md:mt-6">{children}</main>
    </div>
  );
}
