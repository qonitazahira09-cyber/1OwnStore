import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan email
    const [rows]: any = await db.query(
      "SELECT id, nama, email, password FROM users WHERE email = ?",
      [email]
    );
    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "Email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // 2. Cocokkan password yang diinput dengan hash di database
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // 3. Buat token JWT (isinya id & nama, TANPA password)
    const token = jwt.sign(
      { id: user.id, nama: user.nama, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 4. Simpan token di httpOnly cookie
    const response = NextResponse.json(
      { message: "Berhasil masuk", nama: user.nama },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,       // tidak bisa diakses lewat JS di browser (aman dari XSS)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}