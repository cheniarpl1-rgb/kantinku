import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Kartu Beranda yang ditonjolkan dengan shadow lebih tebal & border tipis */}
      <div className="bg-white rounded-3xl p-10 sm:p-16 shadow-lg border border-gray-200/80 text-center flex flex-col items-center">
        {/* Badge Sederhana */}
        <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-orange-100">
          KantinKu - Kantin Sekolah Digital
        </span>

        {/* Tulisan Utama Beranda */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Selamat Datang di KantinKu!
        </h1>

        <p className="text-gray-600 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
          Pesan makanan dan minuman favoritmu di kantin sekolah dengan cepat,
          praktis, dan bebas antre.
        </p>

        {/* Tombol Aksi Utama */}
        <Link
          href="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
        >
          Lihat Menu Kantin &rarr;
        </Link>
      </div>
    </main>
  );
}
