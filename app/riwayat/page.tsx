"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RiwayatPage() {
  const [riwayatList, setRiwayatList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("riwayat");
      if (saved) {
        setRiwayatList(JSON.parse(saved));
      }
    } catch {
      setRiwayatList([]);
    }
  }, []);

  const totalBelanjaKeseluruhan = riwayatList.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Riwayat Pesanan 📜
      </h1>

      {riwayatList.length > 0 && (
        <p className="text-sm font-semibold text-gray-600 mb-6">
          Ringkasan: {riwayatList.length} pesanan, total belanja Rp{" "}
          {totalBelanjaKeseluruhan.toLocaleString("id-ID")}
        </p>
      )}

      {riwayatList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-base font-medium mb-4">
            Belum ada pesanan.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow inline-block"
          >
            Mulai Belanja &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {riwayatList.map((pesanan, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center text-xs text-gray-400 font-semibold border-b pb-2">
                <span>{pesanan.tanggal}</span>
                <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                  {pesanan.tipe}
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                Pemesan: {pesanan.nama} {pesanan.kelas && `(${pesanan.kelas})`}
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                {pesanan.items.map((i: any, iIdx: number) => (
                  <div key={iIdx} className="flex justify-between">
                    <span>
                      {i.nama} x{i.jumlah}
                    </span>
                    <span className="font-semibold">
                      Rp {(i.harga * i.jumlah).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-extrabold text-sm text-orange-600 pt-2 border-t">
                <span>Total Bayar:</span>
                <span>Rp {pesanan.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
