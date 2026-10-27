import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.query("SELECT * FROM produk WHERE id = ?", [params.id]);
    const product = (rows as any[])[0];
    
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    const parsed = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      variants: product.variants ? JSON.parse(product.variants) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
    };

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const b = await req.json();

    await db.query(
      `UPDATE produk SET thumbnail=?, name=?, sku=?, category=?, price=?, stock=?, unit=?, status=?,
       images=?, description=?, variants=?, sizes=?, price_old=?, discount=?, badge_tagline=? WHERE id=?`,
      [
        b.thumbnail || "",
        b.name,
        b.sku,
        b.category,
        Number(b.price) || 0,
        Number(b.stock) || 0,
        b.unit || "pcs",
        b.status || "Tersedia",
        JSON.stringify(b.images || []),
        b.description || "",
        JSON.stringify(b.variants || []),
        JSON.stringify(b.sizes || []),
        b.priceOld ? Number(b.priceOld) : null,
        b.discount || null,
        b.badgeTagline || "",
        params.id, // Parameter id untuk WHERE id=?
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.query("DELETE FROM produk WHERE id = ?", [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}