import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/db";

// Tipe data yang disimpan di dalam token JWT
type SessionPayload = {
  id: string; // Supabase menggunakan UUID (string), bukan number lagi
  nama: string;
  email: string;
};

/**
 * Baca & verifikasi token dari cookie.
 * Return null kalau belum login / token invalid / expired.
 * Cepat karena tidak query database — cukup untuk cek "sudah login atau belum".
 */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as SessionPayload;
  } catch {
    return null; // token invalid atau sudah kedaluwarsa
  }
}

/**
 * Ambil data lengkap user dari database (nama, email, nomor_telpon, dll)
 * berdasarkan id yang ada di token. Dipakai untuk halaman profil.
 */
export async function getCurrentUserProfile() {
  const session = await getCurrentUser();
  if (!session) return null;

  // Query data user dari Supabase berdasarkan ID
  const { data: user, error } = await supabase
    .from("users")
    .select("id, nama, email, nomor_telpon")
    .eq("id", session.id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil profil user dari Supabase:", error);
    return null;
  }

  return user || null;
}