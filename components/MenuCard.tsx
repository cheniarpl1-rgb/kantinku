"use client";

import Link from "next/link";
import { Menu } from "@/data/menu";
import { useState, useEffect } from "react";

interface MenuCardProps {
  item: Menu;
}

export default function MenuCard({ item }: MenuCardProps) {
  const isHabis = item.stok <= 0;
  const [isFavorit, setIsFavorit] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedFav = localStorage.getItem("favorit");
      if (savedFav) {
        const favIds: number[] = JSON.parse(savedFav);
        setIsFavorit(favIds.includes(item.id));
      }
    } catch {}
  }, [item.id]);

  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const savedFav = localStorage.getItem("favorit");
      let favIds: number[] = savedFav ? JSON.parse(savedFav) : [];

      if (isFavorit) {
        favIds = favIds.filter((favId) => favId !== item.id);
        setIsFavorit(false);
      } else {
        favIds.push(item.id);
        setIsFavorit(true);
      }
      localStorage.setItem("favorit", JSON.stringify(favIds));
    } catch {}
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md relative ${isHabis ? "opacity-60 bg-gray-50" : ""}`}
    >
      {/* Tombol Favorit */}
      <button
        onClick={toggleFavorit}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow border border-gray-100 text-lg transition hover:scale-110"
        title="Tandai Favorit"
      >
        {mounted && isFavorit ? "❤️" : "🤍"}
      </button>

      {/* Pastikan href menggunakan item.id yang benar */}
      <Link href={`/menu/${item.id}`} className="block">
        <div className="h-44 bg-orange-50 flex items-center justify-center text-5xl relative">
          {item.kategori === "Makanan"
            ? "🍲"
            : item.kategori === "Minuman"
              ? "🥤"
              : "🍿"}
          {isHabis && (
            <span className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center text-white font-black text-sm tracking-widest uppercase">
              Habis
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
              {item.kategori}
            </span>
            <span className="text-xs font-bold text-gray-400">
              Stok: {item.stok}
            </span>
          </div>
          <h2 className="font-extrabold text-gray-900 text-base mt-2 line-clamp-1">
            {item.nama}
          </h2>
          <p className="text-orange-600 font-black text-lg mt-1">
            Rp {item.harga.toLocaleString("id-ID")}
          </p>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-0">
        {isHabis ? (
          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 font-bold py-2.5 rounded-xl text-xs cursor-not-allowed"
          >
            Stok Habis
          </button>
        ) : (
          <Link
            href={`/menu/${item.id}`}
            className="block text-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            Lihat Detail
          </Link>
        )}
      </div>
    </div>
  );
}
