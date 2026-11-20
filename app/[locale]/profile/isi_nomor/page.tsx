"use client";
import { useEffect, useState } from "react";

export default function LengkapiNomor() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gerbang: cek dulu siapa yang datang
  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) window.location.href = "/id/masuk";            // belum login
        else if (u.nomor_telpon) window.location.href = "/id"; // sudah punya nomor
        else setReady(true);                                   // tampilkan form
      });
  }, []);

  // Kirim nomor ke server
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/user/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }
    window.location.href = "/id"; // sukses → beranda
  }

  if (!ready) return <p style={{ padding: 40 }}>Memuat...</p>;

  return (
    <main style={{ padding: "40px 20px", maxWidth: 400, margin: "0 auto" }}>
      <h2>Satu langkah lagi</h2>
      <p>Masukkan nomor WhatsApp/HP agar kurir bisa menghubungimu.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button type="submit" className="btn-orange" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan & Lanjut"}
        </button>
      </form>
    </main>
  );
}