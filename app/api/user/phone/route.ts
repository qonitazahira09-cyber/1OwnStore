import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.email) {
    return NextResponse.json({
      nama: session.user.nama ?? session.user.name,
      email: session.user.email,
      avatar: session.user.image ?? null,
      nomor_telpon: session.user.nomor_telpon ?? null,
    });
  }

  const user = await getCurrentUserProfile();
  if (user) return NextResponse.json(user);

  return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
}