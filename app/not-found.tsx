import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Halaman Belum Tersedia (404)
        </h2>
        <p className="text-gray-500 max-w-md mb-8">
          Fitur ini sedang dalam tahap pengembangan. Silakan kembali ke katalog
          menu.
        </p>
        <Link
          href="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow transition"
        >
          Kembali ke Menu
        </Link>
      </div>
    </main>
  );
}
