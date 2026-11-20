"use client";

import styles from "./kelola.module.css";
import React, { useMemo, useState, useEffect } from "react";
import type { Product, StockStatus } from "@/lib/produk";

export type { Product, StockStatus };

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const formatRupiah = (value: number) => "Rp " + value.toLocaleString("id-ID");

const statusStyle: Record<StockStatus, string> = {
  Tersedia: styles.badgeOk || "",
  "Stok Menipis": styles.badgeWarn || "",
  Habis: styles.badgeOff || "",
};

const digits = (s: string) => s.replace(/\D/g, "");
const fmtInput = (s: string) => {
  const d = digits(s);
  return d ? Number(d).toLocaleString("id-ID") : "";
};

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */

const Svg = ({ size = 15, children }: { size?: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{children}</svg>
);
const S = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const IconTag = () => (
  <Svg size={14}>
    <path d="M20 12.5 12.5 20a2 2 0 0 1-2.8 0l-6.7-6.7a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h6.9c.5 0 1 .2 1.4.6l6.7 6.7a2 2 0 0 1 .1 2.2Z" {...S} strokeWidth="1.7" />
    <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" />
  </Svg>
);
const IconDownload = () => (
  <Svg>
    <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" {...S} strokeWidth="1.8" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" {...S} strokeWidth="1.8" />
  </Svg>
);
const IconPlus = () => (
  <Svg><path d="M12 5v14M5 12h14" {...S} strokeWidth="2.2" /></Svg>
);
const IconBag = () => (
  <Svg size={18}>
    <path d="M6 8h12l-1 12H7L6 8Z" {...S} strokeWidth="1.7" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" {...S} strokeWidth="1.7" />
  </Svg>
);
const IconCheck = () => (
  <Svg size={18}><path d="m5 13 4.5 4.5L19 8" {...S} strokeWidth="2.2" /></Svg>
);
const IconAlert = () => (
  <Svg size={18}>
    <path d="M12 3 2 20h20L12 3Z" {...S} strokeWidth="1.7" />
    <path d="M12 10v4" {...S} strokeWidth="1.8" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </Svg>
);
const IconCartOff = () => (
  <Svg size={18}>
    <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" {...S} strokeWidth="1.7" />
    <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" />
    <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" />
  </Svg>
);
const IconSearch = () => (
  <Svg size={16}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.5-3.5" {...S} strokeWidth="1.8" />
  </Svg>
);
const IconEdit = () => (
  <Svg><path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" {...S} strokeWidth="1.7" /></Svg>
);
const IconTrash = () => (
  <Svg>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7h12Z" {...S} strokeWidth="1.7" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/*  Form state                                                        */
/* ------------------------------------------------------------------ */

interface AccordionForm { title: string; content: string; tags: string } // tags = "a, b, c"

const DEFAULT_ACCORDIONS: AccordionForm[] = [
  { title: "Deskripsi & Keunggulan Produk", content: "", tags: "" },
  { title: "Komposisi & Nilai Nutrisi Alami", content: "", tags: "" },
  { title: "Legalitas, P-IRT & Sertifikasi Halal", content: "", tags: "" },
  { title: "Panduan Penyimpanan & Penyajian", content: "", tags: "" },
];

interface FormState {
  thumbnail: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  unit: string;
  status: StockStatus;
  images: string[];
  description: string;
  variants: { name: string; icon: string }[];
  sizes: { label: string; price: number }[];
  accordions: AccordionForm[];
  priceOld: string;
  discount: string;
  badgeTagline: string;
}

const emptyForm = (): FormState => ({
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
  accordions: DEFAULT_ACCORDIONS.map((a) => ({ ...a })),
  priceOld: "",
  discount: "",
  badgeTagline: "",
});

/* ------------------------------------------------------------------ */
/*  Komponen Utama                                                    */
/* ------------------------------------------------------------------ */

interface KelolaProps {
  onEksporCsv?: () => void;
}

export default function Kelola({ onEksporCsv }: KelolaProps) {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  useEffect(() => {
    fetch("/api/produk")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
      })
      .then((data) => setProductList(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Gagal memuat produk:", err))
      .finally(() => setLoadingData(false));
  }, []);

  const stats = useMemo(() => ({
    total: productList.length,
    aman: productList.filter((p) => p.status === "Tersedia").length,
    menipis: productList.filter((p) => p.status === "Stok Menipis").length,
    habis: productList.filter((p) => p.status === "Habis").length,
  }), [productList]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return productList.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCategory = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchStatus = selectedStatus === "Semua" || p.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [productList, search, selectedCategory, selectedStatus]);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(productList.map((p) => p.category)))],
    [productList]
  );

  /* ---------- buka modal ---------- */
  function handleBukaTambah() {
    setEditingProduct(null);
    setForm(emptyForm());
    setShowModal(true);
  }

  function handleBukaEdit(p: Product) {
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
      images: p.images?.length ? p.images : p.thumbnail ? [p.thumbnail] : [],
      description: p.description || "",
      variants: p.variants || [],
      sizes: p.sizes || [],
      accordions: p.accordions?.length
        ? p.accordions.map((a) => ({ title: a.title, content: a.content, tags: (a.tags ?? []).join(", ") }))
        : DEFAULT_ACCORDIONS.map((a) => ({ ...a })),
      priceOld: p.priceOld ? String(p.priceOld) : "",
      discount: p.discount || "",
      badgeTagline: p.badgeTagline || "",
    });
    setShowModal(true);
  }

  /* ---------- hapus ---------- */
  async function handleHapus(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Gagal menghapus produk dari server");
      }
      setProductList((prev) => prev.filter((p) => String(p.id) !== String(id)));
    } catch (err: any) {
      console.error("Gagal menghapus produk:", err);
      alert(err.message || "Terjadi kesalahan saat menghapus produk.");
    }
  }

  /* ---------- handler field dinamis ---------- */
  async function handleUploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
  const files = Array.from(e.target.files ?? []);
  e.target.value = "";
  if (!files.length) return;

  setUploading(true);
  try {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal upload foto");
    setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
  } catch (err: any) {
    alert(err.message || "Gagal upload foto");
  } finally {
    setUploading(false);
  }
}

const handleRemoveImage = (i: number) =>
  setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

const handleSetMain = (i: number) =>
  setForm((f) => {
    const imgs = [...f.images];
    const [main] = imgs.splice(i, 1);
    return { ...f, images: [main, ...imgs] };
  });

  const handleAddVariant = () =>
    setForm({ ...form, variants: [...form.variants, { name: "", icon: "🍏" }] });
  const handleVariantChange = (i: number, key: "name" | "icon", value: string) => {
    const updated = [...form.variants];
    updated[i] = { ...updated[i], [key]: value };
    setForm({ ...form, variants: updated });
  };
  const handleRemoveVariant = (i: number) =>
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });

  const handleAddSize = () =>
    setForm({ ...form, sizes: [...form.sizes, { label: "", price: 0 }] });
  const handleSizeChange = (i: number, key: "label" | "price", value: string) => {
    const updated = [...form.sizes];
    updated[i] = { ...updated[i], [key]: key === "price" ? Number(value) : value };
    setForm({ ...form, sizes: updated });
  };
  const handleRemoveSize = (i: number) =>
    setForm({ ...form, sizes: form.sizes.filter((_, idx) => idx !== i) });

  const handleAddAccordion = () =>
    setForm({ ...form, accordions: [...form.accordions, { title: "", content: "", tags: "" }] });
  const handleAccordionChange = (i: number, key: keyof AccordionForm, value: string) => {
    const updated = [...form.accordions];
    updated[i] = { ...updated[i], [key]: value };
    setForm({ ...form, accordions: updated });
  };
  const handleRemoveAccordion = (i: number) =>
    setForm({ ...form, accordions: form.accordions.filter((_, idx) => idx !== i) });

  /* ---------- simpan ---------- */
  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const payload = {
      thumbnail: form.images[0] || "",
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
      accordions: form.accordions
        .filter((a) => a.title.trim() && a.content.trim())
        .map((a) => ({
          title: a.title.trim(),
          content: a.content.trim(),
          tags: a.tags.split(",").map((t) => t.trim()).filter(Boolean),
        })),
      priceOld: form.priceOld ? Number(form.priceOld) : null,
      discount: form.discount || null,
      badgeTagline: form.badgeTagline || null,
    };

    setSaving(true);
    try {
      const isEdit = !!editingProduct;
      const res = await fetch(isEdit ? `/api/produk/${editingProduct!.id}` : "/api/produk", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan produk");

      setProductList((prev) =>
        isEdit
          ? prev.map((p) => (String(p.id) === String(data.id) ? data : p))
          : [data, ...prev]
      );
      setShowModal(false);
    } catch (err: any) {
      console.error("Error submit form:", err);
      alert(err.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------- */
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
            <IconDownload /> Ekspor CSV
          </button>
          <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={handleBukaTambah}>
            <IconPlus /> Tambah Produk
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
            <option key={cat} value={cat}>{cat === "Semua" ? "Semua Kategori" : cat}</option>
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
                      <img src={p.thumbnail} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }} />
                    ) : (
                      "📦"
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.prodName}>{p.name}</div>
                  <div className={styles.prodSku}>SKU: {p.sku}</div>
                </td>
                <td><span className={styles.category}>{p.category}</span></td>
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
                    <button type="button" className={cx(styles.rowBtn, styles.rowBtnDanger)} aria-label="Hapus Produk" onClick={() => handleHapus(p.id)}>
                      <IconTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  {loadingData ? "Memuat data..." : "Tidak ada produk yang cocok dengan pencarian/filter."}
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
          <button type="button" className={styles.pageBtn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          <button type="button" className={cx(styles.pageBtn, styles.pageBtnActive)}>{page}</button>
          <button type="button" className={styles.pageBtn} onClick={() => setPage((p) => p + 1)}>Next ›</button>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div
            className={styles.modal}
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              <button type="button" className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmitForm}>
              {/* ===== Info dasar ===== */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
  <label className={styles.formLabel}>Nama Produk</label>
  <input className={styles.formInput} value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
</div>
                <div className={styles.formGroup} style={{ flex: 3 }}>
                  <label className={styles.formLabel}>Nama Produk</label>
                  <input className={styles.formInput} value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>SKU</label>
                  <input className={styles.formInput} value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <input className={styles.formInput} value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga (Rp)</label>
                  <input className={styles.formInput} type="text" inputMode="numeric" placeholder="40.000"
  value={fmtInput(form.price)}
  onChange={(e) => setForm({ ...form, price: digits(e.target.value) })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Stok Fisik</label>
                  <input className={styles.formInput} type="number" min={0} value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Satuan</label>
                  <input className={styles.formInput} value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status Stok</label>
                  <select className={styles.formInput} value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as StockStatus })}>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Stok Menipis">Stok Menipis</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga Coret (opsional)</label>
                  <input className={styles.formInput} type="text" inputMode="numeric" placeholder="42.000"
  value={fmtInput(form.priceOld)}
  onChange={(e) => setForm({ ...form, priceOld: digits(e.target.value) })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label Diskon (opsional)</label>
                  <input className={styles.formInput} placeholder="misal: 16%" value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
              </div>

              {/* ===== Halaman detail ===== */}
              <div className={styles.formGroup}>
  <label className={styles.formLabel}>Foto Produk (foto pertama jadi foto utama)</label>

  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
    {form.images.map((url, i) => (
      <div key={url + i} style={{ width: 96 }}>
        <div style={{ position: "relative" }}>
          <img src={url} alt={`Foto ${i + 1}`}
            style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb" }} />
          {i === 0 && (
            <span style={{ position: "absolute", top: 4, left: 4, background: "#F0801C", color: "#fff",
              fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>Utama</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          {i !== 0 && (
            <button type="button" onClick={() => handleSetMain(i)}
              style={{ flex: 1, fontSize: 11, cursor: "pointer" }}>Utama</button>
          )}
          <button type="button" onClick={() => handleRemoveImage(i)}
            style={{ flex: 1, fontSize: 11, cursor: "pointer", color: "#b91c1c" }}>Hapus</button>
        </div>
      </div>
    ))}
  </div>

  <label className={cx(styles.btn, styles.btnGhost)} style={{ cursor: uploading ? "wait" : "pointer" }}>
    <IconPlus /> {uploading ? "Mengunggah..." : "Upload Foto"}
    <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
      disabled={uploading} onChange={handleUploadFiles} />
  </label>
  <small style={{ display: "block", marginTop: 6, opacity: 0.7 }}>JPG / PNG / WebP, maks. 5 MB per foto.</small>
</div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Badge Tagline (opsional)</label>
                <input className={styles.formInput} placeholder="misal: 100% Apel Manalagi Asli"
                  value={form.badgeTagline}
                  onChange={(e) => setForm({ ...form, badgeTagline: e.target.value })} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Deskripsi Singkat</label>
                <textarea className={styles.formInput} rows={3}
                  placeholder="Ringkasan produk (dipakai sebagai cadangan jika detail informasi kosong)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Varian Rasa</label>
                {form.variants.map((v, i) => (
                  <div key={i} className={styles.formRow} style={{ marginBottom: 8 }}>
                    <input className={styles.formInput} style={{ flex: 0.5 }} placeholder="🍏" value={v.icon}
                      onChange={(e) => handleVariantChange(i, "icon", e.target.value)} />
                    <input className={styles.formInput} style={{ flex: 2 }} placeholder="Nama varian (misal: Original)"
                      value={v.name} onChange={(e) => handleVariantChange(i, "name", e.target.value)} />
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => handleRemoveVariant(i)}>Hapus</button>
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
                    <input className={styles.formInput} placeholder="misal: 100g" value={s.label}
                      onChange={(e) => handleSizeChange(i, "label", e.target.value)} />
                    <input className={styles.formInput} type="text" inputMode="numeric" placeholder="Harga (Rp)"
  value={s.price ? s.price.toLocaleString("id-ID") : ""}
  onChange={(e) => handleSizeChange(i, "price", digits(e.target.value))} />
                    <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => handleRemoveSize(i)}>Hapus</button>
                  </div>
                ))}
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={handleAddSize}>
                  <IconPlus /> Tambah Ukuran
                </button>
              </div>

              {/* ===== Detail Informasi (accordion) ===== */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Detail Informasi Produk (tampil sebagai accordion di halaman detail)
                </label>
                {form.accordions.map((a, i) => (
                  <div key={i}
                    style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <div className={styles.formRow} style={{ marginBottom: 8 }}>
                      <input className={styles.formInput} style={{ flex: 1 }} placeholder="Judul bagian"
                        value={a.title} onChange={(e) => handleAccordionChange(i, "title", e.target.value)} />
                      <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => handleRemoveAccordion(i)}>
                        Hapus
                      </button>
                    </div>
                    <textarea className={styles.formInput} rows={3} style={{ marginBottom: 8 }}
                      placeholder="Isi penjelasan..." value={a.content}
                      onChange={(e) => handleAccordionChange(i, "content", e.target.value)} />
                    <input className={styles.formInput}
                      placeholder="Tag (pisahkan dengan koma): 🍏 100% Apel Segar, ✨ Renyah Tahan Lama"
                      value={a.tags} onChange={(e) => handleAccordionChange(i, "tags", e.target.value)} />
                  </div>
                ))}
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={handleAddAccordion}>
                  <IconPlus /> Tambah Bagian Informasi
                </button>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving || uploading}>
                  {saving ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
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
/*  StatCard                                                          */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  tone: "neutral" | "ok" | "warn" | "off";
  icon: React.ReactNode;
}

const toneClass: Record<StatCardProps["tone"], string> = {
  neutral: styles.statIconNeutral || "",
  ok: styles.statIconOk || "",
  warn: styles.statIconWarn || "",
  off: styles.statIconOff || "",
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