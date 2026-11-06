"use client";

import { useState } from "react";
import { menu, Menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("default");

  const filteredItems = menu
    .filter((item: Menu) => {
      const matchesSearch = item.nama
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "Semua" || item.kategori === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Menu, b: Menu) => {
      if (sortOrder === "cheapest") return a.harga - b.harga;
      if (sortOrder === "expensive") return b.harga - a.harga;
      if (sortOrder === "az") return a.nama.localeCompare(b.nama);
      return 0;
    });

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Katalog Menu KantinKu
        </h1>
        <p className="text-gray-600 mt-1 font-medium">
          Pilih makanan dan minuman favoritmu hari ini.
        </p>
      </div>

      {/* Bagian Filter & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Cari menu kantin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 text-gray-900 p-3 rounded-xl flex-1 outline-none text-sm bg-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 text-gray-900 p-3 rounded-xl text-sm outline-none bg-white cursor-pointer font-medium"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 text-gray-900 p-3 rounded-xl text-sm outline-none bg-white cursor-pointer font-medium"
        >
          <option value="default">Urutan Awal</option>
          <option value="cheapest">Harga Termurah</option>
          <option value="expensive">Harga Termahal</option>
          <option value="az">Nama A–Z</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg font-medium">
            Menu tidak ditemukan 🙁
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item: Menu) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
