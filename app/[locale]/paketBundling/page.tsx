import { Link } from "@/i18n/routing";
import Image from "next/image";

// Import CSS khusus paket bundling
import "./paketBundling.css";

// Data dummy paket bundling
const BUNDLES = [
  { id: 1, name: "Paket Buah Tangan 1", price: "Rp 85.000", rating: "5.0", reviews: "1.2k", image: "/foto/kripikTempe.jpg" },
  { id: 2, name: "Paket Buah Tangan 2", price: "Rp 85.000", rating: "5.0", reviews: "1.2k", image: "/foto/kripikTempe.jpg" },
  { id: 3, name: "Paket Buah Tangan 3", price: "Rp 85.000", rating: "4.4", reviews: "1k", image: "/foto/kripikTempe.jpg" },
  { id: 4, name: "Paket Buah Tangan 4", price: "Rp 85.000", rating: "4.8", reviews: "120", image: "/foto/kripikTempe.jpg" },
  { id: 5, name: "Paket Buah Tangan 5", price: "Rp 85.000", rating: "5.0", reviews: "1.2k", image: "/foto/kripikTempe.jpg" },
  { id: 6, name: "Paket Buah Tangan 6", price: "Rp 85.000", rating: "4.8", reviews: "2.4k", image: "/foto/kripikTempe.jpg" },
];

export default function BundlingPage() {
  return (
    <main>
      <section className="catalog-hero">
        <div className="catalog-hero-content">
          <span className="hero-pill">KATALOG BUNDLING</span>
          <h1>Koleksi Buah Tangan</h1>
        </div>
      </section>

      <section className="shop-section">
        <div className="section-container">
          <div className="shop-toolbar">
            <h2>Paket Bingkisan</h2>
            <div className="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Mau kirim bingkisan untuk siapa hari ini?" />
              <button className="search-cta">Cari</button>
            </div>
          </div>

          <div className="shop-layout">
            <aside className="shop-sidebar">
              <h3>Penerima Bingkisan</h3>
              <ul className="category-list">
                <li className="active">
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22v-9" />
                      <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                      <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                      <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
                    </svg>
                    Semua Paket
                  </Link>
                  <span className="count-badge">32</span>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                    Paket Orang Tua
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    Paket Teman & Rekan
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                      <path d="M15 3v5a1 1 0 0 0 1 1h5" />
                      <path d="M8 13h.01" />
                      <path d="M16 13h.01" />
                      <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />
                    </svg>
                    Paket Si Kecil
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    Paket Keluarga
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"></svg>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"></svg>
                </div>
              </div>
            </aside>

            <div className="shop-main">
              <div className="product-grid">
                {BUNDLES.map((item) => (
                  <article className="shop-card" key={item.id}>
                    <div className="shop-thumb">
                      <span className="tag">BUNDLING</span>
                      <Link href={`/bundling/${item.id}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={200}
                        />
                      </Link>
                    </div>
                    <div className="shop-info">
                      <h3>
                        <Link href={`/bundling/${item.id}`}>{item.name}</Link>
                      </h3>
                      <div className="rating">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#F0801C" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {item.rating} <span className="review-count">({item.reviews} Ulasan)</span>
                      </div>
                      <div className="shop-bottom">
                        <span className="shop-price">{item.price}</span>
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
              </div>

              <div className="pagination-divider"></div>

              <nav className="pagination">
                <Link href="#" className="page-nav prev">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Previous
                </Link>
                <div className="page-numbers">
                  <Link href="#" className="page-num active">1</Link>
                  <Link href="#" className="page-num">2</Link>
                  <Link href="#" className="page-num">3</Link>
                  <span className="page-dots">&hellip;</span>
                  <Link href="#" className="page-num">8</Link>
                  <Link href="#" className="page-num">9</Link>
                  <Link href="#" className="page-num">10</Link>
                </div>
                <Link href="#" className="page-nav next">
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}