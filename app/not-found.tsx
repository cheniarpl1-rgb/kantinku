import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200/80 shadow-xl p-8 sm:p-10 text-center space-y-6">
        {/* Ilustrasi Emoji / Icon */}
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner border border-orange-100">
          🍽️
        </div>

        <div className="space-y-2">
          <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Oops! Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sepertinya menu atau halaman yang kamu cari sudah habis atau tidak
            terdaftar di KantinKu.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-md shadow-orange-500/20"
          >
            &larr; Kembali ke Beranda
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
          >
            Lihat Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
