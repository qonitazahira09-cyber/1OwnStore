'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LupaPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verifikasi Email (Langkah 1)
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Panggil API backend kamu untuk cek apakah email terdaftar
      // Contoh fetch:
      // const res = await fetch('/api/auth/check-email', { method: 'POST', body: JSON.stringify({ email }) });
      // if (!res.ok) throw new Error('Email tidak ditemukan');

      // Jika email valid, lanjut ke Langkah 2
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Email tidak terdaftar');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password Baru (Langkah 2)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      // PROSES PANGGIL API BACKEND
      const res = await fetch('/api/auth/resetPw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px' }}>Lupa Password</h2>

      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

      {success ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            Password berhasil diubah!
          </p>
          <Link href="/masuk" className="btn-orange" style={{ display: 'inline-block', marginTop: '15px', textDecoration: 'none' }}>
            Masuk Kembali
          </Link>
        </div>
      ) : step === 1 ? (
        /* --- FORM LANGKAH 1: VERIFIKASI EMAIL --- */
        <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <p>Masukkan email yang terdaftar untuk mencari akunmu:</p>
          <input
            type="email"
            placeholder="Masukkan email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            className="btn-orange"
            disabled={loading}
            style={{ padding: '12px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Mengecek Email...' : 'Lanjutkan'}
          </button>
        </form>
      ) : (
        /* --- FORM LANGKAH 2: INPUT PASSWORD BARU --- */
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <p>Buat kata sandi baru untuk akun <b>{email}</b>:</p>
          <input
            type="password"
            placeholder="Kata sandi baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Konfirmasi kata sandi baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            className="btn-orange"
            disabled={loading}
            style={{ padding: '12px', borderRadius: '9999px', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Memproses...' : 'Simpan Password Baru'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <Link href="/masuk" style={{ color: '#d97706', textDecoration: 'none', fontSize: '14px' }}>
          ← Kembali ke Halaman Masuk
        </Link>
      </div>
    </main>
  );

  
}