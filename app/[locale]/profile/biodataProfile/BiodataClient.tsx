"use client";

import { useState } from "react";
import Sprofile from "@/components/Sprofile";
import styles from "./bidataPro.module.css";
import { Link } from "@/i18n/routing";

// ==== TYPES ====
interface Address {
  label: string;
  isPrimary?: boolean;
  receiver: string;
  fullAddress: string;
}

interface User {
  id: number;
  nama: string;
  email: string;
  whatsapp: string;
  email_verified: boolean;
}

// ==== DUMMY DATA alamat awal ====
const initialAddresses: Address[] = [
  {
    label: "Rumah Utama (Malang)",
    isPrimary: true,
    receiver: "Budi Santoso (+62 812-3456-7890)",
    fullAddress:
      "Jl. Raya Langsep No. 45, RT 02 / RW 05, Kel. Bareng, Kec. Klojen, Kota Malang, Jawa Timur 65116",
  },
  {
    label: "Villa Keluarga Batu",
    receiver: "Budi Santoso (+62 812-3456-7890)",
    fullAddress: "Jl. Oro-Oro Ombo No. 88, Kec. Batu, Kota Batu, Jawa Timur 65316",
  },
];

export default function BiodataClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nama: user.nama,
    whatsapp: user.whatsapp,
  });

  // ==== State alamat (dummy, disimpan di memori browser saja) ====
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    receiver: "",
    fullAddress: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddressChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  }

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();

    if (!addressForm.label || !addressForm.receiver || !addressForm.fullAddress) {
      return; // jangan submit kalau ada field kosong
    }

    const newAddress: Address = {
      label: addressForm.label,
      receiver: addressForm.receiver,
      fullAddress: addressForm.fullAddress,
      isPrimary: addresses.length === 0, // alamat pertama otomatis jadi utama
    };

    setAddresses([...addresses, newAddress]);
    setAddressForm({ label: "", receiver: "", fullAddress: "" });
    setShowAddressModal(false); // tutup modal, langsung balik ke halaman biodata dengan list terupdate
  }

  function handleSetPrimary(index: number) {
    setAddresses(
      addresses.map((addr, i) => ({
        ...addr,
        isPrimary: i === index,
      }))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan perubahan");
      }

      setMessage("Data berhasil diperbarui");
      setIsEditing(false);
      window.location.reload();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrapper}>
      <Sprofile />

      {/* ================= CONTENT ================= */}
      <section className={styles.content}>
        <div className={styles.headTop}>
          <div>
            <h1 className={styles.title}>Biodata Diri &amp; Informasi Akun</h1>
            <p className={styles.desc}>
              Kelola identitas pribadi, informasi kontak, dan alamat pengiriman Anda.
            </p>
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Batal" : "Ubah Data Diri"}
          </button>
        </div>

        {/* ================= CARD DATA PRIBADI ================= */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Data Pribadi &amp; Kontak</h2>
            <span className={styles.tagVerified}>Akun Terverifikasi</span>
          </div>

          <hr className={styles.divider} />

          {message && <p className={styles.value}>{message}</p>}

          {!isEditing ? (
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.label}>Nama Lengkap</p>
                <p className={styles.value}>{user.nama}</p>
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Alamat Email</p>
                <p className={styles.value}>
                  {user.email}{" "}
                  {user.email_verified && (
                    <span className={styles.tagStatus}>• Terverifikasi</span>
                  )}
                </p>
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Nomor WhatsApp / HP</p>
                <p className={styles.value}>
                  {user.whatsapp}{" "}
                  <span className={styles.tagStatus}>✓ Terhubung</span>
                </p>
              </div>
            </div>
          ) : (
            <form className={styles.fieldGrid} onSubmit={handleSave}>
              <div className={styles.field}>
                <p className={styles.label}>Nama Lengkap</p>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className={styles.value}
                  style={{ border: "1px solid #ccc", borderRadius: 8, padding: 4 }}
                />
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Alamat Email</p>
                <p className={styles.value}>{user.email} (tidak bisa diubah)</p>
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Nomor WhatsApp / HP</p>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className={styles.value}
                  style={{ border: "1px solid #ccc", borderRadius: 8, padding: 4 }}
                />
              </div>

              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          )}
        </div>

        {/* ================= CARD ALAMAT ================= */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Daftar Alamat Pengiriman</h2>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setShowAddressModal(true)}
            >
              + Tambah Alamat Baru
            </button>
          </div>

          <div className={styles.addressList}>
            {addresses.map((addr, index) => (
              <div
                key={addr.label + index}
                className={`${styles.addressCard} ${
                  addr.isPrimary ? styles.addressCardPrimary : ""
                }`}
              >
                <div className={styles.addressHead}>
                  <p className={styles.addressLabel}>
                    {addr.label}
                    {addr.isPrimary && <span className={styles.tagPrimary}>Utama</span>}
                  </p>
                  <div className={styles.addressActions}>
                    {!addr.isPrimary && (
                      <>
                        <button
                          type="button"
                          className={styles.linkButtonMuted}
                          onClick={() => handleSetPrimary(index)}
                        >
                          Jadikan Utama
                        </button>
                        <span className={styles.actionSeparator}>|</span>
                      </>
                    )}
                    <button type="button" className={styles.linkButton}>
                      Edit Alamat
                    </button>
                  </div>
                </div>
                <p className={styles.addressReceiver}>{addr.receiver}</p>
                <p className={styles.addressFull}>{addr.fullAddress}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODAL TAMBAH ALAMAT ================= */}
      {showAddressModal && (
        <div
          className={styles.overlay}
          onClick={() => setShowAddressModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Tambah Alamat Baru</h2>
            <p className={styles.modalDesc}>
              Lengkapi data alamat pengiriman baru kamu di bawah ini.
            </p>

            <form className={styles.modalForm} onSubmit={handleAddAddress}>
              <div className={styles.field}>
                <p className={styles.label}>Label Alamat</p>
                <input
                  type="text"
                  name="label"
                  placeholder="Contoh: Rumah, Kantor, Kos"
                  value={addressForm.label}
                  onChange={handleAddressChange}
                  className={styles.modalInput}
                  required
                />
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Nama Penerima &amp; No. HP</p>
                <input
                  type="text"
                  name="receiver"
                  placeholder="Contoh: Budi Santoso (+62 812-3456-7890)"
                  value={addressForm.receiver}
                  onChange={handleAddressChange}
                  className={styles.modalInput}
                  required
                />
              </div>

              <div className={styles.field}>
                <p className={styles.label}>Alamat Lengkap</p>
                <textarea
                  name="fullAddress"
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                  value={addressForm.fullAddress}
                  onChange={handleAddressChange}
                  className={styles.modalTextarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setShowAddressModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}