import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth";
import BiodataClient from "./BiodataClient";

export default async function BiodataProfilePage() {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/masuk");
  }

  return <BiodataClient user={user} />;
}