import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

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
        const [rows]: any = await db.query(
          "SELECT id, email FROM users WHERE email = ?",
          [user.email]
        );

        if (!rows || rows.length === 0) {
          await db.query(
            "INSERT INTO users (nama, email, password, email_verified) VALUES (?, ?, ?, NOW())",
            [user.name || "User Google", user.email, ""]
          );
        }

        return true;
      } catch (error) {
        console.error("Gagal menyimpan user Google ke database:", error);
        return false;
      }
    },
    async session({ session }) {
      return session;
    },
  },
});