import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json({ message: "Belum masuk" }, { status: 401 });
  }

  return NextResponse.json(user, { status: 200 });
}