"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";

// Import CSS khusus detail produk
import "./produk.css";

// --- TYPE DEFINITION ---
export interface VariantItem {
  id: string;
  name: string;
  label: string;
  desc: string;
  icon: string;
}

export interface AccordionItem {
  num: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface ReviewItem {
  id: number;
  author: string;
  initial: string;
  avatarBg: string;
  time: string;
  variant: string;
  text: string;
  helpful: number;
}

export interface RelatedProductItem {
  id: number;
  tag: string;
  name: string;
  desc: string;
  price: string;
  image: string;
}

export interface RatingBreakdown {
  star: number;
  percent: number;
}

export interface ProductDetailData {
  title: string;
  rating: string;
  reviewsCount: string;
  soldCount: string;
  priceNow: string;
  priceOld: string;
  discount: string;
  badgeTagline?: string;
  images: string[];
  variants: VariantItem[];
  sizes: string[];
  accordions: AccordionItem[];
  reviews: ReviewItem[];
  ratingBreakdown: RatingBreakdown[];
  satisfactionPct?: string;
  relatedProducts: RelatedProductItem[];
}

// Data Default / Fallback jika data dari API/Admin belum masuk
const DEFAULT_PRODUCT: ProductDetailData = {
  title: "Keripik Nangka Malang Premium",
  rating: "4.9",
  reviewsCount: "1.248",
  soldCount: "3.400+",
  priceNow: "Rp 35.000",
  priceOld: "Rp 42.000",
  discount: "16%",
  badgeTagline: "100% Apel Manalagi Asli",
  images: [
    "/foto/kripikNangka.jpg",
    "/foto/kripikNangka.jpg",
    "/foto/kripikNangka.jpg",
    "/foto/kripikNangka.jpg",
  ],
  variants: [
    { id: "orig", name: "Original", label: "Original", desc: "", icon: "" },
    { id: "cinnamon", name: "Pedas", label: "Kayu Manis", desc: "", icon: "" },
    { id: "chocolate", name: "Manis", label: "Cokelat Glaze", desc: "", icon: "" },
  ],
  sizes: ["100g", "200g", "250g", "500g"],
  accordions: [
    {
      num: "01",
      title: "Deskripsi & Keunggulan Produk",
      content: "Keripik Apel Manalagi Malang Fresh dipetik langsung dari kebun rakyat dataran tinggi Kota Batu...",
      tags: ["🍏 100% Apel Manalagi Segar",  "✨ Kerenyahan Tahan Lama"],
    },
    {
      num: "02",
      title: "Komposisi & Nilai Nutrisi Alami",
      content: "100% apel Manalagi segar tanpa pengawet, pemanis buatan, maupun perisa tambahan...",
    },
    {
      num: "03",
      title: "Legalitas, P-IRT & Sertifikasi Halal",
      content: "Telah mengantongi izin P-IRT resmi dari Dinas Kesehatan serta sertifikasi Halal MUI...",
    },
    {
      num: "04",
      title: "Panduan Penyimpanan & Penyajikan",
      content: "Simpan di tempat sejuk dan kering, jauh dari sinar matahari langsung...",
    },
  ],
  reviews: [
    {
      id: 1,
      author: "Dian Puspitasari",
      initial: "D",
      avatarBg: "avatar-red",
      time: "Kemarin, 14:20",
      variant: "Original Manalagi (100g)",
      text: "Jujur ini keripik apel terenak yang pernah saya beli di Malang! Garingnya pas banget, gak alot sama sekali dan manis asem alami buahnya berasa meledak di lidah tanpa pemanis tambahan. Packaging ziplocknya juga sangat tebal jadi tetap garing walau udah dibuka 3 hari.",
      helpful: 42,
    },
    {
      id: 2,
      author: "Reza Ramadhan",
      initial: "R",
      avatarBg: "avatar-orange",
      time: "3 hari lalu",
      variant: "Kayu Manis (250g)",
      text: "Pesan untuk oleh-oleh kantor ke Jakarta, packing bubble wrap sangat rapi dan tebal jadi keripik sampai dalam kondisi utuh tidak remuk. Varian cinnamon/kayu manis aromanya sangat mewah dan legit!",
      helpful: 19,
    },
  ],
  ratingBreakdown: [
    { star: 5, percent: 88 },
    { star: 4, percent: 9 },
    { star: 3, percent: 2 },
  ],
  satisfactionPct: "98% Puas & Beli Ulang",
  relatedProducts: [
    {
      id: 1,
      tag: "Minuman Alami",
      name: "Sari Apel Murni Brosem",
      desc: "Isi 5 botol @250ml",
      price: "Rp 45.000",
      image: "/foto/mix.jpg",
    },
    {
      id: 2,
      tag: "Gurih",
      name: "Keripik Tempe Renyah Sanan",
      desc: "Kemasan 200g",
      price: "Rp 22.500",
      image: "/foto/mix.jpg",
    },
    {
      id: 3,
      tag: "Legit",
      name: "Keripik Nangka Super Legit",
      desc: "Kemasan 150g",
      price: "Rp 38.000",
      image: "/foto/mix.jpg",
    },
    {
      id: 4,
      tag: "Fresh Bake",
      name: "Pia Apel Batu Lumer",
      desc: "Kotak isi 10 pcs",
      price: "Rp 48.000",
      image: "/foto/mix.jpg",
    },
  ],
};

const FEEDBACK_MAP: Record<number, string> = {
  1: "Butuh Perbaikan",
  2: "Cukup Oke",
  3: "Lumayan Enak",
  4: "Enak Banget!",
  5: "Sempurna & Nagih!",
};

const REVIEW_KEYWORD_CHIPS = [
  "Renyah Maksimal",
  "Rasa Otentik Batu",
  "Cocok Buat Buah Tangan",
  "Manis–Asam Seimbang",
];

type PageProps = {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function ProdukPage({}: PageProps) {
  const product: ProductDetailData = DEFAULT_PRODUCT;

  // States Interaktif
  const [selectedImg, setSelectedImg] = useState(product.images[0] || "/foto/mix.jpg");
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [openAccIndex, setOpenAccIndex] = useState<number | null>(0);

  // States Modal Ulasan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [activeChips, setActiveChips] = useState<string[]>([REVIEW_KEYWORD_CHIPS[0]]);

  const toggleChip = (chipText: string) => {
    setActiveChips((prev) =>
      prev.includes(chipText) ? prev.filter((c) => c !== chipText) : [...prev, chipText]
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  
  const router = useRouter();

  async function handleBeli(e: React.MouseEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/me");

      if (res.status === 401) {
        router.push("/masuk");
        return;
      }

      router.push("/checkout");
    } catch (err) {
      console.error("Gagal cek status login:", err);
    }
  }

  return (
    <main className="detail-page">
      <div className="section-container">
        {/* Section Detail Utama Produk */}
        <section className="product-panel">
          {/* Kolom Galeri Foto */}
          <div className="gallery-col">
            <div className="main-image">
              {product.badgeTagline && (
                <span className="image-badge">{product.badgeTagline}</span>
              )}
              <Image
                src={selectedImg}
                alt={product.title}
                width={500}
                height={500}
                priority
              />
            </div>
            <div className="thumb-strip">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb ${selectedImg === img ? "active" : ""}`}
                  onClick={() => setSelectedImg(img)}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} width={80} height={80} />
                </button>
              ))}
            </div>
          </div>

          {/* Kolom Informasi Produk */}
          <div className="info-col">
            <h1>{product.title}</h1>

            <div className="rating-row">
              <span className="stars">★★★★★</span>
              <span className="rating-score">{product.rating}</span>
              <a href="#reviewsPanel" className="rating-link">
                {product.reviewsCount} Ulasan
              </a>
              <span className="sep">|</span>
              <span className="sold">Terjual {product.soldCount}</span>
            </div>

            <div className="price-row">
              <span className="price-now">{product.priceNow}</span>
              {product.priceOld && <span className="price-old">{product.priceOld}</span>}
              {product.discount && <span className="price-save">Hemat {product.discount}</span>}
            </div>

            <p className="option-label">
              Varian Rasa: <span>{selectedVariant}</span>
            </p>
            <div className="variant-row">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  className={`variant-card ${selectedVariant === v.name ? "active" : ""}`}
                  onClick={() => setSelectedVariant(v.name)}
                >
                  <span className="variant-icon">{v.icon}</span>
                  <span>
                    <strong>{v.label}</strong>
                    <small>{v.desc}</small>
                  </span>
                </button>
              ))}
            </div>

            <div className="size-head">
              <p className="option-label">
                Ukuran Kemasan: <span>{selectedSize}</span>
              </p>
            </div>
            <div className="size-row">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="cta-row">
              <Link href="/checkout" className="btn-add-cart" onClick={handleBeli}>
                Beli
              </Link>
            </div>
          </div>
        </section>

        {/* Section Accordion Informasi */}
        <section className="info-panel">
          <div className="info-panel-head">
            <div>
              <span className="eyebrow">DETAIL INFORMASI</span>
              <h2>Informasi Produk &amp; Komposisi Alami</h2>
            </div>
          </div>

        

          <div className="accordion">
            {product.accordions.map((acc, index) => {
              const isOpen = openAccIndex === index;
              return (
                <div key={index} className={`accordion-item ${isOpen ? "open" : ""}`}>
                  <button
                    className="accordion-head"
                    onClick={() => setOpenAccIndex(isOpen ? null : index)}
                  >
                    <span className={`acc-num ${isOpen ? "acc-num-open" : ""}`}>{acc.num}</span>
                    <span className="acc-title">{acc.title}</span>
                  </button>
                  {isOpen && (
                    <div className="accordion-body">
                      <p>{acc.content}</p>
                      {acc.tags && (
                        <div className="tag-row">
                          {acc.tags.map((tag, i) => (
                            <span key={i} className="info-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Ulasan Pembeli */}
        <section className="reviews-panel" id="reviewsPanel">
          <div className="reviews-head">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>SUARA PELANGGAN SETIA
              </span>
              <h2>Semua Ulasan Pembeli ({product.reviewsCount})</h2>
            </div>
            <div className="reviews-head-actions">
              <span className="verified-pill">✓ 100% Ulasan Terverifikasi</span>
              <button className="write-review-btn" onClick={handleOpenModal}>
                ✎ + Tulis Ulasan
              </button>
            </div>
          </div>

          <div className="rating-summary">
            <div className="rating-big">
              <span className="rating-number">{product.rating}</span>
              <span className="rating-caption">dari 5.0 bintang</span>
            </div>

            <div className="rating-mid">
              <span className="stars">★★★★★</span>
              {product.satisfactionPct && (
                <span className="rating-caption">{product.satisfactionPct}</span>
              )}
            </div>

            <div className="rating-bars">
              {product.ratingBreakdown.map((rb) => (
                <div className="bar-row" key={rb.star}>
                  <span className="bar-label">{rb.star}★</span>
                  <span className="bar-track">
                    <span className="bar-fill" style={{ width: `${rb.percent}%` }}></span>
                  </span>
                  <span className="bar-pct">{rb.percent}%</span>
                </div>
              ))}
            </div>

            <div className="sort-box">
              <label>Urutkan:</label>
              <select defaultValue="Paling Relevan">
                <option>Paling Relevan</option>
                <option>Terbaru</option>
                <option>Rating Tertinggi</option>
              </select>
            </div>
          </div>

          <div className="review-list">
            {product.reviews.map((rev) => (
              <article key={rev.id} className="review-card">
                <div className="review-top">
                  <div className="review-author">
                    <span className={`avatar ${rev.avatarBg}`}>{rev.initial}</span>
                    <div>
                      <div className="author-name-row">
                        <strong>{rev.author}</strong>
                        <span className="verified-tag">✓ Pembeli Terverifikasi</span>
                      </div>
                      <div className="review-meta">
                        <span className="stars small">★★★★★</span>
                        <span className="meta-time">{rev.time}</span>
                        <span className="meta-variant">Varian: {rev.variant}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="review-text">{rev.text}</p>
              </article>
            ))}
          </div>

          <div className="load-more-wrap">
            <button className="load-more-btn">
              Muat Lebih Banyak Ulasan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </section>

        {/* Section Produk Terkait */}
        <section className="related-section">
          <div className="related-head">
            <div>
              <span className="eyebrow">PILIHAN KHAS LAINNYA</span>
              <h2>Kamu Mungkin Juga Suka</h2>
            </div>
            <Link href="/katalog" className="link-arrow-plain">
              Lihat Semua Katalog
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="related-grid">
            {product.relatedProducts.map((rel) => (
              <article key={rel.id} className="related-card">
                <div className="related-thumb">
                  <span className="tag">{rel.tag}</span>
                  <Image src={rel.image} alt={rel.name} width={250} height={200} />
                </div>
                <div className="related-info">
                  <h3>{rel.name}</h3>
                  <p>{rel.desc}</p>
                  <div className="related-bottom">
                    <span className="price">{rel.price}</span>
                    <button className="add-btn-small" aria-label="Tambah">
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
        </section>
      </div>

      {/* Modal Tulis Ulasan */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={handleCloseModal}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal} aria-label="Tutup">
              &times;
            </button>

            <div className="modal-head">
              <div>
                <span className="eyebrow">ULASAN &amp; PENGALAMAN RASA</span>
                <h2>Tulis Ulasan &amp; Nilai Rasa Anda</h2>
              </div>
            </div>

            <div className="modal-divider"></div>

            <div className="rating-input-row">
              <span className="rating-input-label">Rating Anda:</span>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`star-btn ${val <= userRating ? "filled" : ""}`}
                    onClick={() => setUserRating(val)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-feedback-pill">
                {FEEDBACK_MAP[userRating]} ({userRating}.0)
              </span>
            </div>

            <p className="field-label">Pilih Kata Kunci Pengalaman:</p>
            <div className="keyword-chips">
              {REVIEW_KEYWORD_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`chip ${activeChips.includes(chip) ? "active" : ""}`}
                  onClick={() => toggleChip(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            <textarea
              className="review-textarea"
              placeholder="Ceritakan pengalaman renyahnya keripik ini, tekstur, aroma, serta saran untuk tim kami..."
            ></textarea>

            <div className="modal-footer-row">
              <button
                type="button"
                className="submit-review-btn"
                onClick={() => {
                  handleCloseModal();
                  alert("Terima kasih! Ulasan Anda berhasil dikirim.");
                }}
              >
                Kirim Ulasan
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}