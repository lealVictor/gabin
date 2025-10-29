"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import NavLink from "@/components/link/NavLink";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline, IoMdInformationCircleOutline } from "react-icons/io";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

type Props = {
  onOpenSidenav?: () => void;
  brandText?: string; // geralmente "Gabinete"
  activePage?: string; // exemplo: "Demandas", "Chamados", "Assessores"
};

export default function Navbar({ onOpenSidenav = () => {}, brandText = "Gabinete", activePage = "Demandas" }: Props) {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Usuário";
  const userImage = session?.user?.image ?? "/img/avatars/avatar4.png";
  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkmode(isDark);
  }, []);

  const toggleDark = () => {
    const next = !darkmode;
    setDarkmode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-xl dark:bg-black/40">
      {/* Breadcrumbs + Título */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <div className="text-sm text-gray-700 dark:text-white">
            <NavLink href="#" className="hover:underline">Home</NavLink>
            <span className="mx-1">/</span>
            {/*<span className="capitalize font-medium">{activePage}</span>*/}
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {activePage}
          </p>
        </div>
      </div>

      {/* Desktop: Search + Ícones */}
      <div className="hidden md:flex md:items-center md:gap-2 ml-auto">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
          <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
          />
        </div>

        <button onClick={toggleDark} className="flex items-center justify-center p-1 text-gray-600 dark:text-gray-200 rounded-md">
          {darkmode ? <RiSunFill className="h-4 w-4" /> : <RiMoonFill className="h-4 w-4" />}
        </button>

        <Dropdown button={<IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-gray-200" />} classNames="py-2 top-8 -left-[180px] w-max">
          <div className="p-4">🔔 Suas notificações aqui</div>
        </Dropdown>

        <Dropdown button={<IoMdInformationCircleOutline className="h-5 w-5 text-gray-600 dark:text-gray-200" />} classNames="py-2 top-8 -left-[180px] w-max">
          <div className="p-4">ℹ️ Informações do sistema</div>
        </Dropdown>

        <Dropdown button={
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <Image src={userImage} alt={userName} width={40} height={40} className="object-cover" />
          </div>
        } classNames="py-2 top-8 -left-[180px] w-max">
          <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="font-bold">Olá, {userName}</p>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-red-500 hover:underline">
              Sair
            </button>
          </div>
        </Dropdown>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-row w-full gap-2 mt-2 px-2 items-center">
        <button onClick={onOpenSidenav} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <FiAlignJustify className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 flex-1">
          <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none dark:text-gray-100 dark:placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="flex items-center justify-center p-1 text-gray-600 dark:text-gray-200 rounded-md">
            {darkmode ? <RiSunFill className="h-4 w-4" /> : <RiMoonFill className="h-4 w-4" />}
          </button>

          <Dropdown button={<IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-gray-200" />} classNames="py-2 -left-[180px] w-max">
            <div className="p-4">🔔 Suas notificações aqui</div>
          </Dropdown>

          <Dropdown button={<IoMdInformationCircleOutline className="h-5 w-5 text-gray-600 dark:text-gray-200" />} classNames="py-2 -left-[180px] w-max">
            <div className="p-4">ℹ️ Informações do sistema</div>
          </Dropdown>

          <Dropdown button={
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Image src={userImage} alt={userName} width={40} height={40} className="object-cover" />
            </div>
          } classNames="py-2 -left-[180px] w-max">
            <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="font-bold">Olá, {userName}</p>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-red-500 hover:underline">
                Sair
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
