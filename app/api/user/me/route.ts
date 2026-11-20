import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";

export async function GET() {
  // 1. Cek login Google (NextAuth v5)
  const session = await auth();
  if (session?.user?.email) {
    return NextResponse.json({
      nama: session.user.name,
      email: session.user.email,
      avatar: session.user.image ?? null,
    });
  }

  // 2. Cek login manual
  const user = await getCurrentUserProfile();
  if (user) {
    return NextResponse.json(user);
  }

  // 3. Belum login
  return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
}