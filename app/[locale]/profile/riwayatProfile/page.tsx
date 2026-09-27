import Sprofile from "@/components/Sprofile";
import styles from "./riwayatPro.module.css";
import { Link } from "@/i18n/routing";

// ==== TYPES ====
type OrderStatus = "selesai" | "dibatalkan";

interface Action {
  label: string;
  variant: "outline" | "highlight" | "primary";
}

interface Order {
  orderNo: string;
  date: string;
  courier: string;
  status: OrderStatus;
  icon: string;
  productName: string;
  productDesc: string;
  price: string;
  actions: Action[];
}

// ==== DUMMY DATA (ganti dengan data dari API) ====
const orders: Order[] = [
  {
    orderNo: "#MF-2026-0741",
    date: "12 Agustus 2026",
    courier: "JNE YES",
    status: "selesai",
    icon: "🎁",
    productName: "Paket Spesial Liburan Batu",
    productDesc: "1 paket komplit (Apel Manalagi, Keripik & Sari Buah)",
    price: "Rp 245.000",
    actions: [
      { label: "Unduh Invoice", variant: "outline" },
      { label: "⭐ Beri Ulasan Bintang 5", variant: "highlight" },
      { label: "Beli Lagi", variant: "primary" },
    ],
  },
  {
    orderNo: "#MF-2026-0618",
    date: "28 Juli 2026",
    courier: "Paxel",
    status: "selesai",
    icon: "🍯",
    productName: "Keripik Nangka Super & Pia Apel Madu",
    productDesc: "2 barang (200gr keripik, 1 kotak pia isi 8)",
    price: "Rp 87.500",
    actions: [
      { label: "Lihat Rincian", variant: "outline" },
      { label: "Beli Lagi", variant: "primary" },
    ],
  },
  {
    orderNo: "#MF-2026-0504",
    date: "15 Mei 2026",
    courier: "J&T Cargo",
    status: "selesai",
    icon: "🧃",
    productName: "Sari Apel Murni Brosem",
    productDesc: "1 dus (24 botol 120ml)",
    price: "Rp 45.000",
    actions: [
      { label: "Lihat Rincian", variant: "outline" },
      { label: "Beli Lagi", variant: "primary" },
    ],
  },
];

const tabs = [
  { label: "Semua", active: true },
  { label: "Selesai (10)" },
  { label: "Dibatalkan (1)" },
];

export default function RiwayatBelanjaPage() {
  return (
    <main className={styles.wrapper}>
      {/* Sidebar digantikan dengan komponen Sprofile seperti halaman Lacak */}
      <Sprofile />

      {/* ================= CONTENT ================= */}
      <section className={styles.content}>
        <div className={styles.headTop}>
          <div>
            <h1 className={styles.title}>Riwayat Belanja &amp; Pesanan</h1>
            <p className={styles.desc}>
              Pantau rekam jejak pesanan oleh-oleh dan pembelian produk Anda.
            </p>
          </div>
          <div className={styles.totalBox}>
            <span className={styles.totalIcon}>🎀</span>
            <div>
              <p className={styles.totalLabel}>Total Transaksi</p>
              <p className={styles.totalValue}>11 Pesanan</p>
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className={styles.filterBar}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`${styles.tab} ${tab.active ? styles.tabActive : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Cari nomor pesanan..."
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search preview-icon"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg></span>
          </div>
        </div>

        {/* ================= LIST PESANAN ================= */}
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.orderNo} className={styles.orderCard}>
              <div className={styles.orderHead}>
                <p className={styles.orderMeta}>
                  <span className={styles.orderNo}>{order.orderNo}</span>
                  <span className={styles.dotSep}>•</span>
                  <span>{order.date}</span>
                  <span className={styles.dotSep}>•</span>
                  <span className={styles.tagNeutral}>{order.courier}</span>
                </p>
                <span className={styles.tagSuccess}>✓ Selesai</span>
              </div>

              <hr className={styles.divider} />

              <div className={styles.productRow}>
                <div className={styles.productLeft}>
                  <span className={styles.productIcon}>{order.icon}</span>
                  <div>
                    <p className={styles.productName}>{order.productName}</p>
                    <p className={styles.productDesc}>{order.productDesc}</p>
                  </div>
                </div>
                <div className={styles.productRight}>
                  <p className={styles.label}>Total Belanja</p>
                  <p className={styles.price}>{order.price}</p>
                </div>
              </div>

              <div className={styles.actionRow}>
                {order.actions.map((action) => (
                  <button
                    key={action.label}
                    className={
                      action.variant === "primary"
                        ? styles.btnPrimary
                        : action.variant === "highlight"
                        ? styles.btnHighlight
                        : styles.btnOutline
                    }
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>Sebelumnya</button>
          <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>Selanjutnya</button>
        </div>
      </section>
    </main>
  );
}