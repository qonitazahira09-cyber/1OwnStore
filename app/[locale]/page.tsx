"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import "./beranda/beranda.css";

export default function Home() {
  const t = useTranslations("Home");

const router = useRouter();
async function handleAddToCart(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  try {
    const res = await fetch("/api/user/me");

    if (res.status === 401) {
      router.push("/masuk");
      return;
    }

    // sudah login, lanjut logic tambah ke keranjang di sini
  } catch (err) {
    console.error("Gagal cek status login:", err);
  }
}

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            <span className="dot"></span>{t("heroEyebrow")}
          </span>
          <h1 className="hero-title">
            {t("heroTitleLine1")}<br />
            <span className="accent-text">{t("heroTitleAccent")}</span>
          </h1>
          <Link href="#favorites" className="btn btn-primary">
            {t("btnLihatKoleksi")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="favorites" id="favorites">
        <div className="section-container">
          <div className="favorites-head">
            <div>
              <h2>
                <span className="head-bar"></span>{t("favoritesTitle")}
              </h2>
              <p className="section-sub">{t("favoritesSub")}</p>
            </div>
            <Link href="/katalog" className="link-arrow">
              {t("lihatSelengkapnya")}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="product-grid">
            <article className="product-card">
              <Link href="/produk">
                <div className="product-thumb">
                  <span className="badge badge-bestseller">{t("badgeBestseller")}</span>
                  <Image src="/foto/kripikNangka.jpg" alt={t("produk1Nama")} width={300} height={200} />
                </div>
                <div className="product-info">
                  <h3>{t("produk1Nama")}</h3>
                  <p className="product-desc">{t("produk1Desc")}</p>
                  <div className="product-bottom">
                    <span className="price">Rp 29.000</span>
                    <button
                      className="add-btn"
                      aria-label={t("tambahKeranjang")}
                      onClick={handleAddToCart}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </article>

            <article className="product-card">
              <Link href="/produk">
                <div className="product-thumb">
                  <span className="badge badge-fresh">{t("badgeFresh")}</span>
                  <Image src="/foto/brosem.jpg" alt={t("produk2Nama")} width={300} height={200} />
                </div>
                <div className="product-info">
                  <h3>{t("produk2Nama")}</h3>
                  <p className="product-desc">{t("produk2Desc")}</p>
                  <div className="product-bottom">
                    <span className="price">Rp 18.000</span>
                    <button
                      className="add-btn"
                      aria-label={t("tambahKeranjang")}
                      onClick={handleAddToCart}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </article>

            <article className="product-card">
              <Link href="/produk">
                <div className="product-thumb">
                  <Image src="/foto/kripikTempe.jpg" alt={t("produk3Nama")} width={300} height={200} />
                </div>
                <div className="product-info">
                  <h3>{t("produk3Nama")}</h3>
                  <p className="product-desc">{t("produk3Desc")}</p>
                  <div className="product-bottom">
                    <span className="price">Rp 16.500</span>
                    <button
                      className="add-btn"
                      aria-label={t("tambahKeranjang")}
                      onClick={handleAddToCart}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </article>

            <article className="product-card">
              <Link href="/produk">
                <div className="product-thumb">
                  <span className="badge badge-new">{t("badgeNew")}</span>
                  <Image src="/foto/mix.jpg" alt={t("produk4Nama")} width={300} height={200} />
                </div>
                <div className="product-info">
                  <h3>{t("produk4Nama")}</h3>
                  <p className="product-desc">{t("produk4Desc")}</p>
                  <div className="product-bottom">
                    <span className="price">Rp 35.000</span>
                    <button
                      className="add-btn"
                      aria-label={t("tambahKeranjang")}
                      onClick={handleAddToCart}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="snackbox-section">
        <div className="section-container">
          <div className="snackbox-card">
            <div className="snackbox-text">
              <span className="hero-eyebrow light">
                <span className="dot"></span>{t("snackboxEyebrow")}
              </span>
              <h2>
                {t("snackboxTitleLine1")} <br />
                {t("snackboxTitleLine2")}<br /> {t("snackboxTitleLine3")}
              </h2>
              <p>{t("snackboxDesc")}</p>
              <Link href="paketBundling" className="btn btn-primary">
                {t("btnPilihKotak")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className="snackbox-image">
              <Image src="/foto/box.jpg" alt={t("snackboxTitleLine1") + " " + t("snackboxTitleLine2")} width={500} height={500} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}