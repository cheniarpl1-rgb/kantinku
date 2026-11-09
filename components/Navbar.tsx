"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function NavLinks() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true); // Menandakan bahwa komponen sudah aktif di client

    const updateCartCount = () => {
      try {
        const saved = localStorage.getItem("keranjang");
        if (saved) {
          const cart: { jumlah: number }[] = JSON.parse(saved);
          const total = cart.reduce((acc, item) => acc + item.jumlah, 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("keranjang-berubah", updateCartCount);
    return () => {
      window.removeEventListener("keranjang-berubah", updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Menu", href: "/menu" },
    // Angka keranjang hanya akan digabung setelah mounted di client (mencegah hydration error)
    {
      name: `Keranjang ${mounted && cartCount > 0 ? `(${cartCount})` : ""}`,
      href: "/keranjang",
    },
    { name: "Favorit", href: "/favorit" },
    { name: "Riwayat", href: "/riwayat" },
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍲</span>
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">
              Kantin<span className="text-orange-500">Ku</span>
            </span>
          </Link>

          <Suspense
            fallback={<div className="text-xs text-gray-400">Memuat...</div>}
          >
            <NavLinks />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
