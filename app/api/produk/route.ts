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

export async function POST(req: Request) {
  const b = await req.json();
  const [result] = await db.query(
    `INSERT INTO produk (thumbnail,name,sku,category,price,stock,unit,status,images,description,variants,sizes,price_old,discount,badge_tagline)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
    ]
  );
  return NextResponse.json({ success: true, id: (result as any).insertId });
}