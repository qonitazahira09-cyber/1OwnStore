import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      nama?: string;
      nomor_telpon?: string;
    } & DefaultSession["user"];
  }
}
import Google from "next-auth/providers/google";
import { supabase } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/masuk",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", user.email)
          .maybeSingle();

        if (selectError) {
          console.error("Gagal mengecek user di Supabase:", selectError);
          return false;
        }

        if (!existingUser) {
          const { error: insertError } = await supabase
            .from("users")
            .insert([
              {
                nama: user.name || "User Google",
                email: user.email,
                password: "",
              },
            ]);

          if (insertError) {
            console.error("Gagal menyimpan user Google baru ke Supabase:", insertError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Terjadi kesalahan pada proses signIn:", error);
        return false;
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, nama, nomor_telpon")
          .eq("email", session.user.email)
          .maybeSingle();

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.nama = dbUser.nama;
          session.user.nomor_telpon = dbUser.nomor_telpon;
        }
      }
      return session;
    },
  },
});