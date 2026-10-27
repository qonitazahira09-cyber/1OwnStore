"use client";

import styles from "./kelola.module.css";
import React, { useMemo, useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Helper & Utilities                                                */
/* ------------------------------------------------------------------ */

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const formatRupiah = (value: number) => "Rp " + value.toLocaleString("id-ID");

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */

const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 12.5 12.5 20a2 2 0 0 1-2.8 0l-6.7-6.7a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h6.9c.5 0 1 .2 1.4.6l6.7 6.7a2 2 0 0 1 .1 2.2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" />
  </svg>
);

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconBag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="m5 13 4.5 4.5L19 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

const IconCartOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" />
    <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7h12Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Types & Initial Sample Data                                       */
/* ------------------------------------------------------------------ */

export type StockStatus = "Tersedia" | "Stok Menipis" | "Habis";

export interface Product {
  id: string;
  thumbnail?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: StockStatus;
  images?: string[];
  description?: string;
  variants?: { name: string; icon: string }[];
  sizes?: { label: string; price: number }[];
  priceOld?: number;
  discount?: string;
  badgeTagline?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    thumbnail: "",
    name: "Keripik Apel Manalagi 200g",
    sku: "MLG-APL-01",
    category: "Keripik",
    price: 35000,
    stock: 142,
    unit: "pcs",
    status: "Tersedia",
  },
  {
    id: "2",
    thumbnail: "",
    name: "Sari Apel Murni Brosem 330ml",
    sku: "MLG-BRS-02",
    category: "Minuman",
    price: 50000,
    stock: 28,
    unit: "karton",
    status: "Tersedia",
  },
  {
    id: "3",
    thumbnail: "",
    name: "Keripik Tempe Sanan Daun Jeruk 250g",
    sku: "MLG-TMP-03",
    category: "Keripik",
    price: 22500,
    stock: 6,
    unit: "pcs",
    status: "Stok Menipis",
  },
  {
    id: "4",
    thumbnail: "",
    name: "Bumbu Pecel Malangan",
    sku: "MLG-PIA-04",
    category: "Bumbu",
    price: 48000,
    stock: 15,
    unit: "box",
    status: "Tersedia",
  },
];

const statusStyle: Record<StockStatus, string> = {
  Tersedia: styles.badgeOk,
  "Stok Menipis": styles.badgeWarn,
  Habis: styles.badgeOff,
};

/* ------------------------------------------------------------------ */
/*  Komponen Utama                                                    */
/* ------------------------------------------------------------------ */

interface KelolaProps {
  onEksporCsv?: () => void;
}

export default function Kelola({ onEksporCsv }: KelolaProps) {
  const [productList, setProductList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    thumbnail: "",
    name: "",
    sku: "",
    category: "Keripik",
    price: "",
    stock: "",
    unit: "pcs",
    status: "Tersedia" as StockStatus,
    images: [] as string[],
    description: "",
    variants: [] as { name: string; icon: string }[],
    sizes: [] as { label: string; price: number }[],
    priceOld: "",
    discount: "",
    badgeTagline: "",
  });

  useEffect(() => {
    fetch("/api/produk")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductList(data);
        }
      })
      .catch((err) => console.log("Menampilkan data awal (mock):", err));
  }, []);

  const stats = useMemo(() => {
    const total = productList.length;
    const aman = productList.filter((p) => p.status === "Tersedia").length;
    const menipis = productList.filter((p) => p.status === "Stok Menipis").length;
    const habis = productList.filter((p) => p.status === "Habis").length;
    return { total, aman, menipis, habis };
  }, [productList]);

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "Semua" || p.category === selectedCategory;
      const matchStatus =
        selectedStatus === "Semua" || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [productList, search, selectedCategory, selectedStatus]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(productList.map((p) => p.category)));
    return ["Semua", ...unique];
  }, [productList]);

  function handleBukaTambah() {
    setEditingProduct(null);
    setForm({
      thumbnail: "",
      name: "",
      sku: "",
      category: "Keripik",
      price: "",
      stock: "",
      unit: "pcs",
      status: "Tersedia",
      images: [],
      description: "",
      variants: [],
      sizes: [],
      priceOld: "",
      discount: "",
      badgeTagline: "",
    });
    setShowModal(true);
  }

  function handleBukaEdit(p: Product) {
  try {
    setEditingProduct(p);
    setForm({
      thumbnail: p.thumbnail || "",
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      unit: p.unit,
      status: p.status,
      images: p.images || [],
      variants: p.variants || [],
      sizes: p.sizes || [],
      priceOld: p.priceOld ? String(p.priceOld) : "",
      discount: p.discount || "",
      badgeTagline: p.badgeTagline || "",
      description: p.description || "",
    });
    setShowModal(true);
  } catch (err) {
    console.error("ERROR EDIT:", err);
    alert("Error: " + err);
  }
}

async function handleHapus(id: string) {
  if (!confirm("Yakin ingin menghapus produk ini?")) return;

  try {
    const res = await fetch(`/api/produk/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Gagal menghapus produk dari server");
    }

    // Hapus dari state UI hanya jika di server sudah berhasil terhapus
    setProductList((prev) => prev.filter((p) => String(p.id) !== String(id)));
  } catch (err) {
    console.error("Gagal menghapus produk:", err);
    alert("Terjadi kesalahan saat menghapus produk di server.");
  }
}

  function handleImagesChange(value: string) {
    const urls = value.split("\n").map((s) => s.trim()).filter(Boolean);
    setForm({ ...form, images: urls });
  }

  function handleAddVariant() {
    setForm({ ...form, variants: [...form.variants, { name: "", icon: "🍏" }] });
  }
  function handleVariantChange(index: number, key: "name" | "icon", value: string) {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, variants: updated });
  }
  function handleRemoveVariant(index: number) {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
  }

  function handleAddSize() {
    setForm({ ...form, sizes: [...form.sizes, { label: "", price: 0 }] });
  }
  function handleSizeChange(index: number, key: "label" | "price", value: string) {
    const updated = [...form.sizes];
    updated[index] = { ...updated[index], [key]: key === "price" ? Number(value) : value };
    setForm({ ...form, sizes: updated });
  }
  function handleRemoveSize(index: number) {
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });
  }

  async function handleSubmitForm(e: React.FormEvent) {
  e.preventDefault();

  const payload = {
    thumbnail: form.thumbnail || "",
    name: form.name,
    sku: form.sku,
    category: form.category,
    price: Number(form.price),
    stock: Number(form.stock),
    unit: form.unit,
    status: form.status,
    images: form.images,
    description: form.description,
    variants: form.variants,
    sizes: form.sizes,
    priceOld: form.priceOld ? Number(form.priceOld) : undefined,
    discount: form.discount || undefined,
    badgeTagline: form.badgeTagline || undefined,
  };

  try {
    if (editingProduct) {
      // EDIT PRODUK
      const res = await fetch(`/api/produk/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal mengupdate produk di database");

      // Update state lokal setelah backend sukses
      setProductList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
      );
    } else {
      // TAMBAH PRODUK BARU
      const res = await fetch("/api/produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk ke database");

      // Ambil data hasil insert (termasuk ID resmi dari MySQL)
      const dataBaru = await res.json();
      
      // Jika backend hanya kirim { success: true, insertId: ... }, sesuaikan dengan dataBaru.insertId
      const createdItem: Product = {
        id: String(dataBaru.insertId || dataBaru.id || Date.now()),
        ...payload,
      };

      setProductList((prev) => [createdItem, ...prev]);
    }

    setShowModal(false);
  } catch (err) {
    console.error("Error submit form:", err);
    alert("Gagal menyimpan data ke database. Cek terminal / console.");
  }
}

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            <IconTag />
            <span>Katalog Inventaris</span>
          </div>
          <h1 className={styles.title}>Kelola Data Produk</h1>
          <p className={styles.subtitle}>Katalog stok dan harga oleh-oleh khas Malang.</p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={onEksporCsv}>
            <IconDownload />
            Ekspor CSV
          </button>
          <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={handleBukaTambah}>
            <IconPlus />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard label="TOTAL PRODUK" value={stats.total} unit="SKU" tone="neutral" icon={<IconBag />} />
        <StatCard label="STOK AMAN" value={stats.aman} unit="Item" tone="ok" icon={<IconCheck />} />
        <StatCard label="STOK MENIPIS" value={stats.menipis} unit="<10 pcs" tone="warn" icon={<IconAlert />} />
        <StatCard label="HABIS" value={stats.habis} unit="Item" tone="off" icon={<IconCartOff />} />
      </div>

      <div className={styles.filters}>
        <label className={styles.search}>
          <IconSearch />
          <input
            type="text"
            placeholder="Cari nama produk atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select className={styles.select} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Semua" ? "Semua Kategori" : cat}
            </option>
          ))}
        </select>

        <select className={styles.select} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="Semua">Semua Status Stok</option>
          <option value="Tersedia">Tersedia</option>
          <option value="Stok Menipis">Stok Menipis</option>
          <option value="Habis">Habis</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Produk &amp; SKU</th>
              <th>Kategori</th>
              <th className={styles.colNum}>Harga Jual</th>
              <th className={styles.colNum}>Stok Fisik</th>
              <th>Status</th>
              <th className={styles.colAksi}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className={styles.thumb}>
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.prodName}>{p.name}</div>
                  <div className={styles.prodSku}>SKU: {p.sku}</div>
                </td>
                <td>
                  <span className={styles.category}>{p.category}</span>
                </td>
                <td className={cx(styles.colNum, styles.price)}>{formatRupiah(p.price)}</td>
                <td className={styles.colNum}>
                  <span className={p.status === "Stok Menipis" ? cx(styles.stock, styles.stockWarn) : styles.stock}>
                    {p.stock}
                  </span>{" "}
                  <span className={styles.unit}>{p.unit}</span>
                </td>
                <td>
                  <span className={cx(styles.badge, statusStyle[p.status])}>
                    <i className={styles.badgeDot} />
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button type="button" className={styles.rowBtn} aria-label="Edit Produk" onClick={() => handleBukaEdit(p)}>
                      <IconEdit />
                    </button>
                    <button
                      type="button"
                      className={cx(styles.rowBtn, styles.rowBtnDanger)}
                      aria-label="Hapus Produk"
                      onClick={() => handleHapus(p.id)}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Tidak ada produk yang cocok dengan pencarian/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerText}>
          Menampilkan {filtered.length} dari {productList.length} produk
        </span>

        <div className={styles.pagination}>
          <button type="button" className={styles.pageBtn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹
          </button>
          <button type="button" className={cx(styles.pageBtn, styles.pageBtnActive)}>
            {page}
          </button>
          <button type="button" className={styles.pageBtn} onClick={() => setPage((p) => p + 1)}>
            Next ›
          </button>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              <button type="button" className={styles.modalClose} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label className={styles.formLabel}>URL Foto Produk</label>
                  <input
                    className={styles.formInput}
                    placeholder="/foto/produk1.jpg"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: 3 }}>
                  <label className={styles.formLabel}>Nama Produk</label>
                  <input
                    className={styles.formInput}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SKU</label>
                  <input
                    className={styles.formInput}
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <input
                    className={styles.formInput}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga (Rp)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Stok Fisik</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Satuan</label>
                  <input
                    className={styles.formInput}
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Stok</label>
                  <select
                    className={styles.formInput}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as StockStatus })}
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Stok Menipis">Stok Menipis</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Galeri Foto (1 URL per baris)</label>
                <textarea
                  className={styles.formInput}
                  rows={3}
                  placeholder={"/foto/produk1.jpg\n/foto/produk2.jpg"}
                  value={form.images.join("\n")}
                  onChange={(e) => handleImagesChange(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Badge Tagline (opsional)</label>
                <input
                  className={styles.formInput}
                  placeholder="misal: 100% Apel Manalagi Asli"
                  value={form.badgeTagline}
                  onChange={(e) => setForm({ ...form, badgeTagline: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Deskripsi Produk</label>
                <textarea
                  className={styles.formInput}
                  rows={4}
                  placeholder="Jelaskan keunggulan, komposisi, atau info produk lainnya..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga Coret (opsional)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    placeholder="misal: 42000"
                    value={form.priceOld}
                    onChange={(e) => setForm({ ...form, priceOld: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label Diskon (opsional)</label>
                  <input
                    className={styles.formInput}
                    placeholder="misal: 16%"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Varian Rasa</label>
                {form.variants.map((v, i) => (
                  <div key={i} className={styles.formRow} style={{ marginBottom: 8 }}>
                    <input
                      className={styles.formInput}
                      style={{ flex: 0.5 }}
                      placeholder="🍏"
                      value={v.icon}
                      onChange={(e) => handleVariantChange(i, "icon", e.target.value)}
                    />
                    <input
                      className={styles.formInput}
                      style={{ flex: 2 }}
                      placeholder="Nama varian (misal: Original Manalagi)"
                      value={v.name}
                      onChange={(e) => handleVariantChange(i, "name", e.target.value)}
                    />
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => handleRemoveVariant(i)}>
                      Hapus
                    </button>
                  </div>
                ))}
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={handleAddVariant}>
                  <IconPlus /> Tambah Varian
                </button>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ukuran Kemasan &amp; Harga</label>
                {form.sizes.map((s, i) => (
                  <div key={i} className={styles.formRow} style={{ marginBottom: 8 }}>
                    <input
                      className={styles.formInput}
                      placeholder="misal: 100g"
                      value={s.label}
                      onChange={(e) => handleSizeChange(i, "label", e.target.value)}
                    />
                    <input
                      className={styles.formInput}
                      type="number"
                      placeholder="Harga (Rp)"
                      value={s.price || ""}
                      onChange={(e) => handleSizeChange(i, "price", e.target.value)}
                    />
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => handleRemoveSize(i)}>
                      Hapus
                    </button>
                  </div>
                ))}
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={handleAddSize}>
                  <IconPlus /> Tambah Ukuran
                </button>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className={cx(styles.btn, styles.btnPrimary)}>
                  {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatCard Sub-Component                                           */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  tone: "neutral" | "ok" | "warn" | "off";
  icon: React.ReactNode;
}

const toneClass: Record<StatCardProps["tone"], string> = {
  neutral: styles.statIconNeutral,
  ok: styles.statIconOk,
  warn: styles.statIconWarn,
  off: styles.statIconOff,
};

function StatCard({ label, value, unit, tone, icon }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div>
        <span className={styles.statLabel}>{label}</span>
        <div className={styles.statValue}>
          {value}
          <span className={styles.statUnit}>{unit}</span>
        </div>
      </div>
      <div className={cx(styles.statIcon, toneClass[tone])}>{icon}</div>
    </div>
  );
}