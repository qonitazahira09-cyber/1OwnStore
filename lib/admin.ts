import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";

export async function isAdmin() {
  const session = await auth();
  const email = session?.user?.email ?? (await getCurrentUserProfile())?.email;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && admins.includes(email.toLowerCase());
}