// app/api/pesanan/sinkron/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getUserEmail } from "@/lib/session";
import { terapkanStatus } from "@/lib/pesanan";

export async function POST(req: Request) {
  const email = await getUserEmail();
  if (!email) return NextResponse.json({ message: "Belum masuk" }, { status: 401 });

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return NextResponse.json({ message: "Konfigurasi belum siap" }, { status: 500 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 });
  }
  const orderId = String(body.orderId ?? "");

  // Pesanan harus milik user yang login
  const { data: p } = await supabase
    .from("pesanan")
    .select("order_id")
    .eq("order_id", orderId)
    .eq("email_user", email)
    .maybeSingle();
  if (!p) return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });

  try {
    // Tanya Midtrans langsung. Yang dipercaya jawaban Midtrans, bukan kiriman browser.
    const authString = Buffer.from(`${serverKey.trim()}:`).toString("base64");
    const res = await fetch(
      `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`,
      { headers: { Accept: "application/json", Authorization: `Basic ${authString}` }, cache: "no-store" }
    );
    const mt = await res.json();

    // Belum ada transaksi (mis. pop-up ditutup sebelum memilih metode bayar)
    if (!mt.transaction_status) return NextResponse.json({ status: "menunggu" });

    const hasil = await terapkanStatus(mt);
    return NextResponse.json({ status: hasil.ok ? hasil.status : "menunggu" });
  } catch (e) {
    console.error("Sinkron pesanan:", e);
    return NextResponse.json({ message: "Gagal sinkron" }, { status: 500 });
  }
}