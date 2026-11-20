// app/api/produk/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { bodyToRow, rowToProduct } from "@/lib/produk";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(rowToProduct));
}

export async function POST(req: Request) {
  // TODO: cek session admin di sini (next-auth) sebelum lanjut
  const body = await req.json();
  const row = bodyToRow(body);

  if (!row.name || !row.sku) {
    return NextResponse.json({ message: "Nama dan SKU wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase.from("produk").insert(row).select().single();

  if (error) {
    const msg = error.code === "23505" ? "SKU sudah dipakai produk lain" : error.message;
    return NextResponse.json({ message: msg }, { status: 400 });
  }
  return NextResponse.json(rowToProduct(data), { status: 201 });
}