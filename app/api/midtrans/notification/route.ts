// app/api/midtrans/notification/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { terapkanStatus } from "@/lib/pesanan";

export async function POST(req: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return NextResponse.json({ message: "Konfigurasi belum siap" }, { status: 500 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 });
  }

  const { order_id, status_code, gross_amount, signature_key } = body ?? {};
  if (!order_id || !status_code || !gross_amount || !signature_key)
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });

  // Verifikasi tanda tangan: SHA512(order_id + status_code + gross_amount + serverKey)
  const expected = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature_key));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return NextResponse.json({ message: "Tanda tangan tidak valid" }, { status: 403 });

  try {
    const hasil = await terapkanStatus(body);
    if (!hasil.ok) console.warn("Notifikasi diabaikan:", order_id, hasil.reason);
    return NextResponse.json({ ok: true }); // 200 = "sudah kuterima"
  } catch (e) {
    console.error("Webhook Midtrans:", e);
    return NextResponse.json({ message: "Gagal memproses" }, { status: 500 }); // Midtrans akan mencoba lagi
  }
}