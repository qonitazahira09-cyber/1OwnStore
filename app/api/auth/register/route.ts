import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/db";

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

    // 2. Cek apakah email sudah terdaftar (Metode Supabase)
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase Check Error:", checkError);
      return NextResponse.json(
        { message: "Terjadi kesalahan server" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // 3. Hash password (jangan pernah simpan password polos)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database Supabase (Sesuaikan nama kolom 'nomor_telpon' dengan tabel Supabase kamu)
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          nama: nama,
          email: email,
          nomor_telpon: whatsapp, // Disesuaikan dengan kolom tabel supabase kamu sebelumnya
          password: hashedPassword,
        },
      ]);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return NextResponse.json(
        { message: "Gagal mendaftarkan user" },
        { status: 500 }
      );
    }

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