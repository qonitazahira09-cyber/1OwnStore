import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { nama, email, whatsapp, password } = await req.json();

    // 1. Validasi sederhana
    if (!nama || !email || !whatsapp || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Cek apakah email sudah terdaftar
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // 3. Hash password (jangan pernah simpan password polos)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database
    await db.query(
      "INSERT INTO users (nama, email, whatsapp, password) VALUES (?, ?, ?, ?)",
      [nama, email, whatsapp, hashedPassword]
    );

    return NextResponse.json(
      { message: "Pendaftaran berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}