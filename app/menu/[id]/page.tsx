import { menu } from "@/data/menu";
import { notFound } from "next/navigation";
import Link from "next/link";

interface DetailProps {
  params: {
    id: string;
  };
}

export default async function DetailMenuPage({ params }: DetailProps) {
  const resolvedParams = await params;
  const item = menu.find((p) => p.id.toString() === resolvedParams.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Link
        href="/menu"
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; Kembali ke Katalog
      </Link>
      <div className="border rounded-xl p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{item.nama}</h1>
        <p className="text-gray-500 mb-4">Kategori: {item.kategori}</p>
        <p className="text-xl font-semibold text-orange-600 mb-4">
          Rp {item.harga.toLocaleString()}
        </p>

        <div className="mb-6">
          <span
            className={`text-sm px-3 py-1 rounded font-medium ${
              item.stok > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.stok > 0 ? `Stok Tersedia: ${item.stok}` : "Status: Habis"}
          </span>
        </div>

        <button
          disabled={item.stok === 0}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            item.stok > 0
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {item.stok > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
        </button>
      </div>
    </div>
  );
}
