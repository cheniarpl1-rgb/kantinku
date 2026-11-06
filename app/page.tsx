import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <span className="bg-white/25 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full">
            Kantin Sekolah Digital
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Selamat Datang di KantinKu 🍔
          </h1>
          <p className="text-orange-100 text-sm sm:text-base max-w-lg font-medium">
            Pesan makanan dan minuman favoritmu di kantin sekolah dengan cepat,
            praktis, dan tanpa antre. Cek menu harian dan nikmati promo
            menariknya!
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/menu"
              className="bg-white text-orange-600 hover:bg-orange-50 font-extrabold px-6 py-3 rounded-xl shadow-md transition"
            >
              Lihat Katalog Menu &rarr;
            </Link>
            <Link
              href="/keranjang"
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition border border-orange-400"
            >
              Buka Keranjang 🛒
            </Link>
          </div>
        </div>
        <div className="text-8xl bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20">
          🍲
        </div>
      </div>
    </main>
  );
}
