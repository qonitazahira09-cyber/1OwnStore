// app/api/tokenizer/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getUserEmail } from "@/lib/session";
import { getCartItems, hitungTotal, parseIds } from "@/lib/keranjang";

export async function POST(request: Request) {
  let pesananId: number | null = null;

  try {
    const email = await getUserEmail();
    if (!email) return NextResponse.json({ error: "Belum masuk" }, { status: 401 });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY belum diatur");
      return NextResponse.json({ error: "Konfigurasi pembayaran belum siap" }, { status: 500 });
    }

    const body = await request.json();
    const ids = parseIds(Array.isArray(body.items) ? body.items.join(",") : null);
    if (ids.length === 0)
      return NextResponse.json({ error: "Tidak ada item dipilih" }, { status: 400 });

    const nama = String(body.customerDetails?.first_name ?? "").trim().slice(0, 100);
    const telepon = String(body.customerDetails?.phone ?? "").trim().slice(0, 20);
    const alamat = String(body.alamat ?? "").trim().slice(0, 300);
    const catatan = String(body.catatan ?? "").trim().slice(0, 300);
    if (!nama || !telepon)
      return NextResponse.json({ error: "Nama dan telepon wajib diisi" }, { status: 400 });

    // Hitung ulang dari database, hanya baris milik email ini
    const items = await getCartItems(email, ids);
    if (items.length === 0)
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    const { subtotal, ongkir, biayaGaransi, total } = hitungTotal(items);

    const orderId = `OWNSTORE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Simpan pesanan (status menunggu)
    const { data: pesanan, error: errPesanan } = await supabase
      .from("pesanan")
      .insert({
        order_id: orderId,
        email_user: email,
        status: "menunggu",
        subtotal,
        ongkir,
        biaya_garansi: biayaGaransi,
        total,
        nama_penerima: nama,
        telepon,
        alamat,
        catatan,
      })
      .select("id")
      .single();
    if (errPesanan || !pesanan) {
      console.error("Simpan pesanan:", errPesanan);
      return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
    }
    pesananId = pesanan.id;

    // 2. Simpan item (snapshot nama & harga saat ini)
    const { error: errItem } = await supabase.from("pesanan_item").insert(
      items.map((i) => ({
        pesanan_id: pesanan.id,
        produk_id: i.produkId,
        keranjang_id: i.id,
        nama: i.nama,
        varian: i.varian,
        ukuran: i.ukuran,
        harga: i.harga,
        jumlah: i.jumlah,
        subtotal: i.subtotal,
      }))
    );
    if (errItem) {
      console.error("Simpan item pesanan:", errItem);
      await supabase.from("pesanan").delete().eq("id", pesanan.id);
      return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
    }

    // 3. Minta token ke Midtrans
    const authString = Buffer.from(`${serverKey.trim()}:`).toString("base64");
    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: total },
        customer_details: { first_name: nama, phone: telepon, email },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Midtrans Error Response:", data);
      await supabase.from("pesanan").delete().eq("id", pesanan.id); // tidak ada transaksi, buang
      return NextResponse.json(
        { error: data.error_messages ? data.error_messages.join(", ") : "Gagal ke Midtrans" },
        { status: response.status }
      );
    }

    return NextResponse.json({ token: data.token, orderId });
  } catch (error: any) {
    console.error("Server Error:", error);
    if (pesananId) await supabase.from("pesanan").delete().eq("id", pesananId);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}