"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { menu } from "@/data/menu";
import { useParams } from "next/navigation";

function DetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const menuItem = id ? menu.find((p) => p.id === Number(id)) : null;

  const [jumlah, setJumlah] = useState<number>(1);
  const [pesan, setPesan] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  // Inisialisasi status favorit langsung dari localStorage
  const [isFavorit, setIsFavorit] = useState<boolean>(() => {
    if (menuItem) {
      try {
        const savedFav = localStorage.getItem("favorit");
        if (savedFav) {
          const favIds: number[] = JSON.parse(savedFav);
          return favIds.includes(menuItem.id);
        }
      } catch {}
    }
    return false;
  });

  const toggleFavorit = () => {
    if (!menuItem) return;
    try {
      const savedFav = localStorage.getItem("favorit");
      let favIds: number[] = savedFav ? JSON.parse(savedFav) : [];

      if (isFavorit) {
        favIds = favIds.filter((favId) => favId !== menuItem.id);
        setIsFavorit(false);
      } else {
        favIds.push(menuItem.id);
        setIsFavorit(true);
      }
      localStorage.setItem("favorit", JSON.stringify(favIds));
    } catch {}
  };

  if (!menuItem) {
    return (
      <main className="max-w-4xl mx-auto py-16 text-center px-4">
        <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm flex flex-col items-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Menu Tidak Ditemukan
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Menu dengan ID tersebut tidak terdaftar.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow"
          >
            &larr; Kembali ke Katalog Menu
          </Link>
        </div>
      </main>
    );
  }

  const handleTambahKeranjang = () => {
    setPesan(null);
    try {
      const existing = localStorage.getItem("keranjang");
      const cart = existing ? JSON.parse(existing) : [];
      const existingItem = cart.find(
        (i: { id: number }) => Number(i.id) === Number(menuItem.id),
      );
      const jumlahDiKeranjang = existingItem ? Number(existingItem.jumlah) : 0;
      const totalBaru = jumlahDiKeranjang + jumlah;

      if (totalBaru > menuItem.stok) {
        setPesan({
          tipe: "error",
          teks: `Jumlah melebihi stok! Stok tersedia: ${menuItem.stok}.`,
        });
        return;
      }

      if (existingItem) {
        existingItem.jumlah = totalBaru;
      } else {
        cart.push({ id: Number(menuItem.id), jumlah: Number(jumlah) });
      }

      localStorage.setItem("keranjang", JSON.stringify(cart));
      window.dispatchEvent(new Event("keranjang-berubah"));
      setPesan({ tipe: "sukses", teks: "Berhasil ditambahkan ke keranjang!" });
    } catch {
      setPesan({ tipe: "error", teks: "Gagal menyimpan ke keranjang." });
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/menu"
          className="text-gray-500 hover:text-orange-600 font-medium text-sm"
        >
          &larr; Kembali ke Menu
        </Link>
        <button
          onClick={toggleFavorit}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
            isFavorit
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          {isFavorit ? "❤️ Favorit" : "♡ Tambah favorit"}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64 bg-orange-50 rounded-2xl flex items-center justify-center text-7xl border border-orange-100">
          {menuItem.kategori === "Makanan"
            ? "🍲"
            : menuItem.kategori === "Minuman"
              ? "🥤"
              : "🍿"}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {menuItem.kategori}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
              {menuItem.nama}
            </h1>
            <p className="text-2xl font-black text-orange-600 mt-2">
              Rp {menuItem.harga.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Stok Tersedia: {menuItem.stok}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            {menuItem.stok <= 0 ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl font-bold text-center">
                Menu ini habis.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">
                    Jumlah Porsi:
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-1">
                    <button
                      onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold">{jumlah}</span>
                    <button
                      onClick={() => setJumlah(jumlah + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleTambahKeranjang}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            )}

            {pesan && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-semibold ${pesan.tipe === "sukses" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
              >
                {pesan.teks}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DetailMenuPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Memuat...</div>}>
      <DetailContent />
    </Suspense>
  );
}
