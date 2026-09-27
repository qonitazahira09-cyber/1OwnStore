"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link, useRouter } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const router = useRouter();

  async function handleProtectedNav(e: React.MouseEvent, destination: string) {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/me");

      if (!res.ok) {
        router.push("/masuk");
        return;
      }

      router.push(destination);
    } catch (err) {
      console.error("Gagal cek status login:", err);
      router.push("/masuk");
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          <span className="logo-top">1OWN</span>
          <span className="logo-bottom">STORE</span>
        </Link>

        <nav className="main-nav">
          <Link href="/">{t("beranda")}</Link>
          <Link href="/katalog">{t("katalog")}</Link>
          <Link href="/paketBundling">{t("paketBundling")}</Link>
        </nav>

        <div className="header-actions">
          <div className="search-box">
            <input type="text" placeholder={t("cariPlaceholder")} />
            <button className="search-btn" aria-label={t("cari")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <Link
            href="/cart"
            className="icon-btn cart-btn"
            aria-label={t("keranjang")}
            onClick={(e) => handleProtectedNav(e, "/cart")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-badge">2</span>
          </Link>

          <Link
            href="/profile/lacak"
            className="icon-btn"
            aria-label={t("akun")}
            onClick={(e) => handleProtectedNav(e, "/profile/lacak")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}