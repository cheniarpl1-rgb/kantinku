"use client";

import { useState, use } from "react";
import Link from "next/link";
import { menu } from "@/data/menu";

export default function DetailMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const menuItem = menu.find((m) => m.id === Number(resolvedParams.id));

  const [jumlah, setJumlah] = useState<number>(1);
  const [pesan, setPesan] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  if (!menuItem) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Menu Tidak Ditemukan
        </h2>
        <Link
          href="/menu"
          className="text-orange-600 font-semibold mt-4 inline-block"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleTambahKeranjang = () => {
    setPesan(null);
    const existing = localStorage.getItem("keranjang");
    const cart = existing ? JSON.parse(existing) : [];

    const existingItem = cart.find((i: { id: number }) => i.id === menuItem.id);
    const jumlahDiKeranjang = existingItem ? existingItem.jumlah : 0;
    const totalBaru = jumlahDiKeranjang + jumlah;

    if (jumlah < 1) {
      setPesan({ tipe: "error", teks: "Jumlah minimal pemesanan adalah 1." });
      return;
    }

    if (totalBaru > menuItem.stok) {
      setPesan({
        tipe: "error",
        teks: `Jumlah melebihi stok! Stok tersedia: ${menuItem.stok} (sudah di keranjang: ${jumlahDiKeranjang}).`,
      });
      return;
    }

    if (existingItem) {
      existingItem.jumlah = totalBaru;
    } else {
      cart.push({ id: menuItem.id, jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(cart));
    window.dispatchEvent(new Event("keranjang-berubah"));
    setPesan({ tipe: "sukses", teks: "Ditambahkan ke keranjang." });
  };

  const isHabis = menuItem.stok <= 0;
  const totalHarga = menuItem.harga * jumlah;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/menu"
        className="text-gray-500 hover:text-orange-600 font-medium text-sm mb-6 inline-block"
      >
        &larr; Kembali ke Menu
      </Link>

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
            {isHabis ? (
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
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">
                      {jumlah}
                    </span>
                    <button
                      onClick={() => setJumlah(jumlah + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Harga:</span>
                  <span className="text-xl font-extrabold text-gray-900">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
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
                className={`mt-4 p-3 rounded-xl text-xs font-semibold ${
                  pesan.tipe === "sukses"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
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
