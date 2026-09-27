import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

// Tipe data yang disimpan di dalam token JWT
type SessionPayload = {
  id: number;
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
 * Ambil data lengkap user dari database (nama, email, whatsapp, dll)
 * berdasarkan id yang ada di token. Dipakai untuk halaman profil.
 */
export async function getCurrentUserProfile() {
  const session = await getCurrentUser();
  if (!session) return null;

  const [rows]: any = await db.query(
    "SELECT id, nama, email, whatsapp, email_verified FROM users WHERE id = ?",
    [session.id]
  );

  return rows[0] || null;
}