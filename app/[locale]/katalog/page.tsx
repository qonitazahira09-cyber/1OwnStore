// app/[locale]/katalog/page.tsx
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { rowToProduct } from "@/lib/produk";
import "./katalog.css";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Minuman", "Keripik", "Bumbu Pecel"];
const RECENT_DAYS = 30;
const MIN_DISCOUNT = 25; // persen, ubah di sini kalau batasnya berubah

// Hitung persentase diskon dari baris mentah Supabase
const discountPercent = (row: any): number => {
  // Utama: kolom discount bertipe text, misal "25%" atau "11%"
  const fromText = parseFloat(
    String(row.discount ?? "").replace("%", "").replace(",", ".")
  );
  if (!isNaN(fromText)) return fromText;

  // Cadangan: kalau discount kosong, hitung dari price_old dan price
  const old = Number(row.price_old);
  const price = Number(row.price);
  if (old > price && old > 0) return ((old - price) / old) * 100;

  return 0;
};

/* ---------- Ikon ---------- */
const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    className="side-icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  semua: (
    <Icon>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Icon>
  ),
  Minuman: (
    <Icon>
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </Icon>
  ),
  Keripik: (
    <Icon>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </Icon>
  ),
  "Bumbu Pecel": (
    <Icon>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </Icon>
  ),
  terbaru: (
    <Icon>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  ),
  diskon: (
    <Icon>
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </Icon>
  ),
};

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; filter?: string }>;
}) {
  const { kategori, filter } = await searchParams;

  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Gagal memuat katalog:", error.message);

  const rows = data ?? [];
  const ALL_PRODUCTS = rows.map(rowToProduct);

  // id produk yang dibuat dalam RECENT_DAYS hari terakhir
  const limit = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const recentIds = new Set(
    rows
      .filter((r: any) => new Date(r.created_at).getTime() >= limit)
      .map((r: any) => String(r.id))
  );

  // id produk dengan diskon >= MIN_DISCOUNT
  const discountedIds = new Set(
    rows
      .filter((r: any) => discountPercent(r) >= MIN_DISCOUNT)
      .map((r: any) => String(r.id))
  );

  const norm = (s: string) => (s ?? "").trim().toLowerCase();

  const activeFilter =
    filter === "terbaru" || filter === "diskon" ? filter : undefined;
  const activeCategory = activeFilter
    ? undefined
    : CATEGORIES.find((c) => norm(c) === norm(kategori ?? ""));

  let PRODUCTS = ALL_PRODUCTS;
  if (activeFilter === "terbaru") {
    PRODUCTS = ALL_PRODUCTS.filter((p) => recentIds.has(String(p.id)));
  } else if (activeFilter === "diskon") {
    PRODUCTS = ALL_PRODUCTS.filter((p) => discountedIds.has(String(p.id)));
  } else if (activeCategory) {
    PRODUCTS = ALL_PRODUCTS.filter(
      (p) => norm(p.category) === norm(activeCategory)
    );
  }

  const isAll = !activeCategory && !activeFilter;

  return (
    <main>
      <section className="catalog-hero">
        <div className="catalog-hero-content">
          <span className="hero-pill">KATALOG PRODUK</span>
          <h1>Etalase Rasa</h1>
        </div>
      </section>

      <section className="shop-section">
        <div className="section-container">
          <div className="shop-toolbar">
            <h2>Pilihan Oleh-Oleh</h2>
            <div className="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Mau cari camilan apa hari ini?" />
              <button className="search-cta">Cari</button>
            </div>
          </div>

          <div className="shop-layout">
            <aside className="shop-sidebar">
              <h3>Kategori</h3>

              {/* Kategori utama */}
              <ul className="category-list">
                <li className={isAll ? "active" : ""}>
                  <Link href="/katalog">
                    {ICONS.semua}
                    <span className="side-label">Semua Produk</span>
                    {isAll && <span className="count-badge">{PRODUCTS.length}</span>}
                  </Link>
                </li>

                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <li key={cat} className={active ? "active" : ""}>
                      <Link href={`/katalog?kategori=${encodeURIComponent(cat)}`}>
                        {ICONS[cat]}
                        <span className="side-label">{cat}</span>
                        {active && <span className="count-badge">{PRODUCTS.length}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Garis tipis pemisah */}
              <div className="sidebar-divider" />

              {/* Filter tambahan */}
              <ul className="category-list extra-list">
                <li className={activeFilter === "terbaru" ? "active" : ""}>
                  <Link href="/katalog?filter=terbaru">
                    {ICONS.terbaru}
                    <span className="side-label">Produk Terbaru</span>
                    {activeFilter === "terbaru" && (
                      <span className="count-badge">{PRODUCTS.length}</span>
                    )}
                  </Link>
                </li>
                <li className={activeFilter === "diskon" ? "active" : ""}>
                  <Link href="/katalog?filter=diskon">
                    {ICONS.diskon}
                    <span className="side-label">Diskon</span>
                    {activeFilter === "diskon" && (
                      <span className="count-badge">{PRODUCTS.length}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </aside>

            <div className="shop-main">
              <div className="product-grid">
                {PRODUCTS.map((item) => (
                  <article className="shop-card" key={item.id}>
                    <div className="shop-thumb">
                      <span className="tag">{item.category}</span>
                      <Link href={`/katalog/${item.id}`}>
                        <Image
                          src={item.thumbnail || item.images[0] || "/foto/placeholder.jpg"}
                          alt={item.name}
                          width={300}
                          height={200}
                        />
                      </Link>
                    </div>
                    <div className="shop-info">
                      <h3><Link href={`/katalog/${item.id}`}>{item.name}</Link></h3>
                      <div className="rating">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0801C" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        4.9 <span className="review-count">(1.2k Ulasan)</span>
                      </div>
                      <div className="shop-bottom">
                        <span className="shop-price">Rp {item.price.toLocaleString("id-ID")}</span>
                        <button className="add-btn" aria-label="Tambah ke keranjang">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                {PRODUCTS.length === 0 && <p>Belum ada produk untuk filter ini.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}