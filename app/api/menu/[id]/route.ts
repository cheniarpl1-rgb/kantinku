import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const idNum = Number(resolvedParams.id);
  const item = menu.find((m) => m.id === idNum);

  if (!item) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
}
