import { Link } from "@/i18n/routing";
import Image from "next/image";

// Import CSS katalog
import "./cart.css";

export default function CartPage() {
  return (
    <main className="cart-page">
      <div className="section-container">
        <div className="cart-title-row">
          <h1>Shopping Cart.</h1>
          <span className="items-selected">3 BARANG DIPILIH</span>
        </div>
        <div className="title-underline"></div>

        <div className="cart-layout">
          <div className="cart-left">
            <div className="cart-table-head">
              <span className="col-produk">PRODUK</span>
              <span className="col-varian">VARIAN</span>
              <span className="col-jumlah">JUMLAH</span>
              <span className="col-total">TOTAL HARGA</span>
            </div>

            {/* Item 1 */}
            <div className="cart-item">
              <div className="item-main">
                <div className="item-thumb">
                  <span className="badge badge-bestseller">PREMIUM</span>
                  <img
                    src="https://placehold.co/200x200/f2e2c8/8a5a2b?text=Apel"
                    alt="Keripik Apel Malang"
                  />
                </div>
                <div className="item-info">
                  <h3>Keripik Apel Malang</h3>
                  <p>Pouch Zipper Stand-up (Grade A)</p>
                </div>
              </div>

              <div className="item-variant">
                <select>
                  <option>200 g</option>
                </select>
              </div>

              <div className="item-qty">
                <button className="qty-btn">&minus;</button>
                <span>2</span>
                <button className="qty-btn">+</button>
              </div>

              <div className="item-total">
                <span className="item-price">
                  Rp<br className="mobile-break" />
                  70.000
                </span>
                <button className="remove-btn" aria-label="Hapus item">
                  &times;
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="cart-item">
              <div className="item-main">
                <div className="item-thumb">
                  <span className="badge badge-fresh">ALAMI</span>
                  <img
                    src="https://placehold.co/200x200/e9ecec/3a4a4a?text=Brosem"
                    alt="Brosem Batu"
                  />
                </div>
                <div className="item-info">
                  <h3>Brosem Batu</h3>
                  <p>Botol Kaca Klasik (Tanpa Pengawet)</p>
                </div>
              </div>

              <div className="item-variant">
                <select>
                  <option>330 ml</option>
                </select>
              </div>

              <div className="item-qty">
                <button className="qty-btn">&minus;</button>
                <span>3</span>
                <button className="qty-btn">+</button>
              </div>

              <div className="item-total">
                <span className="item-price">
                  Rp<br className="mobile-break" />
                  48.000
                </span>
                <button className="remove-btn" aria-label="Hapus item">
                  &times;
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="cart-item">
              <div className="item-main">
                <div className="item-thumb">
                  <span className="badge badge-new">SANAN</span>
                  <img
                    src="https://placehold.co/200x200/d9b98a/5a3a1b?text=Tempe"
                    alt="Keripik Tempe Renyah Khas Sanan"
                  />
                </div>
                <div className="item-info">
                  <h3>Keripik Tempe Renyah Khas Sanan</h3>
                  <p>Gurih Daun Jeruk &amp; Bawang Asli</p>
                </div>
              </div>

              <div className="item-variant">
                <select>
                  <option>250 g</option>
                </select>
              </div>

              <div className="item-qty">
                <button className="qty-btn">&minus;</button>
                <span>1</span>
                <button className="qty-btn">+</button>
              </div>

              <div className="item-total">
                <span className="item-price">
                  Rp<br className="mobile-break" />
                  22.500
                </span>
                <button className="remove-btn" aria-label="Hapus item">
                  &times;
                </button>
              </div>
            </div>

            <Link href="/" className="back-link">
              &rsaquo; Lanjut Belanja Oleh-Oleh Lainnya
            </Link>
          </div>

          <aside className="cart-right">
            <div className="summary-card">
              <div className="summary-head">
                <h2>Ringkasan Pesanan</h2>
                <span className="summary-tag">3 Barang</span>
              </div>

              <label className="coupon-label">KUPON / VOUCHER PROMO</label>
              <div className="coupon-row">
                <input type="text" defaultValue="BATUKEREN" readOnly />
                <button className="apply-btn">Terapkan</button>
              </div>
              <div className="coupon-active">
                <span className="dot-green"></span>
                BATUKEREN aktif &mdash; Diskon Rp 15.000
              </div>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal Produk</span>
                  <span>Rp 140.500</span>
                </div>
                <div className="summary-line discount">
                  <span>Diskon Kupon</span>
                  <span>- Rp 15.000</span>
                </div>
                <div className="summary-line">
                  <span>Estimasi Ongkos Kirim</span>
                  <span>Gratis (Malang Raya)</span>
                </div>
              </div>

              <div className="total-box">
                <div className="total-left">
                  <span>Total Tagihan</span>
                  <strong>Rp 125.500</strong>
                </div>
                <span className="ppn-tag">Termasuk PPN</span>
              </div>

              <button className="checkout-btn">
                Lanjut ke Checkout
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <p className="secure-note">
                🔒 100% Produk Fresh &amp; Asli Khas Malang &bull; Transaksi
                Aman
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}