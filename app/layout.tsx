import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Impor Navbar di sini

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi Kantin Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />{" "}
        {/* <-- Panggil Navbar di sini agar tampil di semua halaman */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
