// lib/session.ts
import { auth } from "@/lib/auth-google";
import { getCurrentUser } from "@/lib/auth";

/**
 * Satu-satunya tempat yang menjawab "siapa yang login?".
 * Return email user (huruf kecil) atau null kalau belum login.
 */
export async function getUserEmail(): Promise<string | null> {
  // 1. Login Google
  const session = await auth();
  if (session?.user?.email) return session.user.email.toLowerCase();

  // 2. Login manual (JWT di cookie)
  const user = await getCurrentUser();
  if (user?.email) return user.email.toLowerCase();

  return null;
}