import Sprofile from "@/components/Sprofile";
import styles from "./lacak.module.css";
import { Link } from "@/i18n/routing";

// ==== TYPES ====
type StepStatus = "done" | "active" | "waiting";

interface Step {
  no: number;
  icon: string; // emoji untuk step aktif
  title: string;
  subtitle: string;
  status: StepStatus;
  statusLabel: string;
}

interface LogItem {
  title: string;
  time: string;
  latest?: boolean;
}

// ==== DUMMY DATA (ganti dengan data dari API) ====
const steps: Step[] = [
  {
    no: 1,
    icon: "✓",
    title: "Pesanan Dikonfirmasi",
    subtitle: "Dipacking Rapi & Segel Aman",
    status: "done",
    statusLabel: "Selesai",
  },
  {
    no: 2,
    icon: "✓",
    title: "Diserahkan ke Kurir",
    subtitle: "Drop Point JNE Batu",
    status: "done",
    statusLabel: "Selesai",
  },
  {
    no: 3,
    icon: "🛵",
    title: "Dalam Perjalanan",
    subtitle: "Menuju Hub Kota Surabaya",
    status: "active",
    statusLabel: "Sedang Berjalan",
  },
  {
    no: 4,
    icon: "4",
    title: "Pesanan Diterima",
    subtitle: "Tanda tangan penerima",
    status: "waiting",
    statusLabel: "Menunggu",
  },
];

const logs: LogItem[] = [
  {
    title: "Paket dalam perjalanan darat via Tol Pandaan menuju Hub Transit Surabaya",
    time: "14 Agustus 2026 • 18:40 WIB",
    latest: true,
  },
  {
    title: "Tiba di Sorting Warehouse Malang Sentral untuk proses scan barcode",
    time: "14 Agustus 2026 • 14:15 WIB",
  },
  {
    title: "Paket berhasil dijemput oleh kurir JNE dari Rumah Produksi Malang Fresh Batu",
    time: "14 Agustus 2026 • 09:30 WIB",
  },
  {
    title: "Pesanan dikemas rapi dengan proteksi ganda oleh tim fulfillment",
    time: "14 Agustus 2026 • 08:00 WIB",
  },
];

export default function LacakPesananPage() {
  return (
    <main className={styles.wrapper}>
      <Sprofile />

      {/* ================= CONTENT ================= */}
      <section className={styles.content}>
        <div className={styles.headTop}>
          <div>
            <span className={styles.statusBadge}>Pesanan Dalam Pengiriman</span>
            <h1 className={styles.title}>Lacak Pesanan &amp; Pengiriman</h1>
            <p className={styles.desc}>
              Pantau status real-time perjalanan paket oleh-oleh khas Malang
              langsung dari rumah Anda.
            </p>
          </div>
          <div className={styles.headActions}>
            <button className={styles.btnOutline}> Salin No. Resi</button>
            <button className={styles.btnPrimary}> Hubungi Kurir / CS WA</button>
          </div>
        </div>

        <div className={styles.card}>
          {/* Info pesanan */}
          <div className={styles.orderInfo}>
            <div>
              <p className={styles.label}>NOMOR PESANAN &amp; RESI</p>
              <p className={styles.orderNumber}>
                #MF-2026-082910 <span className={styles.resiHighlight}>MLG-882910</span>
              </p>
              <p className={styles.subtleText}>Ekspedisi: JNE YES Kilat (1 Hari Sampai)</p>
            </div>
            <div className={styles.orderInfoRight}>
              <p className={styles.label}>ESTIMASI TIBA</p>
              <p className={styles.eta}>Besok Sore, 15 Agustus 2026</p>
              <p className={styles.subtleText}>Tujuan: Surabaya Barat, Jawa Timur</p>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Progress steps */}
          <p className={styles.sectionLabel}>STATUS PROGRES PENGIRIMAN</p>
          <div className={styles.steps}>
            {steps.map((step) => (
              <div
                key={step.no}
                className={`${styles.step} ${
                  step.status === "active" ? styles.stepActive : ""
                }`}
              >
                <span
                  className={`${styles.stepIcon} ${
                    step.status === "done"
                      ? styles.stepIconDone
                      : step.status === "active"
                      ? styles.stepIconActive
                      : styles.stepIconWaiting
                  }`}
                >
                  {step.icon}
                </span>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepSubtitle}>{step.subtitle}</p>
                <span
                  className={`${styles.stepStatus} ${
                    step.status === "done"
                      ? styles.stepStatusDone
                      : step.status === "active"
                      ? styles.stepStatusActive
                      : styles.stepStatusWaiting
                  }`}
                >
                  {step.statusLabel}
                </span>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          {/* Rincian produk */}
          <p className={styles.sectionLabel}>RINCIAN PAKET OLEH-OLEH</p>
          <div className={styles.product}>
            <div className={styles.productLeft}>
              <span className={styles.productIcon}>🍎</span>
              <div>
                <p className={styles.productName}>Paket Spesial Liburan Batu (Komplit)</p>
                <p className={styles.subtleText}>
                  Keripik Apel Manalagi 250g (x2), Pia Apel Madu (x1), Sari Apel
                  Brosem 350ml (x3)
                </p>
                {/*<span className={styles.tag}>Free Box Karton Tebal &amp; Bubblewrap</span>*/}
              </div>
            </div>
            <div className={styles.productRight}>
              <p className={styles.label}>Total Pembayaran</p>
              <p className={styles.price}>Rp 189.500</p>
              <p className={styles.paidText}>Lunas via QRIS</p>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Log riwayat */}
          <p className={styles.sectionLabel}>LOG RIWAYAT PELACAKAN TERKINI</p>
          <ul className={styles.log}>
            {logs.map((log, i) => (
              <li key={i} className={styles.logItem}>
                <span
                  className={`${styles.logDot} ${
                    log.latest ? styles.logDotLatest : ""
                  }`}
                />
                <div>
                  <p className={styles.logTitle}>{log.title}</p>
                  <p className={styles.logTime}>{log.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}