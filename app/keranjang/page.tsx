"use client";

import { useState } from "react";
import Link from "next/link";
import { menu } from "@/data/menu";

interface CartItem {
  id: number;
  jumlah: number;
}

interface StrukItem {
  nama: string;
  jumlah: number;
  harga: number;
}

interface StrukData {
  tanggal: string;
  nama: string;
  kelas: string;
  tipe: string;
  items: StrukItem[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
}

export default function KeranjangPage() {
  // Inisialisasi state langsung dari localStorage (tanpa useEffect untuk memuat data)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("keranjang");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoKode, setPromoKode] = useState("");
  const [diskon, setDiskon] = useState(0);
  const [pesanPromo, setPesanPromo] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);

  const [tipePengiriman, setTipePengiriman] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [namaPemesan, setNamaPemesan] = useState("");
  const [kelasPemesan, setKelasPemesan] = useState("");
  const [pesanCheckout, setPesanCheckout] = useState<{
    tipe: "sukses" | "error";
    teks: string;
  } | null>(null);
  const [struk, setStruk] = useState<StrukData | null>(null);

  const updateJumlah = (id: number, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const menuItem = menu.find((m) => m.id === id);
        const stokMaks = menuItem ? menuItem.stok : 99;
        const newQty = Math.max(1, item.jumlah + delta);
        return { ...item, jumlah: Math.min(newQty, stokMaks) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const hapusItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  const subtotal = cart.reduce((acc, item) => {
    const menuItem = menu.find((m) => m.id === item.id);
    return acc + (menuItem ? menuItem.harga * item.jumlah : 0);
  }, 0);

  const ongkir = tipePengiriman === "delivery" ? 2000 : 0;

  const handleTerapkanPromo = () => {
    setPesanPromo(null);
    const kodeBersih = promoKode.trim().toUpperCase();

    if (kodeBersih === "") {
      setDiskon(0);
      return;
    }

    if (kodeBersih === "HEMAT10") {
      if (subtotal >= 20000) {
        const diskonNilai = Math.round(subtotal * 0.1);
        setDiskon(diskonNilai);
        setPesanPromo({
          tipe: "sukses",
          teks: "Promo HEMAT10 dipakai: diskon 10%.",
        });
      } else {
        setDiskon(0);
        setPesanPromo({
          tipe: "error",
          teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000.",
        });
      }
    } else {
      setDiskon(0);
      setPesanPromo({ tipe: "error", teks: "Kode promo tidak dikenal." });
    }
  };

  const handlePesanSekarang = () => {
    setPesanCheckout(null);
    if (namaPemesan.trim().length < 3) {
      setPesanCheckout({
        tipe: "error",
        teks: "Nama pemesan minimal 3 huruf.",
      });
      return;
    }
    if (tipePengiriman === "delivery" && kelasPemesan.trim().length < 3) {
      setPesanCheckout({
        tipe: "error",
        teks: "Kelas wajib diisi minimal 3 karakter.",
      });
      return;
    }
    if (cart.length === 0) {
      setPesanCheckout({ tipe: "error", teks: "Keranjang masih kosong." });
      return;
    }

    const diskonFinal = subtotal < 20000 ? 0 : diskon;
    const totalBayar = subtotal - diskonFinal + ongkir;
    const detailPesanan: StrukData = {
      tanggal: new Date().toLocaleString("id-ID"),
      nama: namaPemesan,
      kelas: kelasPemesan,
      tipe: tipePengiriman === "delivery" ? "Diantar" : "Ambil Sendiri",
      items: cart.map((i) => {
        const m = menu.find((item) => item.id === i.id);
        return {
          nama: m?.nama ?? "Menu",
          jumlah: i.jumlah,
          harga: m?.harga ?? 0,
        };
      }),
      subtotal,
      diskon: diskonFinal,
      ongkir,
      total: totalBayar,
    };

    try {
      const riwayatLama = localStorage.getItem("riwayat");
      const listRiwayat = riwayatLama ? JSON.parse(riwayatLama) : [];
      listRiwayat.unshift(detailPesanan);
      localStorage.setItem("riwayat", JSON.stringify(listRiwayat));
    } catch {}

    setStruk(detailPesanan);
    setCart([]);
    localStorage.removeItem("keranjang");
    setDiskon(0);
    setPromoKode("");
    setNamaPemesan("");
    setKelasPemesan("");
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  if (struk) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-2xl font-black text-gray-900">
            Terima kasih, {struk.nama}!
          </h1>

          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3 text-sm border border-gray-100">
            <div className="text-xs text-gray-500 font-bold mb-2">
              STRUK PEMESANAN KANTINKU
            </div>
            {struk.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {item.nama} x{item.jumlah}
                </span>
                <span className="font-semibold">
                  Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {struk.subtotal.toLocaleString("id-ID")}</span>
            </div>
            {struk.diskon > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon:</span>
                <span>- Rp {struk.diskon.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pengiriman:</span>
              <span className="font-semibold">
                {struk.tipe === "Diantar"
                  ? `Ongkir antar ke ${struk.kelas}: Rp 2.000`
                  : "Diambil sendiri di kantin"}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-extrabold text-base text-orange-600">
              <span>Total bayar:</span>
              <span>Rp {struk.total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            onClick={() => setStruk(null)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow transition"
          >
            Selesai / Kembali Belanja
          </button>
        </div>
      </main>
    );
  }

  const effectiveDiskon = subtotal < 20000 ? 0 : diskon;

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Keranjang Belanja 🛒
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
          <span className="text-6xl mb-3 inline-block">🛒</span>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Keranjang masih kosong.
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Belum ada menu yang ditambahkan ke keranjang.
          </p>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow inline-block"
          >
            &larr; Pilih Menu Sekarang
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
                    <h3 className="font-bold text-gray-900">{menuItem.nama}</h3>
                    <p className="text-sm font-black text-orange-600">
                      Rp {menuItem.harga.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Subtotal: Rp{" "}
                      {(menuItem.harga * item.jumlah).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-xl p-1">
                      <button
                        onClick={() => updateJumlah(item.id, -1)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm">
                        {item.jumlah}
                      </span>
                      <button
                        onClick={() => updateJumlah(item.id, 1)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => hapusItem(item.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-sm px-2 py-1"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 h-fit">
            <h2 className="font-bold text-lg text-gray-900 border-b pb-3">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">
                Kode Promo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cth: HEMAT10"
                  value={promoKode}
                  onChange={(e) => setPromoKode(e.target.value)}
                  className="border border-gray-300 text-gray-900 p-2 text-xs rounded-xl flex-1 outline-none uppercase bg-white"
                />
                <button
                  onClick={handleTerapkanPromo}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">
                Cara Ambil
              </label>
              <div className="flex gap-4 text-xs font-medium">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tipe"
                    checked={tipePengiriman === "pickup"}
                    onChange={() => setTipePengiriman("pickup")}
                  />
                  Ambil sendiri
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tipe"
                    checked={tipePengiriman === "delivery"}
                    onChange={() => setTipePengiriman("delivery")}
                  />
                  Diantar (+Rp 2.000)
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">
                  Nama Pemesan (Min. 3 huruf)
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap..."
                  value={namaPemesan}
                  onChange={(e) => setNamaPemesan(e.target.value)}
                  className="w-full border border-gray-300 text-gray-900 p-2 text-xs rounded-xl mt-1 outline-none bg-white"
                />
              </div>
              {tipePengiriman === "delivery" && (
                <div>
                  <label className="text-xs font-bold text-gray-700">
                    Kelas / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: XII IPA 1"
                    value={kelasPemesan}
                    onChange={(e) => setKelasPemesan(e.target.value)}
                    className="w-full border border-gray-300 text-gray-900 p-2 text-xs rounded-xl mt-1 outline-none bg-white"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              {effectiveDiskon > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon</span>
                  <span>- Rp {effectiveDiskon.toLocaleString("id-ID")}</span>
                </div>
              )}
              {tipePengiriman === "delivery" && (
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span>Rp 2.000</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">
                  Rp{" "}
                  {(subtotal - effectiveDiskon + ongkir).toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>
            </div>

            {pesanCheckout && (
              <p className="text-[11px] font-semibold text-rose-600">
                {pesanCheckout.teks}
              </p>
            )}

            <button
              onClick={handlePesanSekarang}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition text-sm"
            >
              Pesan sekarang
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
