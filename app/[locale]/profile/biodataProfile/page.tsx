import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-google";
import { getCurrentUserProfile } from "@/lib/auth";
import BiodataClient from "./BiodataClient";

export default async function BiodataProfilePage() {
  let user: any = null;

  // 1. Cek login Google
  const session = await auth();
  if (session?.user?.email) {
    user = {
      id: session.user.id,
      nama: session.user.nama ?? session.user.name ?? "",
      email: session.user.email,
      nomor_telpon: session.user.nomor_telpon ?? "",
      email_verified: true,
    };
  }

  // 2. Kalau bukan Google, cek login manual
  if (!user) {
    user = await getCurrentUserProfile();
  }

  // 3. Dua-duanya kosong = belum login
  if (!user) {
    redirect("/id/masuk");
  }

  return <BiodataClient user={user} />;
}