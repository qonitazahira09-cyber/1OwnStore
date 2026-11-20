"use client";

// app/[locale]/cart/page.tsx
import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import "./cart.css";

type CartItem = {
  id: number;
  produkId: number;
  nama: string;
  kategori: string;
  gambar: string;
  varian: string;
  ukuran: string;
  jumlah: number;
  harga: number;
  subtotal: number;
};

type CartData = {
  items: CartItem[];
  total: number;
  jumlahItem: number;
  jumlahBarang: number;
};

const MAX_QTY = 99;
const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
const JSON_HEADERS = { "Content-Type": "application/json" };

export default function CartPage() {
  const router = useRouter();
  const [data, setData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const firstLoad = useRef(true);

    async function load() {
    try {
      const res = await fetch("/api/keranjang", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/masuk");
        return;
      }
      if (!res.ok) throw new Error("gagal");

      const json: CartData = await res.json();
      setData(json);

      const ids = json.items.map((i) => i.id);
      if (firstLoad.current) {
        firstLoad.current = false;
        setSelected(new Set(ids)); // pertama kali: semua tercentang
      } else {
        // buang id yang sudah dihapus dari pilihan
        setSelected((prev) => new Set(ids.filter((id) => prev.has(id))));
      }

      setError("");
    } catch {
      setError("Gagal memuat keranjang. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ubahJumlah(item: CartItem, jumlahBaru: number) {
    if (busyId !== null) return;
    if (jumlahBaru < 1 || jumlahBaru > MAX_QTY) return;
    setBusyId(item.id);
    try {
      const res = await fetch("/api/keranjang", {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify({ id: item.id, jumlah: jumlahBaru }),
      });
      if (res.status === 401) {
        router.push("/masuk");
        return;
      }
      if (!res.ok) {
        setError("Gagal mengubah jumlah.");
        return;
      }
      await load();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Koneksi bermasalah, coba lagi.");
    } finally {
      setBusyId(null);
    }
  }

  async function hapus(item: CartItem) {
    if (busyId !== null) return;
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/keranjang?id=${item.id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/masuk");
        return;
      }
      if (!res.ok) {
        setError("Gagal menghapus item.");
        return;
      }
      await load();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Koneksi bermasalah, coba lagi.");
    } finally {
      setBusyId(null);
    }
  }

  function toggleItem(id: number) {
  setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

function toggleAll() {
  const all = data?.items ?? [];
  setSelected(
    selected.size === all.length ? new Set() : new Set(all.map((i) => i.id))
  );
}

  const items = data?.items ?? [];
const selectedItems = items.filter((i) => selected.has(i.id));
const selectedTotal = selectedItems.reduce((n, i) => n + i.subtotal, 0);
const selectedQty = selectedItems.reduce((n, i) => n + i.jumlah, 0);
const allChecked = items.length > 0 && selectedItems.length === items.length;

  return (
    <main className="cart-page">
      <div className="section-container">
        <div className="cart-title-row">
          <h1>Shopping Cart.</h1>
          {data && items.length > 0 && (
            <span className="items-selected">{selectedQty} BARANG DIPILIH</span>
          )}
        </div>
        <div className="title-underline"></div>

        {error && <p className="cart-error">{error}</p>}

        {loading && <p className="cart-empty">Memuat keranjang...</p>}

        {!loading && data && items.length === 0 && (
          <div className="cart-empty">
            <p>Keranjangmu masih kosong.</p>
            <Link href="/katalog" className="back-link">
              &rsaquo; Mulai Belanja Oleh-Oleh Khas Malang
            </Link>
          </div>
        )}

        {!loading && data && items.length > 0 && (
          <div className="cart-layout">
            <div className="cart-left">
              <div className="cart-table-head">
                <span className="col-produk">PRODUK</span>
                <span className="col-varian">VARIAN</span>
                <span className="col-jumlah">JUMLAH</span>
                <span className="col-total">TOTAL HARGA</span>
              </div>

              <label className="select-all">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                <span>Pilih semua ({items.length})</span>
              </label>

              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-main">
                    <input
  type="checkbox"
  className="item-check"
  aria-label={`Pilih ${item.nama}`}
  checked={selected.has(item.id)}
  onChange={() => toggleItem(item.id)}
/>
                    <div className="item-thumb">
                      <span className="badge badge-bestseller">
                        {item.kategori.toUpperCase()}
                      </span>
                      <img src={item.gambar} alt={item.nama} />
                    </div>
                    <div className="item-info">
                      <h3>
                        <Link href={`/katalog/${item.produkId}`}>{item.nama}</Link>
                      </h3>
                      <p>{rupiah(item.harga)} / satuan</p>
                    </div>
                  </div>

                  <div className="item-variant-text">
                    {item.varian && <span>{item.varian}</span>}
                    {item.ukuran && <span>{item.ukuran}</span>}
                    {!item.varian && !item.ukuran && <span>-</span>}
                  </div>

                  <div className="item-qty">
                    <button
                      className="qty-btn"
                      aria-label="Kurangi"
                      disabled={busyId === item.id || item.jumlah <= 1}
                      onClick={() => ubahJumlah(item, item.jumlah - 1)}
                    >
                      &minus;
                    </button>
                    <span>{item.jumlah}</span>
                    <button
                      className="qty-btn"
                      aria-label="Tambah"
                      disabled={busyId === item.id || item.jumlah >= MAX_QTY}
                      onClick={() => ubahJumlah(item, item.jumlah + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    <span className="item-price">{rupiah(item.subtotal)}</span>
                    <button
                      className="remove-btn"
                      aria-label="Hapus item"
                      disabled={busyId === item.id}
                      onClick={() => hapus(item)}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}

              <Link href="/katalog" className="back-link">
                &rsaquo; Lanjut Belanja Oleh-Oleh Lainnya
              </Link>
            </div>
            <aside className="cart-right">
              <div className="summary-card">
                <div className="summary-head">
                  <h2>Ringkasan Pesanan</h2>
                  <span className="summary-tag">{selectedQty} Barang</span>
                </div>

                <div className="summary-lines">
                  <div className="summary-line">
                    <span>Subtotal ({selectedItems.length} produk dipilih)</span>
                    <span>{rupiah(selectedTotal)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Ongkos Kirim</span>
                    <span>Dihitung di checkout</span>
                  </div>
                </div>

                <div className="total-box">
                  <div className="total-left">
                    <span>Total Tagihan</span>
                    <strong>{rupiah(selectedTotal)}</strong>
                  </div>
                </div>

                <button
                  className="checkout-btn"
                  disabled={selectedItems.length === 0}
                  onClick={() =>
                    router.push(`/checkout?items=${selectedItems.map((i) => i.id).join(",")}`)
                  }
                >
                  {selectedItems.length === 0 ? "Pilih produk dulu" : "Lanjut ke Checkout"}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <p className="secure-note">
                  🔒 100% Produk Fresh &amp; Asli Khas Malang &bull; Transaksi Aman
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
