import Sprofile from "@/components/Sprofile";
import styles from "./statusPem.module.css";
import { Link } from "@/i18n/routing";

// ==== TYPES ====
interface HistoryItem {
  invoiceNo: string;
  productName: string;
  date: string;
  price: string;
}

// ==== DUMMY DATA (ganti dengan data dari API) ====
const history: HistoryItem[] = [
  {
    invoiceNo: "#MF-2026-0812",
    productName: "Keripik Apel Super Crispy (10 Pcs)",
    date: "20 Feb 2026",
    price: "Rp 195.000",
  },
  {
    invoiceNo: "#MF-2026-0744",
    productName: "Sari Apel Murni 1 Liter (2 Botol)",
    date: "14 Jan 2026",
    price: "Rp 85.000",
  },
];

export default function StatusPembayaranPage() {
  return (
    <main className={styles.wrapper}>
      {/* Sidebar digantikan dengan komponen Sprofile seperti halaman Lacak */}
      <Sprofile />

      {/* ================= CONTENT ================= */}
      <section className={styles.content}>
        <div className={styles.headTop}>
          <div>
            <h1 className={styles.title}>Status Pembayaran &amp; Tagihan</h1>
            <p className={styles.desc}>
              Periksa tagihan aktif pesanan Anda dan unduh bukti pelunasan.
            </p>
          </div>
          <span className={styles.waitingBadge}>
            <span className={styles.waitingDot} />
            1 Menunggu Pembayaran
          </span>
        </div>

        {/* ================= CARD TAGIHAN AKTIF ================= */}
        <div className={styles.card}>
          <div className={styles.invoiceHead}>
            <div className={styles.invoiceLeft}>
              <span className={styles.invoiceIcon}>🧾</span>
              <div>
                <p className={styles.invoiceTitle}>
                  Invoice #MF-2026-0901{" "}
                  <span className={styles.tagNeutral}>Paket Bundling</span>
                </p>
                <p className={styles.subtleText}>
                  Dibuat: 26 Feb 2026 • 10:15 WIB
                </p>
              </div>
            </div>
            <span className={styles.countdownBadge}>
              ⏱ Batas Waktu: 23 Jam 40 Menit Lagi
            </span>
          </div>

          <hr className={styles.divider} />

          <div className={styles.summaryRow}>
            <div>
              <p className={styles.sectionLabel}>RINGKASAN PAKET</p>
              <p className={styles.productName}>
                Paket Bundling Khas Kota Batu (Pia Apel &amp; Sirup Manalagi)
              </p>
              <p className={styles.subtleText}>
                Termasuk kemasan besek anyaman &amp; bubble wrap aman.
              </p>
            </div>
            <div className={styles.summaryRight}>
              <p className={styles.label}>TOTAL TAGIHAN</p>
              <p className={styles.price}>Rp 140.500</p>
            </div>
          </div>

          <hr className={styles.divider} />

          <p className={styles.sectionLabel}>PILIH / SELESAIKAN PEMBAYARAN</p>
          <div className={styles.payMethods}>
            <div className={styles.payBox}>
              <div className={styles.payBoxHead}>
                <p className={styles.payBoxTitle}>BCA Virtual Account</p>
                <span className={styles.tagOutline}>BCA</span>
              </div>
              <p className={styles.vaNumber}>8801 2345 6789 001</p>
              <p className={styles.subtleText}>a/n Malang Fresh Official</p>
              <button className={styles.linkButton}>📋 Salin Nomor VA</button>
            </div>

            <div className={styles.payBox}>
              <div className={styles.payBoxHead}>
                <p className={styles.payBoxTitle}>QRIS Dinamis</p>
                <span className={styles.tagOutline}>QRIS</span>
              </div>
              <div className={styles.qrisRow}>
                <p className={styles.subtleText}>
                  Scan instan via GoPay, OVO, ShopeePay, atau m-Banking.
                </p>
                <span className={styles.qrisIcon}>📱</span>
              </div>
            </div>
          </div>

          <div className={styles.infoBox}>
            ℹ️ Pembayaran via QRIS atau VA akan diverifikasi secara otomatis dalam
            1-3 menit. Jika membayar via transfer manual bank lain, silakan unggah
            bukti transfer.
          </div>

          <div className={styles.actionRow}>
            <button className={styles.btnOutline}>
              📎 Unggah Bukti Transfer
            </button>
            <button className={styles.btnPrimary}>
              🧾 Bayar via QRIS Sekarang
            </button>
          </div>
        </div>

        {/* ================= CARD RIWAYAT ================= */}
        <div className={styles.card}>
          <div className={styles.historyHead}>
            <h2 className={styles.historyTitle}>
              Riwayat Pembayaran Sebelumnya
            </h2>
            <span className={styles.subtleText}>
              Menampilkan pembayaran sukses
            </span>
          </div>

          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.invoiceNo} className={styles.historyItem}>
                <span className={styles.checkIcon}>✓</span>
                <div className={styles.historyInfo}>
                  <p className={styles.historyInvoice}>
                    {item.invoiceNo} <span className={styles.tagSuccess}>Lunas</span>
                  </p>
                  <p className={styles.subtleText}>
                    {item.productName} • {item.date}
                  </p>
                </div>
                <div className={styles.historyRight}>
                  <p className={styles.historyPrice}>{item.price}</p>
                  <button className={styles.btnOutlineSmall}>
                    📄 Kwitansi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}