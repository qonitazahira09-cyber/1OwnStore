// app/api/keranjang/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getUserEmail } from "@/lib/session";

const MAX_QTY = 99;

type SizeRow = { label: string; price: number };
type VariantRow = { name: string };

const unauthorized = () =>
  NextResponse.json({ message: "Belum masuk" }, { status: 401 });
const bad = (message: string, status = 400) =>
  NextResponse.json({ message }, { status });

// Harga satuan: harga ukuran kalau ada (>0), kalau tidak harga dasar produk.
// Aturannya SAMA dengan yang dipakai di ProdukDetail.tsx.
function unitPrice(p: { price: number; sizes: SizeRow[] | null }, ukuran: string) {
  const s = (p.sizes ?? []).find((x) => x.label === ukuran);
  return s && s.price > 0 ? s.price : p.price;
}

/* ============ GET: isi keranjang ============ */
export async function GET() {
  const email = await getUserEmail();
  if (!email) return unauthorized();

  const { data, error } = await supabase
    .from("keranjang")
    .select(
      "id, varian, ukuran, jumlah, produk:produk_id (id, name, price, sizes, thumbnail, images, category, unit)"
    )
    .eq("email_user", email)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("GET keranjang:", error);
    return bad("Gagal mengambil keranjang", 500);
  }

  const items = (data ?? [])
    .filter((row: any) => row.produk)
    .map((row: any) => {
      const p = row.produk;
      const harga = unitPrice(p, row.ukuran);
      return {
        id: row.id,
        produkId: p.id,
        nama: p.name,
        kategori: p.category,
        gambar: p.thumbnail || p.images?.[0] || "/foto/mix.jpg",
        varian: row.varian,
        ukuran: row.ukuran,
        jumlah: row.jumlah,
        harga,
        subtotal: harga * row.jumlah,
      };
    });

  return NextResponse.json({
    items,
    total: items.reduce((n, i) => n + i.subtotal, 0),
    jumlahItem: items.length,
    jumlahBarang: items.reduce((n, i) => n + i.jumlah, 0),
  });
}

/* ============ POST: tambah ke keranjang ============ */
export async function POST(req: Request) {
  const email = await getUserEmail();
  if (!email) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Body tidak valid");
  }

  const produkId = Number(body.produkId);
  if (!Number.isInteger(produkId)) return bad("produkId tidak valid");

  const tambah =
    Number.isInteger(Number(body.jumlah)) && Number(body.jumlah) > 0
      ? Number(body.jumlah)
      : 1;

  // Validasi ke database: produk harus ada, varian & ukuran harus milik produk itu
  const { data: p } = await supabase
    .from("produk")
    .select("id, variants, sizes")
    .eq("id", produkId)
    .maybeSingle();
  if (!p) return bad("Produk tidak ditemukan", 404);

  const variants: VariantRow[] = p.variants ?? [];
  const sizes: SizeRow[] = p.sizes ?? [];
  const varian = variants.length ? String(body.varian ?? "") : "";
  const ukuran = sizes.length ? String(body.ukuran ?? "") : "";

  if (variants.length && !variants.some((v) => v.name === varian))
    return bad("Varian tidak valid");
  if (sizes.length && !sizes.some((s) => s.label === ukuran))
    return bad("Ukuran tidak valid");

  // Sudah ada di keranjang? Kalau ya, tambah jumlahnya.
  const { data: existing } = await supabase
    .from("keranjang")
    .select("id, jumlah")
    .eq("email_user", email)
    .eq("produk_id", produkId)
    .eq("varian", varian)
    .eq("ukuran", ukuran)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("keranjang")
      .update({ jumlah: Math.min(MAX_QTY, existing.jumlah + tambah) })
      .eq("id", existing.id)
      .eq("email_user", email);
    if (error) return bad("Gagal memperbarui keranjang", 500);
  } else {
    const { error } = await supabase.from("keranjang").insert({
      email_user: email,
      produk_id: produkId,
      varian,
      ukuran,
      jumlah: Math.min(MAX_QTY, tambah),
    });
    if (error) return bad("Gagal menambah ke keranjang", 500);
  }

  return NextResponse.json({ ok: true });
}

/* ============ PATCH: ubah jumlah ============ */
export async function PATCH(req: Request) {
  const email = await getUserEmail();
  if (!email) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Body tidak valid");
  }

  const id = Number(body.id);
  const jumlah = Number(body.jumlah);
  if (!Number.isInteger(id)) return bad("id tidak valid");
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > MAX_QTY)
    return bad(`Jumlah harus 1 sampai ${MAX_QTY}`);

  const { data, error } = await supabase
    .from("keranjang")
    .update({ jumlah })
    .eq("id", id)
    .eq("email_user", email) // hanya boleh mengubah milik sendiri
    .select("id");

  if (error) return bad("Gagal mengubah jumlah", 500);
  if (!data?.length) return bad("Item tidak ditemukan", 404);
  return NextResponse.json({ ok: true });
}

/* ============ DELETE: hapus item ============ */
export async function DELETE(req: Request) {
  const email = await getUserEmail();
  if (!email) return unauthorized();

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("id tidak valid");

  const { error } = await supabase
    .from("keranjang")
    .delete()
    .eq("id", id)
    .eq("email_user", email); // hanya boleh menghapus milik sendiri

  if (error) return bad("Gagal menghapus item", 500);
  return NextResponse.json({ ok: true });
}