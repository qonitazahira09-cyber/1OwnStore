"use client";

import { Link } from "@/i18n/routing";
import Script from "next/script";
import { useState } from "react";
import styles from "./checkout.module.css";

// Interface untuk menambahkan tipe `snap` pada object window
declare global {
  interface Window {
    snap: any;
  }
}

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
  icon: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Keripik Apel Manalagi Premium",
    desc: "Pouch Alumunium Zipper 200g",
    price: 70000,
    qty: 2,
    icon: "🥔",
  },
  {
    id: "2",
    name: "Sari Apel Murni Brosem Batu",
    desc: "Botol Kaca Klasik 330ml",
    price: 48000,
    qty: 3,
    icon: "🧴",
  },
  {
    id: "3",
    name: "Keripik Tempe Sanan Daun Jeruk",
    desc: "Gurih Renyah Khas Sanan 250g",
    price: 22500,
    qty: 1,
    icon: "🍱",
  },
];

function formatRupiah(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export default function CheckoutPage() {
  const [products, setProducts] = useState(initialProducts);
  const [coupon, setCoupon] = useState("BATUKEREN");
  const [couponActive, setCouponActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // State Form Penerima
  const [name, setName] = useState("Budi Santoso");
  const [phone, setPhone] = useState("081234567890");

  const updateQty = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const ongkir = 12000;
  const packingFee = 0;
  const discount = couponActive ? 15000 : 0;
  const guaranteeFee = 1500;
  const total = subtotal + ongkir + packingFee - discount + guaranteeFee;

  // Fungsi Pemicu Pembayaran Midtrans
  const handlePayment = async () => {
    if (products.length === 0) {
      alert("Keranjang belanjaan kamu kosong!");
      return;
    }

    setLoading(true);

    try {
      // 1. Minta Snap Token dari Route Handler /api/tokenizer
      // Di dalam function handlePayment():
const response = await fetch("/api/tokenizer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orderId: `OWNSTORE-${Date.now()}`,
    grossAmount: total,
    customerDetails: {
      first_name: name,
      phone: phone,
    },
  }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat token transaksi");
      }

      // 2. Munculkan Pop-up Snap Midtrans
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            {/*alert("Pembayaran Berhasil! 🎉");*/}
            console.log("Success:", result);
            window.location.href = "/id/berhasil";
          },
          onPending: function (result: any) {
            alert("Menunggu Pembayaran! ⏳");
            console.log("Pending:", result);
          },
          onError: function (result: any) {
            alert("Pembayaran Gagal! ❌");
            console.log("Error:", result);
          },
          onClose: function () {
            alert("Kamu menutup pop-up sebelum menyelesaikan pembayaran.");
          },
        });
      } else {
        alert("Midtrans SDK belum siap, coba refresh halaman.");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Script Snap Midtrans Sandbox */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <main className={styles.wrapper}>
        <div className={styles.breadcrumb}>
          <span>Keranjang Belanja</span>
          <span>›</span>
          <span className={styles.active}>Checkout</span>
          <span>›</span>
          <span>Selesai &amp; Dikirim</span>
          <span className={styles.orderId}>
            Pesanan ID: <strong>#MF-2026-0892</strong>
          </span>
        </div>

        <div className={styles.card}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div>
              <h1 className={styles.title}>
                Checkout
                <span className={`${styles.pill} ${styles.pillPink}`}>
                  🔒 SSL Terenkripsi
                </span>
              </h1>
              <p className={styles.subtitle}>
                Selesaikan rincian pesanan dan konfirmasi checkout aman Anda.
              </p>
            </div>
            <span className={`${styles.pill} ${styles.pillGray}`}>
              {products.length} Produk Khas
            </span>
          </div>

          {/* Ringkasan produk */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.label}>Ringkasan Produk Belanja</span>
              <span className={`${styles.pill} ${styles.pillCream}`}>
                Pouch Khusus &amp; Safety Bubble Gratis
              </span>
            </div>

            {products.map((p) => (
              <div key={p.id} className={styles.productRow}>
                <div className={styles.productIcon}>{p.icon}</div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{p.name}</div>
                  <div className={styles.productDesc}>{p.desc}</div>
                  <div className={styles.productPrice}>
                    {formatRupiah(p.price)}
                  </div>
                </div>
                <div className={styles.stepper}>
                  <button onClick={() => updateQty(p.id, -1)} aria-label="Kurangi">
                    −
                  </button>
                  <span>{p.qty}</span>
                  <button onClick={() => updateQty(p.id, 1)} aria-label="Tambah">
                    +
                  </button>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeProduct(p.id)}
                  aria-label="Hapus produk"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Data penerima */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.label}>Data Penerima &amp; Pengiriman</span>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="nama">Nama Penerima</label>
                <input
                  id="nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="wa">Nomor WhatsApp / Telepon</label>
                <input
                  id="wa"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="alamat">Alamat Pengiriman Singkat</label>
                <input id="alamat" defaultValue="Klojen, Kota Malang (Jawa Timur)" />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor="catatan">Catatan Pengemasan (Opsional)</label>
                <input
                  id="catatan"
                  placeholder="Contoh: Titip di resepsionis hotel / kardus tebal"
                />
              </div>
            </div>
          </div>

          {/* Kurir */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.label}>Pilihan Jasa Kurir &amp; Ekspedisi</span>
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                Jaminan Garansi Anti Remuk
              </span>
            </div>

            <div className={styles.courierBox}>
              <div className={styles.courierTop}>
                <div className={styles.courierIcon}>🚚</div>
                <div className={styles.courierInfo}>
                  <div className={styles.courierName}>
                    SiCepat REG (Kilat Reguler)
                    <span className={`${styles.pill} ${styles.pillGray}`}>
                      PALING POPULER
                    </span>
                    <span className={`${styles.pill} ${styles.pillGreenOutline}`}>
                      Kupon Berlaku
                    </span>
                  </div>
                  <div className={styles.courierDesc}>
                    Estimasi 1 – 2 Hari Kerja • Lacak Resi Otomatis &amp; Safety
                    Bubble Gratis
                  </div>
                </div>
                <div className={styles.courierRight}>
                  <div className={styles.courierPrice}>Rp 12.000</div>
                  <button className={styles.changeBtn}>Ubah Kurir ›</button>
                </div>
              </div>
              <div className={styles.courierFooter}>
                <span className={styles.altText}>
                  Tersedia 3 opsi alternatif (Kurir Lokal Malang, JNE YES, Paxel
                  Cold)
                </span>
                <a href="#" className={styles.link}>
                  Lihat Semua Opsi →
                </a>
              </div>
            </div>
          </div>

          {/* Kupon */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.label}>Kupon / Voucher Toko</span>
            </div>
            <div className={styles.couponRow}>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              />
              <button
                className={styles.applyBtn}
                onClick={() => setCouponActive(true)}
              >
                Terapkan
              </button>
            </div>
            {couponActive && (
              <div className={styles.couponSuccess}>
                ✓ Kupon <strong>{coupon}</strong> aktif (Diskon Ongkir Khusus +
                Potongan Rp 15.000)
              </div>
            )}
          </div>

          {/* Ringkasan harga */}
          <div className={styles.priceList}>
            <div className={styles.priceRow}>
              <span>Subtotal Produk ({products.length} item)</span>
              <span className={styles.value}>{formatRupiah(subtotal)}</span>
            </div>
            <div className={styles.priceRow}>
              <span>Ongkos Kirim (SiCepat REG – 1–2 Hari)</span>
              <span className={styles.value}>{formatRupiah(ongkir)}</span>
            </div>
            <div className={`${styles.priceRow} ${styles.free}`}>
              <span>Biaya Kardus &amp; Safety Bubble Wrap</span>
              <span className={styles.value}>Rp 0 (Gratis Toko)</span>
            </div>
            {couponActive && (
              <div className={`${styles.priceRow} ${styles.discount}`}>
                <span>Potongan Kupon Promo ({coupon})</span>
                <span className={styles.value}>-{formatRupiah(discount)}</span>
              </div>
            )}
            <div className={styles.priceRow}>
              <span>Garansi Kesegaran Produk Khas Batu</span>
              <span className={styles.value}>{formatRupiah(guaranteeFee)}</span>
            </div>
          </div>

          {/* Total */}
          <div className={styles.totalBox}>
            <div>
              <div className={styles.totalLabel}>Total Tagihan:</div>
              <div className={styles.totalPrice}>{formatRupiah(total)}</div>
            </div>
            <span className={`${styles.pill} ${styles.pillGray}`}>
              Pajak Termasuk
            </span>
          </div>

          {/* Tombol CTA Checkout */}
          <button
            className={styles.checkoutBtn}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Buat Pesanan"}
          </button>

          <div className={styles.guarantee}>
            <div className={styles.strong}>
              🍎 Garansi 100% Produk Fresh Khas Malang
            </div>
            <p>
              Oleh-oleh asli langsung dipacking dari sentra pengrajin Sanan &amp;
              Batu. Terenkripsi 256-Bit SSL • Transaksi Dilindungi OJK &amp; BI.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <div className={styles.t}>Pasti Renyah &amp; Fresh</div>
            <div className={styles.d}>Langsung dari wajan penggorengan</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.t}>Packing Anti Remuk</div>
            <div className={styles.d}>Kardus tebal &amp; bubble wrap double</div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.t}>Bantuan Cepat WhatsApp</div>
            <div className={styles.d}>CS aktif 07.00 – 22.00 WIB</div>
          </div>
        </div>
      </main>
    </>
  );
}