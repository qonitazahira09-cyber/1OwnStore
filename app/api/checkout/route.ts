// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getUserEmail } from "@/lib/session";
import { getCartItems, hitungTotal, parseIds } from "@/lib/keranjang";

export async function GET(req: Request) {
  const email = await getUserEmail();
  if (!email) return NextResponse.json({ message: "Belum masuk" }, { status: 401 });

  const ids = parseIds(new URL(req.url).searchParams.get("items"));
  if (ids.length === 0)
    return NextResponse.json({ message: "Tidak ada item dipilih" }, { status: 400 });

  try {
    const items = await getCartItems(email, ids);
    if (items.length === 0)
      return NextResponse.json({ message: "Item tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ items, ...hitungTotal(items) });
  } catch (e) {
    console.error("GET checkout:", e);
    return NextResponse.json({ message: "Gagal memuat checkout" }, { status: 500 });
  }
}