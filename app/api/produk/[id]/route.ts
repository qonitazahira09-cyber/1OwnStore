// app/api/produk/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { bodyToRow, rowToProduct } from "@/lib/produk";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const { data, error } = await supabase.from("produk").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  return NextResponse.json(rowToProduct(data));
}

export async function PUT(req: Request, { params }: Ctx) {
  // TODO: cek session admin
  const { id } = await params;
  const row = bodyToRow(await req.json());

  const { data, error } = await supabase
    .from("produk").update(row).eq("id", id).select().maybeSingle();

  if (error) {
    const msg = error.code === "23505" ? "SKU sudah dipakai produk lain" : error.message;
    return NextResponse.json({ message: msg }, { status: 400 });
  }
  if (!data) return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
  return NextResponse.json(rowToProduct(data));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  // TODO: cek session admin
  const { id } = await params;
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}