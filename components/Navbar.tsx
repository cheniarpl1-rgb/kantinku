"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [totalItem, setTotalItem] = useState(0);

  const updateCartCount = () => {
    try {
      const existing = localStorage.getItem("keranjang");
      if (existing) {
        const cart = JSON.parse(existing);
        // Menghitung total jumlah kuantitas semua item di keranjang
        const count = cart.reduce(
          (acc: number, item: { jumlah: number }) => acc + item.jumlah,
          0,
        );
        setTotalItem(count);
      } else {
        setTotalItem(0);
      }
    } catch {
      setTotalItem(0);
    }
  };

  useEffect(() => {
    // Ambil data saat pertama kali komponen dimuat
    updateCartCount();

    // Dengarkan event kustom saat keranjang berubah
    window.addEventListener("keranjang-berubah", updateCartCount);

    return () => {
      window.removeEventListener("keranjang-berubah", updateCartCount);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-black text-xl text-orange-600 tracking-tight"
        >
          KantinKu
        </Link>

        <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link href="/" className="hover:text-orange-600 transition">
            Beranda
          </Link>
          <Link href="/menu" className="hover:text-orange-600 transition">
            Menu
          </Link>
          <Link href="/favorit" className="hover:text-orange-600 transition">
            Favorit
          </Link>
          <Link
            href="/keranjang"
            className="hover:text-orange-600 transition relative flex items-center gap-1"
          >
            Keranjang
            {totalItem > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalItem}
              </span>
            )}
          </Link>
          <Link href="/riwayat" className="hover:text-orange-600 transition">
            Riwayat
          </Link>
        </nav>
      </div>
    </header>
  );
}
