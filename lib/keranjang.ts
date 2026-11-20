// lib/keranjang.ts
import { supabase } from "@/lib/db";

export const ONGKIR = 12000;        // sementara tetap; nanti dari kurir/alamat
export const BIAYA_GARANSI = 1500;

type SizeRow = { label: string; price: number };

export function unitPrice(p: { price: number; sizes: SizeRow[] | null }, ukuran: string) {
  const s = (p.sizes ?? []).find((x) => x.label === ukuran);
  return s && s.price > 0 ? s.price : p.price;
}

/** Ambil item keranjang milik `email`, opsional hanya id tertentu. */
export async function getCartItems(email: string, ids?: number[]) {
  let q = supabase
    .from("keranjang")
    .select("id, varian, ukuran, jumlah, produk:produk_id (id, name, price, sizes, thumbnail, images, category)")
    .eq("email_user", email)
    .order("created_at", { ascending: true });

  if (ids) q = q.in("id", ids);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? [])
    .filter((row: any) => row.produk)
    .map((row: any) => {
      const p = row.produk;
      const harga = unitPrice(p, row.ukuran);
      return {
        id: row.id as number,
        produkId: p.id as number,
        nama: p.name as string,
        gambar: (p.thumbnail || p.images?.[0] || "/foto/mix.jpg") as string,
        varian: row.varian as string,
        ukuran: row.ukuran as string,
        jumlah: row.jumlah as number,
        harga,
        subtotal: harga * row.jumlah,
      };
    });
}

export function hitungTotal(items: { subtotal: number }[]) {
  const subtotal = items.reduce((n, i) => n + i.subtotal, 0);
  return { subtotal, ongkir: ONGKIR, biayaGaransi: BIAYA_GARANSI, total: subtotal + ONGKIR + BIAYA_GARANSI };
}

/** "12,15,15,abc" -> [12, 15] */
export function parseIds(raw: string | null): number[] {
  const ids = (raw ?? "").split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);
  return [...new Set(ids)];
}