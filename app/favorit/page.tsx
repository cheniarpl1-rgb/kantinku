"use client";

import { useState, useEffect } from "react";
import { Menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";

export default function FavoritPage() {
  const [favoritList, setFavoritList] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorit() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Gagal memuat data menu.");
        const allMenu: Menu[] = await res.json();

        const savedFav = localStorage.getItem("favorit");
        if (savedFav) {
          const favIds: number[] = JSON.parse(savedFav);
          setFavoritList(allMenu.filter((item) => favIds.includes(item.id)));
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFavorit();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 font-medium text-gray-500">
        Memuat...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 font-medium text-rose-600">
        Gagal memuat data.
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Menu Favorit Kamu ❤️
        </h1>
        <p className="text-gray-600 mt-1 font-medium">
          Daftar makanan dan minuman yang kamu tandai.
        </p>
      </div>

      {favoritList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Belum ada menu favorit.
          </h2>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm inline-block shadow mt-4"
          >
            &larr; Lihat Katalog Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoritList.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
