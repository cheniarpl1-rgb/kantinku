"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menu, Menu } from "@/data/menu";

interface CartItem {
  id: number;
  jumlah: number;
}

export default function KeranjangPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [kodeInput, setKodeInput] = useState("");
  const [promoTerpakai, setPromoTerpakai] = useState(false);
  const [pesanPromo, setPesanPromo] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [caraAmbil, setCaraAmbil] = useState<"sendiri" | "diantar">("sendiri");
  const [namaPemesanan, setNamaPemesanan] = useState("");
  const [kelasInput, setKelasInput] = useState("");
  const [pesanForm, setPesanForm] = useState<string | null>(null);

  const [struk, setStruk] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateStorageAndNotify = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("keranjang", JSON.stringify(newCart));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const handleUbahJumlah = (id: number, delta: number) => {
    const itemMenu = menu.find((m) => m.id === id);
    if (!itemMenu) return;

    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newJumlah = item.jumlah + delta;
        if (newJumlah < 1) return item;
        if (newJumlah > itemMenu.stok) return item;
        return { ...item, jumlah: newJumlah };
      }
      return item;
    });
    updateStorageAndNotify(newCart);
  };

  const handleHapusItem = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateStorageAndNotify(newCart);
  };

  // Perhitungan Subtotal
  const itemsWithData = cart
    .map((item) => {
      const data = menu.find((m) => m.id === item.id);
      return data
        ? { ...item, data, subtotal: data.harga * item.jumlah }
        : null;
    })
    .filter(Boolean);

  const subtotal = itemsWithData.reduce(
    (acc, curr) => acc + (curr?.subtotal || 0),
    0,
  );

  // Evaluasi Kode Promo automatik bila subtotal di bawah 20k
  useEffect(() => {
    if (promoTerpakai && subtotal < 20000) {
      setPromoTerpakai(false);
      setPesanPromo({
        tipe: "error",
        teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000 (diskon dibatalkan).",
      });
    }
  }, [subtotal, promoTerpakai]);

  const handleGunakanPromo = () => {
    setPesanPromo(null);
    if (kodeInput.trim().toUpperCase() !== "HEMAT10") {
      setPesanPromo({ tipe: "error", teks: "Kode promo tidak dikenal." });
      return;
    }
    if (subtotal < 20000) {
      setPesanPromo({
        tipe: "error",
        teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000.",
      });
      return;
    }
    setPromoTerpakai(true);
    setPesanPromo({
      tipe: "sukses",
      teks: "Promo HEMAT10 dipakai: diskon 10%.",
    });
  };

  const diskon = promoTerpakai ? Math.round(subtotal * 0.1) : 0;
  const ongkir = caraAmbil === "diantar" ? 2000 : 0;
  const grandTotal = Math.max(0, subtotal - diskon + ongkir);

  // Submit Pesanan
  const handlePesanSekarang = () => {
    setPesanForm(null);
    if (namaPemesanan.trim().length < 3) {
      setPesanForm("Nama pemesan minimal 3 huruf.");
      return;
    }
    if (caraAmbil === "diantar" && kelasInput.trim().length < 3) {
      setPesanForm(
        "Kelas wajib diisi minimal 3 karakter untuk layanan diantar.",
      );
      return;
    }

    const detailItemStruk = itemsWithData.map(
      (item) =>
        `${item?.data.nama} x${item?.jumlah} = Rp ${item?.subtotal.toLocaleString("id-ID")}`,
    );

    const dataStruk = {
      id: Date.now(),
      tanggal: new Date().toLocaleString("id-ID"),
      nama: namaPemesanan,
      kelas: caraAmbil === "diantar" ? kelasInput : null,
      caraAmbil,
      items: detailItemStruk,
      subtotal,
      diskon,
      ongkir,
      grandTotal,
    };

    // Simpan ke Riwayat
    const existingRiwayat = localStorage.getItem("riwayat");
    const riwayatList = existingRiwayat ? JSON.parse(existingRiwayat) : [];
    riwayatList.unshift(dataStruk);
    localStorage.setItem("riwayat", JSON.stringify(riwayatList));

    // Reset Keranjang & Form
    setStruk(dataStruk);
    updateStorageAndNotify([]);
    setPromoTerpakai(false);
    setKodeInput("");
  };

  if (struk) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xl text-center space-y-4">
          <span className="text-5xl">🎉</span>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Terima kasih, {struk.nama}!
          </h2>
          <p className="text-xs text-gray-500">
            Pesanan kamu telah berhasil dibuat dan disimpan ke Riwayat.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-left space-y-2 text-sm text-gray-700">
            <p className="font-bold border-b border-gray-200 pb-2">
              Rincian Pesanan:
            </p>
            {struk.items.map((it: string, idx: number) => (
              <p key={idx} className="text-xs font-medium text-gray-600">
                • {it}
              </p>
            ))}
            <div className="border-t border-gray-200 pt-2 space-y-1 text-xs">
              <p>Subtotal: Rp {struk.subtotal.toLocaleString("id-ID")}</p>
              {struk.diskon > 0 && (
                <p className="text-emerald-600">
                  Diskon (10%): -Rp {struk.diskon.toLocaleString("id-ID")}
                </p>
              )}
              <p>
                Pengiriman:{" "}
                {struk.caraAmbil === "diantar"
                  ? `Diantar ke ${struk.kelas} (Rp 2.000)`
                  : "Diambil sendiri di kantin"}
              </p>
              <p className="font-extrabold text-base text-orange-600 pt-1">
                Total Bayar: Rp {struk.grandTotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/riwayat"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              Lihat Riwayat Pesanan
            </Link>
            <button
              onClick={() => setStruk(null)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition"
            >
              Kembali ke Keranjang
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-gray-200/80 shadow-sm flex flex-col items-center">
          <span className="text-6xl mb-4">🛒</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Keranjang masih kosong.
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Kamu belum menambahkan makanan atau minuman apapun.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Lihat Katalog Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-6">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Items Keranjang */}
        <div className="lg:col-span-7 space-y-4">
          {itemsWithData.map((item) => {
            if (!item) return null;
            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-base">
                    {item.data.nama}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Rp {item.data.harga.toLocaleString("id-ID")} / porsi
                  </p>
                  <p className="text-sm font-extrabold text-orange-600 mt-1">
                    Subtotal: Rp {item.subtotal.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => handleUbahJumlah(item.id, -1)}
                      className="w-7 h-7 bg-gray-100 hover:bg-gray-200 font-bold rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {item.jumlah}
                    </span>
                    <button
                      onClick={() => handleUbahJumlah(item.id, 1)}
                      className="w-7 h-7 bg-gray-100 hover:bg-gray-200 font-bold rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleHapusItem(item.id)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold p-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ringkasan & Form Pemesanan */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kode Promo */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-gray-700">
              Kode Promo (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: HEMAT10"
                value={kodeInput}
                onChange={(e) => setKodeInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-orange-500"
              />
              <button
                onClick={handleGunakanPromo}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Pakai
              </button>
            </div>
            {pesanPromo && (
              <p
                className={`text-[11px] font-semibold ${pesanPromo.tipe === "sukses" ? "text-emerald-600" : "text-rose-600"}`}
              >
                {pesanPromo.teks}
              </p>
            )}
          </div>

          {/* Form Opsi & Identitas */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              Detail Pemesanan
            </h3>

            {/* Cara Ambil */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Cara Ambil:
              </label>
              <div className="flex gap-4 text-xs font-medium text-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="caraAmbil"
                    checked={caraAmbil === "sendiri"}
                    onChange={() => setCaraAmbil("sendiri")}
                  />
                  Ambil sendiri
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="caraAmbil"
                    checked={caraAmbil === "diantar"}
                    onChange={() => setCaraAmbil("diantar")}
                  />
                  Diantar (+Rp 2.000)
                </label>
              </div>
            </div>

            {/* Form Input */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Pemesan:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={namaPemesanan}
                  onChange={(e) => setNamaPemesanan(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-orange-500"
                />
              </div>

              {caraAmbil === "diantar" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kelas (Ruangan):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XII RPL 1"
                    value={kelasInput}
                    onChange={(e) => setKelasInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Ringkasan Biaya */}
            <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              {diskon > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon (10%):</span>
                  <span className="font-bold">
                    -Rp {diskon.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
              {caraAmbil === "diantar" && (
                <div className="flex justify-between">
                  <span>Ongkos Kirim:</span>
                  <span className="font-bold text-gray-900">Rp 2.000</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-orange-600 pt-2 border-t border-gray-100">
                <span>Total Bayar:</span>
                <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {pesanForm && (
              <p className="text-xs font-bold text-rose-600">{pesanForm}</p>
            )}

            <button
              onClick={handlePesanSekarang}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-md transition"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
