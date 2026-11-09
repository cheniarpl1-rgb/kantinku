import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const idNum = Number(params.id);
  const item = menu.find((m) => m.id === idNum);

  if (!item) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
}
