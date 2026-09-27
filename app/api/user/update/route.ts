import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    // 1. Pastikan user sedang login (baca dari cookie token)
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { message: "Kamu belum masuk" },
        { status: 401 }
      );
    }

    const { nama, whatsapp } = await req.json();

    if (!nama || !whatsapp) {
      return NextResponse.json(
        { message: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Update hanya data milik user yang sedang login (pakai id dari token)
    await db.query(
      "UPDATE users SET nama = ?, whatsapp = ? WHERE id = ?",
      [nama, whatsapp, session.id]
    );

    return NextResponse.json(
      { message: "Data berhasil diperbarui", nama, whatsapp },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}