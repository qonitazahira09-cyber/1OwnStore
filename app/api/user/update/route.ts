import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    // 1. Siapa yang login? (Google atau manual)
    const session = await auth();
    const email =
      session?.user?.email ?? (await getCurrentUserProfile())?.email;

    if (!email) {
      return NextResponse.json({ message: "Kamu belum masuk" }, { status: 401 });
    }

    // 2. Ambil data dari form
    const { nama, nomor_telpon } = await req.json();

    if (!nama || !nomor_telpon) {
      return NextResponse.json(
        { message: "Nama dan nomor telepon wajib diisi" },
        { status: 400 }
      );
    }

    // 3. Update berdasarkan email
    const { error } = await supabase
      .from("users")
      .update({ nama, nomor_telpon })
      .eq("email", email);

    if (error) {
      return NextResponse.json({ message: "Gagal menyimpan" }, { status: 500 });
    }

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}