import { Link } from "@/i18n/routing";
import Image from "next/image";
import { db } from "@/lib/db";
import "./katalog.css";

interface Produk {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  category: string;
}

export default async function KatalogPage() {
  const result = await db.query(
    "SELECT id, name, price, thumbnail, category FROM produk ORDER BY created_at DESC"
  );
  
// Pastikan result tidak null/undefined dan ambil array datanya (biasanya di indeks ke-0 jika pakai mysql2)
const [rows] = await db.query("...");

// Cek apakah rows benar-benar ada isinya sebelum di-casting
const PRODUCTS = (rows || []) as Produk[];
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
              <ul className="category-list">
                <li className="active">
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Semua Produk
                  </Link>
                  <span className="count-badge">{PRODUCTS.length}</span>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m17 22 1.664-2.496a2 2 0 0 0 .336-1.11V5.606a2 2 0 0 0-.336-1.11L17 2" />
                      <path d="M18 22H6" />
                      <path d="M18 2H6" />
                      <path d="M5 17h14" />
                      <path d="M5 7h14" />
                      <path d="m7 22-1.664-2.496A2 2 0 0 0 5 18.394V5.606a2 2 0 0 0 .336-1.11L7 2" />
                    </svg>
                    Minuman
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 17h.01" />
                      <path d="M11.496 2c.324-.016.558.292.529.615a4 4 0 0 0 4.235 4.368.713.713 0 0 1 .758.757 4 4 0 0 0 4.366 4.237c.323-.03.63.204.614.527a10 10 0 0 1-2.915 6.566A1 1 0 1 1 4.93 4.918 10 10 0 0 1 11.496 2" />
                      <path d="M12 12h.01" />
                      <path d="M16 16h.01" />
                      <path d="M16 3h.01" />
                      <path d="M21 4h.01" />
                      <path d="M21 8h.01" />
                      <path d="M7 14h.01" />
                      <path d="M9 8h.01" />
                    </svg>
                    Kripik
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                    </svg>
                    Bumbu Pecel
                  </Link>
                </li>
              </ul>

              <div className="filter-list">
                <div className="filter-item">
                  <span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Produk Terbaru
                  </span>
                </div>
                <div className="filter-item">
                  <span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" x2="5" y1="5" y2="19" />
                      <circle cx="6.5" cy="6.5" r="2.5" />
                      <circle cx="17.5" cy="17.5" r="2.5" />
                    </svg>
                    Promo Spesial
                  </span>
                </div>
              </div>
            </aside>

            <div className="shop-main">
              <div className="product-grid">
                {PRODUCTS.map((item) => (
                  <article className="shop-card" key={item.id}>
                    <div className="shop-thumb">
                      <span className="tag">{item.category}</span>
                      <Link href={`/katalog/${item.id}`}>
                        <Image
                          src={item.thumbnail || "/foto/placeholder.jpg"}
                          alt={item.name}
                          width={300}
                          height={200}
                        />
                      </Link>
                    </div>
                    <div className="shop-info">
                      <h3>
                        <Link href={`/katalog/${item.id}`}>{item.name}</Link>
                      </h3>
                      <div className="rating">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0801C" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        4.9 <span className="review-count">(1.2k Ulasan)</span>
                      </div>
                      <div className="shop-bottom">
                        <span className="shop-price">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
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
                {PRODUCTS.length === 0 && <p>Belum ada produk.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}