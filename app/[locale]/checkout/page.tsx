"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Link, useRouter } from "@/i18n/routing";
import styles from "./checkout.module.css";

declare global {
  interface Window {
    snap: any;
  }
}

type Item = {
  id: number;
  nama: string;
  gambar: string;
  varian: string;
  ukuran: string;
  jumlah: number;
  harga: number;
  subtotal: number;
};

type CheckoutData = {
  items: Item[];
  subtotal: number;
  ongkir: number;
  biayaGaransi: number;
  total: number;
};

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function CheckoutPage() {
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [ids, setIds] = useState<string>("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [paying, setPaying] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [alamat, setAlamat] = useState("Klojen, Kota Malang (Jawa Timur)");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("items") ?? "";
    setIds(raw);

    if (!raw) {
      setPageError("Belum ada produk yang dipilih.");
      setPageLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/checkout?items=${encodeURIComponent(raw)}`, {
          cache: "no-store",
        });
        if (res.status === 401) {
          router.push("/masuk");
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          setPageError(json.message || "Gagal memuat checkout.");
          return;
        }
        setData(json);
      } catch {
        setPageError("Koneksi bermasalah, coba muat ulang.");
      } finally {
        setPageLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
  if (!data || data.items.length === 0) return;
  if (!name.trim() || !phone.trim()) {
    alert("Nama dan nomor telepon wajib diisi.");
    return;
  }

  setPaying(true);
  try {
    const response = await fetch("/api/tokenizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: data.items.map((i) => i.id),
        alamat,
        catatan,
        customerDetails: { first_name: name, phone },
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Gagal membuat token transaksi");

    if (!window.snap) {
      alert("Midtrans SDK belum siap, coba refresh halaman.");
      return;
    }

    const orderId: string = result.orderId;

    // Minta server mengecek status ke Midtrans (cadangan kalau webhook belum sampai)
    const sinkron = async () => {
      try {
        await fetch("/api/pesanan/sinkron", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
      } catch {
        /* diabaikan; webhook tetap jalan */
      }
    };

    window.snap.pay(result.token, {
      onSuccess: async () => {
        await sinkron();
        window.location.href = `/id/berhasil?order=${orderId}`;
      },
      onPending: async () => {
        await sinkron();
        alert("Menunggu pembayaran! ⏳ Selesaikan pembayaran sesuai instruksi.");
      },
      onError: () => alert("Pembayaran gagal! ❌"),
      onClose: () => alert("Kamu menutup pop-up sebelum menyelesaikan pembayaran."),
    });
  } catch (err: any) {
    alert("Terjadi kesalahan: " + err.message);
    console.error(err);
  } finally {
    setPaying(false);
  }
};

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <main className={styles.wrapper}>
        <div className={styles.breadcrumb}>
          <Link href="/cart">Keranjang Belanja</Link>
          <span>›</span>
          <span className={styles.active}>Checkout</span>
          <span>›</span>
          <span>Selesai &amp; Dikirim</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h1 className={styles.title}>
                Checkout
                <span className={`${styles.pill} ${styles.pillPink}`}>🔒 SSL Terenkripsi</span>
              </h1>
              <p className={styles.subtitle}>
                Selesaikan rincian pesanan dan konfirmasi checkout aman Anda.
              </p>
            </div>
            {data && (
              <span className={`${styles.pill} ${styles.pillGray}`}>
                {data.items.length} Produk Khas
              </span>
            )}
          </div>

          {pageLoading && <p className={styles.state}>Memuat pesanan...</p>}

          {!pageLoading && pageError && (
            <div className={styles.state}>
              <p>{pageError}</p>
              <Link href="/cart" className={styles.link}>← Kembali ke keranjang</Link>
            </div>
          )}

          {!pageLoading && data && (
            <>
              {/* Ringkasan produk (hanya baca) */}
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <span className={styles.label}>Ringkasan Produk Belanja</span>
                  <Link href="/cart" className={styles.link}>Ubah di keranjang</Link>
                </div>

                {data.items.map((p) => (
                  <div key={p.id} className={styles.productRow}>
                    <div className={styles.productIcon}>
                      <img src={p.gambar} alt={p.nama} className={styles.productImg} />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{p.nama}</div>
                      <div className={styles.productDesc}>
                        {[p.varian, p.ukuran].filter(Boolean).join(" • ") || "-"}
                      </div>
                      <div className={styles.productPrice}>
                        {rupiah(p.harga)} × {p.jumlah}
                      </div>
                    </div>
                    <div className={styles.lineTotal}>{rupiah(p.subtotal)}</div>
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
                    <input id="nama" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="wa">Nomor WhatsApp / Telepon</label>
                    <input id="wa" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className={`${styles.field} ${styles.full}`}>
                    <label htmlFor="alamat">Alamat Pengiriman Singkat</label>
                    <input id="alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
                  </div>
                  <div className={`${styles.field} ${styles.full}`}>
                    <label htmlFor="catatan">Catatan Pengemasan (Opsional)</label>
                    <input
  id="catatan"
  value={catatan}
  onChange={(e) => setCatatan(e.target.value)}
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
                      <div className={styles.courierName}>SiCepat REG (Kilat Reguler)</div>
                      <div className={styles.courierDesc}>
                        Estimasi 1 – 2 Hari Kerja • Lacak Resi Otomatis &amp; Safety Bubble Gratis
                      </div>
                    </div>
                    <div className={styles.courierRight}>
                      <div className={styles.courierPrice}>{rupiah(data.ongkir)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ringkasan harga */}
              <div className={styles.priceList}>
                <div className={styles.priceRow}>
                  <span>Subtotal Produk ({data.items.length} item)</span>
                  <span className={styles.value}>{rupiah(data.subtotal)}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Ongkos Kirim (SiCepat REG)</span>
                  <span className={styles.value}>{rupiah(data.ongkir)}</span>
                </div>
                <div className={`${styles.priceRow} ${styles.free}`}>
                  <span>Biaya Kardus &amp; Safety Bubble Wrap</span>
                  <span className={styles.value}>Rp 0 (Gratis Toko)</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Garansi Kesegaran Produk Khas Batu</span>
                  <span className={styles.value}>{rupiah(data.biayaGaransi)}</span>
                </div>
              </div>

              <div className={styles.totalBox}>
                <div>
                  <div className={styles.totalLabel}>Total Tagihan:</div>
                  <div className={styles.totalPrice}>{rupiah(data.total)}</div>
                </div>
              </div>

              <button className={styles.checkoutBtn} onClick={handlePayment} disabled={paying}>
                {paying ? "Memproses..." : "Buat Pesanan"}
              </button>

              <div className={styles.guarantee}>
                <div className={styles.strong}>🍎 Garansi 100% Produk Fresh Khas Malang</div>
                <p>
                  Oleh-oleh asli langsung dipacking dari sentra pengrajin Sanan &amp; Batu.
                  Terenkripsi 256-Bit SSL.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}