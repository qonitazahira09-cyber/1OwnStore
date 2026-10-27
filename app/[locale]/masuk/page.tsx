"use client";

import { useState } from "react";
import styles from "./masuk.module.css";
import { Link, useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react"; // <-- 1. Import signIn dari next-auth/react

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal masuk");
      }

      setMessage("Berhasil masuk!");
      router.push("/"); // arahkan ke beranda setelah berhasil
    } catch (err: any) {
      setMessage(err.message || "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Panel kiri - logo */}
        <div className={styles.leftPanel}>
          <img
            src="/foto/logo.png"
            alt="Own Store"
            className={styles.logo}
          />
        </div>

        {/* Panel kanan - form */}
        <div className={styles.rightPanel}>
          <Link href="/" className={styles.backButton}>
            <span aria-hidden="true">←</span> Kembali
          </Link><br />

          <h1 className={styles.heading}>Selamat Datang Kembali!</h1>
          <p className={styles.eyebrow}>
            Masuk untuk lanjut belanja dan cek pesananmu.
          </p><br />

          {/* Pesan Error / Sukses */}
          {message && (
            <p style={{ color: message.includes("Berhasil") ? "green" : "red", fontSize: "14px", marginBottom: "10px" }}>
              {message}
            </p>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className={styles.input}
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi"
              className={styles.input}
              required
            />

            <Link href="/lupaPw" className={styles.signupTextL}>
            Lupa Password?
            </Link>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>ATAU</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.socialRow}>
            {/* 2. Tambahkan onClick untuk memicu NextAuth Google Sign In */}
            <button
              type="button"
              className={styles.socialButton}
              aria-label="Masuk dengan Google"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              <GoogleIcon />
            </button>
            <button
              type="button"
              className={styles.socialButton}
              aria-label="Masuk dengan Facebook"
            >
              <FacebookIcon />
            </button>
          </div>

          <p className={styles.signupText}>
            Belum punya akun?{" "}
            <Link href="/daftar" className={styles.signupLink}>
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.7 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.7 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6c-2 1.5-4.6 2.5-7.6 2.5-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.6 5.6c-.5.4 7.1-5.2 7.1-15.5 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 4C12.95 4 4 12.95 4 24c0 9.99 7.31 18.27 16.88 19.78V29.62h-5.08V24h5.08v-4.28c0-5.02 2.99-7.79 7.57-7.79 2.19 0 4.48.39 4.48.39v4.93h-2.52c-2.48 0-3.26 1.54-3.26 3.13V24h5.55l-.89 5.62h-4.66v14.16C36.69 42.27 44 33.99 44 24 44 12.95 35.05 4 24 4z"
      />
      <path
        fill="#FFFFFF"
        d="M31.37 29.62L32.26 24h-5.55v-4.28c0-1.59.78-3.13 3.26-3.13h2.52v-4.93s-2.29-.39-4.48-.39c-4.58 0-7.57 2.77-7.57 7.79V24h-5.08v5.62h5.08v14.16c1.02.16 2.06.24 3.14.24s2.12-.08 3.14-.24V29.62h4.65z"
      />
    </svg>
  );
}