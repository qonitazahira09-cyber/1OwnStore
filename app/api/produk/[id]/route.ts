import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM produk ORDER BY created_at DESC");
  const parsed = (rows as any[]).map((r) => ({
    ...r,
    images: r.images ? JSON.parse(r.images) : [],
    variants: r.variants ? JSON.parse(r.variants) : [],
    sizes: r.sizes ? JSON.parse(r.sizes) : [],
  }));
  return NextResponse.json(parsed);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const b = await req.json();
  await db.query(
    `UPDATE produk SET thumbnail=?,name=?,sku=?,category=?,price=?,stock=?,unit=?,status=?,
     images=?,description=?,variants=?,sizes=?,price_old=?,discount=?,badge_tagline=? WHERE id=?`,
    [
      b.thumbnail || "",
      b.name, b.sku, b.category, b.price, b.stock, b.unit, b.status,
      JSON.stringify(b.images || []),
      b.description || "",
      JSON.stringify(b.variants || []),
      JSON.stringify(b.sizes || []),
      b.priceOld || null,
      b.discount || null,
      b.badgeTagline || "",
      params.id,
    ]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.query("DELETE FROM produk WHERE id=?", [params.id]);
  return NextResponse.json({ success: true });
}