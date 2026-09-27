"use client";

import { useState } from "react";
import Sprofile from "@/components/Sprofile";
import styles from "./pengaturanPro.module.css";
import { Link } from "@/i18n/routing";

// ==== TYPES ====
interface PaymentMethod {
  logo: string;
  name: string;
  detail: string;
  status: "utama" | "terhubung";
}

// ==== DUMMY DATA (ganti dengan data dari API) ====
const paymentMethods: PaymentMethod[] = [
  {
    logo: "BCA",
    name: "Virtual Account BCA",
    detail: "•••• 8291 (Utama)",
    status: "utama",
  },
  {
    logo: "QRIS",
    name: "QRIS Auto-Confirm",
    detail: "Terhubung",
    status: "terhubung",
  },
];

export default function PengaturanKeamananPage() {
  const [otpActive, setOtpActive] = useState(true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  return (
    <main className={styles.wrapper}>
      {/* Sidebar digantikan dengan komponen Sprofile seperti halaman Lacak */}
      <Sprofile />

      {/* ================= CONTENT ================= */}
      <section className={styles.content}>
        <div className={styles.headCard}>
          <p className={styles.eyebrow}>PENGATURAN AKUN</p>
          <h1 className={styles.title}>Pengaturan Akun &amp; Keamanan</h1>
          <p className={styles.desc}>
            Kelola preferensi keamanan, verifikasi dua langkah, sesi aktif, serta
            pengaturan notifikasi pesanan Malang Fresh Anda.
          </p>

          <hr className={styles.divider} />

          {/* ===== Keamanan Kata Sandi ===== */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <div>
                <p className={styles.cardTitle}>🔑 Keamanan Kata Sandi</p>
                <p className={styles.cardDesc}>
                  Kata sandi akun terakhir diperbarui <b>3 bulan lalu</b>. Disarankan
                  untuk mengganti kata sandi secara berkala guna melindungi data
                  transaksi Anda.
                </p>
              </div>
              <button className={styles.btnOutline}>Ubah Kata Sandi</button>
            </div>
          </div>

          {/* ===== Verifikasi 2 Langkah ===== */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <div>
                <p className={styles.cardTitle}>
                  🛡️ Verifikasi 2 Langkah (WhatsApp OTP){" "}
                  <span className={styles.tagActive}>Aktif</span>
                </p>
                <p className={styles.cardDesc}>
                  Tambahkan lapisan keamanan ekstra dengan menerima kode OTP
                  verifikasi via WhatsApp terdaftar saat transaksi penting atau
                  perubahan profil.
                </p>
              </div>
              <button
                className={`${styles.toggle} ${otpActive ? styles.toggleOn : ""}`}
                onClick={() => setOtpActive(!otpActive)}
                aria-pressed={otpActive}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          </div>

          {/* ===== Sesi Login Aktif ===== */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <p className={styles.cardTitle}>🖥️ Sesi Login Aktif</p>
              <button className={styles.linkButton}>Keluar Sesi Lain</button>
            </div>
            <div className={styles.sessionBox}>
              <span className={styles.sessionIcon}>🖥️</span>
              <div className={styles.sessionInfo}>
                <p className={styles.sessionName}>
                  Chrome di Windows 11 <span className={styles.onlineDotSmall} />
                </p>
                <p className={styles.sessionMeta}>
                  Kota Malang, Jawa Timur •{" "}
                  <span className={styles.sessionActive}>Aktif sekarang</span>
                </p>
              </div>
              <span className={styles.tagNeutral}>Perangkat Ini</span>
            </div>
          </div>

          {/* ===== Preferensi Notifikasi ===== */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>🔔 Preferensi Notifikasi &amp; Promo</p>
            <div className={styles.checkList}>
              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={notifWhatsapp}
                  onChange={() => setNotifWhatsapp(!notifWhatsapp)}
                  className={styles.checkbox}
                />
                Kirim update lacak pesanan langsung via <b>WhatsApp</b>
              </label>
              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={() => setNotifEmail(!notifEmail)}
                  className={styles.checkbox}
                />
                Dapatkan info panen apel segar, diskon musim panen &amp; bundling
                via <b>Email</b>
              </label>
              <label className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={() => setNotifSms(!notifSms)}
                  className={styles.checkbox}
                />
                Pemberitahuan SMS Darurat
              </label>
            </div>
          </div>

          {/* ===== Metode Pembayaran ===== */}
          <div className={styles.card}>
            <div className={styles.cardRow}>
              <p className={styles.cardTitle}>💳 Metode Pembayaran Tersimpan</p>
              <button className={styles.linkButton}>
                + Tambah Rekening atau Kartu Baru
              </button>
            </div>
            <div className={styles.paymentGrid}>
              {paymentMethods.map((pm) => (
                <div key={pm.name} className={styles.paymentBox}>
                  <span className={styles.paymentLogo}>{pm.logo}</span>
                  <div className={styles.paymentInfo}>
                    <p className={styles.paymentName}>{pm.name}</p>
                    <p
                      className={
                        pm.status === "terhubung"
                          ? styles.paymentDetailGreen
                          : styles.paymentDetail
                      }
                    >
                      {pm.detail}
                    </p>
                  </div>
                  {pm.status === "utama" && (
                    <span className={styles.tagPrimary}>Utama</span>
                  )}
                  {pm.status === "terhubung" && (
                    <span className={styles.checkMark}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.saveRow}>
            <button className={styles.btnSave}>
              💾 Simpan Perubahan Pengaturan
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}