import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";

// Helper: siapa yang login? (Google atau manual)
async function getEmail() {
  const session = await auth();
  if (session?.user?.email) return session.user.email;
  const user = await getCurrentUserProfile();
  return user?.email ?? null;
}

// AMBIL semua alamat milik user
export async function GET() {
  const email = await getEmail();
  if (!email) {
    return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("alamat")
    .select("id, label, nama_penerima, alamat_lengkap, utama")
    .eq("email_user", email)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil alamat" }, { status: 500 });
  }

  // Terjemahkan nama database -> nama yang dipakai tampilan
  const addresses = (data ?? []).map((a) => ({
    id: a.id,
    label: a.label,
    receiver: a.nama_penerima,
    fullAddress: a.alamat_lengkap,
    isPrimary: a.utama,
  }));

  return NextResponse.json(addresses);
}

// TAMBAH alamat baru
export async function POST(req: Request) {
  const email = await getEmail();
  if (!email) {
    return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
  }

  const { label, receiver, fullAddress } = await req.json();
  if (!label || !receiver || !fullAddress) {
    return NextResponse.json({ message: "Semua kolom wajib diisi" }, { status: 400 });
  }

  // Alamat pertama otomatis jadi utama
  const { count } = await supabase
    .from("alamat")
    .select("id", { count: "exact", head: true })
    .eq("email_user", email);

  const { error } = await supabase.from("alamat").insert({
    email_user: email,
    label,
    nama_penerima: receiver,
    alamat_lengkap: fullAddress,
    utama: (count ?? 0) === 0,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menyimpan alamat" }, { status: 500 });
  }
  return NextResponse.json({ message: "OK" });
}

// JADIKAN UTAMA
export async function PATCH(req: Request) {
  const email = await getEmail();
  if (!email) {
    return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
  }

  const { id } = await req.json();

  // 1. Semua alamat user ini jadi bukan utama
  await supabase.from("alamat").update({ utama: false }).eq("email_user", email);

  // 2. Alamat yang dipilih jadi utama (dicek milik user ini)
  const { error } = await supabase
    .from("alamat")
    .update({ utama: true })
    .eq("id", id)
    .eq("email_user", email);

  if (error) {
    return NextResponse.json({ message: "Gagal mengubah alamat utama" }, { status: 500 });
  }
  return NextResponse.json({ message: "OK" });
}