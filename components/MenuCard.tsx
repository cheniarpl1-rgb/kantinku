import Link from "next/link";
import { Menu } from "@/data/menu";

interface MenuCardProps {
  item: Menu;
}

export default function MenuCard({ item }: MenuCardProps) {
  const isAvailable = item.stok > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Visual Header / Thumbnail */}
      <div className="h-36 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center relative overflow-hidden">
        <span className="text-4xl transform group-hover:scale-110 transition duration-300">
          {item.kategori === "Makanan"
            ? "🍲"
            : item.kategori === "Minuman"
              ? "🥤"
              : "🍿"}
        </span>
        <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {item.kategori}
        </span>
      </div>

      {/* Konten Kartu */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition mb-1">
            {item.nama}
          </h3>
          <p className="text-2xl font-extrabold text-orange-500 mb-4">
            Rp {item.harga.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
          {/* Badge Stok */}
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              isAvailable
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {isAvailable ? `Stok: ${item.stok}` : "Habis"}
          </span>

          {/* Tombol Detail */}
          <Link
            href={`/menu/${item.id}`}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group-hover:translate-x-1 transition"
          >
            Detail &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
