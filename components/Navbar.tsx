"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [totalItems, setTotalItems] = useState<number>(0);

  const hitungTotal = () => {
    try {
      const saved = localStorage.getItem("keranjang");
      if (saved) {
        const parsed = JSON.parse(saved);
        const count = parsed.reduce(
          (acc: number, item: { jumlah: number }) => acc + item.jumlah,
          0,
        );
        setTotalItems(count);
      } else {
        setTotalItems(0);
      }
    } catch {
      setTotalItems(0);
    }
  };

  useEffect(() => {
    hitungTotal();
    const handleStorageChange = () => hitungTotal();
    window.addEventListener("keranjang-berubah", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("keranjang-berubah", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Favorit", href: "/favorit" },
    {
      name: `Keranjang${totalItems > 0 ? ` (${totalItems})` : ""}`,
      href: "/keranjang",
    },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-2xl text-orange-600 tracking-wide"
        >
          KantinKu
        </Link>
        <nav className="flex gap-2 sm:gap-4 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
