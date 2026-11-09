"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { menu } from "@/data/menu";

interface CartItem {
  id: number;
  jumlah: number;
}

export default function KeranjangPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tipe, setTipe] = useState("Ambil Sendiri");
  const [sukses, setSukses] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("keranjang");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {}
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4 text-center">
        <p className="text-gray-500 text-sm">Memuat keranjang...</p>
      </main>
    );
  }

  const updateJumlah = (id: number, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const menuItem = menu.find((m) => m.id === id);
        const maxStok = menuItem ? menuItem.stok : 99;
        const newJumlah = Math.max(1, Math.min(maxStok, item.jumlah + delta));
        return { ...item, jumlah: newJumlah };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const totalHarga = cart.reduce((acc, item) => {
    const menuItem = menu.find((m) => m.id === item.id);
    return acc + (menuItem ? menuItem.harga * item.jumlah : 0);
  }, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const pesananBaru = {
      tanggal: new Date().toLocaleString("id-ID"),
      nama,
      kelas,
      tipe,
      items: cart.map((item) => {
        const menuItem = menu.find((m) => m.id === item.id);
        return {
          nama: menuItem ? menuItem.nama : "Menu",
          jumlah: item.jumlah,
          harga: menuItem ? menuItem.harga : 0,
        };
      }),
      total: totalHarga,
    };

    try {
      const savedRiwayat = localStorage.getItem("riwayat");
      const riwayatList = savedRiwayat ? JSON.parse(savedRiwayat) : [];
      riwayatList.unshift(pesananBaru);
      localStorage.setItem("riwayat", JSON.stringify(riwayatList));

      localStorage.removeItem("keranjang");
      setCart([]);
      window.dispatchEvent(new Event("keranjang-berubah"));
      setSukses(true);
    } catch {}
  };

  if (sukses) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
            ✅
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Pesanan Berhasil!
          </h2>
          <p className="text-sm text-gray-500">
            Terima kasih, pesananmu sudah dicatat di Riwayat Pesanan.
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <Link
              href="/riwayat"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
            >
              Lihat Riwayat &rarr;
            </Link>
            <Link
              href="/menu"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition"
            >
              Belanja Lagi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Keranjang Belanja 🛒
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <p className="text-gray-500 text-base font-medium mb-4">
            Keranjangmu masih kosong.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow inline-block transition"
          >
            Mulai Belanja &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => {
              const menuItem = menu.find((m) => m.id === item.id);
              if (!menuItem) return null;

              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">
                      {menuItem.nama}
                    </h2>
                    <p className="text-xs text-orange-600 font-black mt-1">
                      Rp {menuItem.harga.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 border border-gray-300 rounded-xl p-1">
                      <button
                        onClick={() => updateJumlah(item.id, -1)}
                        className="w-7 h-7 bg-gray-100 font-bold rounded-lg text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">
                        {item.jumlah}
                      </span>
                      <button
                        onClick={() => updateJumlah(item.id, 1)}
                        className="w-7 h-7 bg-gray-100 font-bold rounded-lg text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-sm p-2"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm h-fit space-y-4">
            <h2 className="font-extrabold text-gray-900 text-lg border-b pb-3">
              Ringkasan Pesanan
            </h2>
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Total Harga:</span>
              <span className="text-orange-600 font-black text-base">
                Rp {totalHarga.toLocaleString("id-ID")}
              </span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama..."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: XII IPA 1"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Tipe Pesanan
                </label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none bg-white text-gray-900"
                >
                  <option value="Ambil Sendiri">Ambil Sendiri</option>
                  <option value="Antar ke Kelas">Antar ke Kelas</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-4"
              >
                Checkout Pesanan
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
