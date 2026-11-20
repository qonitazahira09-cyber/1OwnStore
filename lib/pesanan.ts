// lib/pesanan.ts
import { supabase } from "@/lib/db";

export type StatusPesanan = "menunggu" | "dibayar" | "gagal" | "kadaluarsa" | "dibatalkan";

export type MidtransStatus = {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  gross_amount: string; // contoh: "33500.00"
  payment_type?: string;
};

/** Terjemahkan istilah Midtrans ke status di tokomu. */
function petaStatus(ts: string, fraud?: string): StatusPesanan {
  switch (ts) {
    case "settlement":
      return "dibayar";
    case "capture": // kartu kredit
      if (fraud === "accept") return "dibayar";
      if (fraud === "challenge") return "menunggu"; // menunggu review manual
      return "gagal";
    case "pending":
      return "menunggu";
    case "expire":
      return "kadaluarsa";
    case "deny":
    case "failure":
      return "gagal";
    case "cancel":
    case "refund":
    case "partial_refund":
    case "chargeback":
    case "partial_chargeback":
      return "dibatalkan";
    default:
      return "menunggu";
  }
}

/** Hapus dari keranjang item yang baru dibayar. Aman dijalankan berulang. */
async function bersihkanKeranjang(pesananId: number, email: string) {
  const { data } = await supabase
    .from("pesanan_item")
    .select("keranjang_id")
    .eq("pesanan_id", pesananId);

  const ids = (data ?? [])
    .map((r: any) => r.keranjang_id as number | null)
    .filter((x): x is number => typeof x === "number");

  if (ids.length > 0) {
    await supabase.from("keranjang").delete().in("id", ids).eq("email_user", email);
  }
}

export async function terapkanStatus(mt: MidtransStatus) {
  const { data: pesanan, error } = await supabase
    .from("pesanan")
    .select("id, email_user, status, total")
    .eq("order_id", mt.order_id)
    .maybeSingle();
  if (error) throw error;
  if (!pesanan) return { ok: false as const, reason: "pesanan tidak ditemukan" };

  // Lapis kedua: nominal dari Midtrans harus sama dengan yang tercatat di database kita
  if (Math.round(Number(mt.gross_amount)) !== pesanan.total) {
    console.error("Nominal tidak cocok:", mt.order_id, mt.gross_amount, pesanan.total);
    return { ok: false as const, reason: "nominal tidak cocok" };
  }

  let baru = petaStatus(mt.transaction_status, mt.fraud_status);

  // Notifikasi bisa datang terlambat/terbalik (mis. "pending" tiba setelah "settlement").
  // Pesanan yang sudah dibayar tidak boleh turun, kecuali refund/batal.
  if (pesanan.status === "dibayar" && baru !== "dibatalkan") baru = "dibayar";

  if (baru !== pesanan.status) {
    const patch: Record<string, unknown> = { status: baru };
    if (mt.payment_type) patch.metode_bayar = mt.payment_type;
    if (baru === "dibayar") patch.paid_at = new Date().toISOString();

    // .eq("status", ...) = hanya berhasil kalau status belum diubah request lain
    const { error: errUpdate } = await supabase
      .from("pesanan")
      .update(patch)
      .eq("id", pesanan.id)
      .eq("status", pesanan.status);
    if (errUpdate) throw errUpdate;
  }

  if (baru === "dibayar") await bersihkanKeranjang(pesanan.id, pesanan.email_user);

  return { ok: true as const, status: baru };
}