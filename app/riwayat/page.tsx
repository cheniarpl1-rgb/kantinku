"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Pesanan {
  tanggal: string;
  nama: string;
  kelas: string;
  tipe: string;
  items: { nama: string; jumlah: number; harga: number }[];
  total: number;
}

export default function RiwayatPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [riwayatList, setRiwayatList] = useState<Pesanan[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("riwayat");
      if (saved) {
        setRiwayatList(JSON.parse(saved));
      }
    } catch {}
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Riwayat Pesanan 📜
        </h1>
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Memuat riwayat...</p>
        </div>
      </main>
    );
  }

  const totalBelanjaKeseluruhan = riwayatList.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  const clearRiwayat = () => {
    try {
      localStorage.removeItem("riwayat");
      setRiwayatList([]);
    } catch {}
  };

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Riwayat Pesanan 📜
          </h1>
          {riwayatList.length > 0 && (
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Ringkasan: {riwayatList.length} pesanan, total belanja Rp{" "}
              {totalBelanjaKeseluruhan.toLocaleString("id-ID")}
            </p>
          )}
        </div>

        {riwayatList.length > 0 && (
          <button
            onClick={clearRiwayat}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs transition border border-rose-200"
          >
            Hapus Riwayat
          </button>
        )}
      </div>

      {riwayatList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-base font-medium mb-4">
            Belum ada riwayat pesanan yang tercatat.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow inline-block transition"
          >
            Pesan Menu Sekarang &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {riwayatList.map((pesanan, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                <div>
                  <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pesanan.tipe}
                  </span>
                  <h2 className="font-extrabold text-gray-900 text-base mt-2">
                    {pesanan.nama}{" "}
                    <span className="text-sm font-medium text-gray-500">
                      ({pesanan.kelas})
                    </span>
                  </h2>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {pesanan.tanggal}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Detail Menu:
                </p>
                <div className="bg-gray-50 rounded-2xl p-3 space-y-2 border border-gray-100">
                  {pesanan.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs font-medium text-gray-700"
                    >
                      <span>
                        {item.nama} &times; {item.jumlah}
                      </span>
                      <span className="font-bold text-gray-900">
                        Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs font-bold text-gray-500">
                  Total Pembayaran:
                </span>
                <span className="text-orange-600 font-black text-base">
                  Rp {pesanan.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
