"use client";

import React, { ReactNode, useState } from "react";
import styles from "./sideNav.module.css";

/* ------------------------------------------------------------------ */
/*  Small helper: join class names, CSS-Modules style                  */
/* ------------------------------------------------------------------ */

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG, zero external dependency)                       */
/* ------------------------------------------------------------------ */

const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M3 7.5V16.5L12 21l9-4.5V7.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 12V21" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M19.4 13.5c.1-.5.1-1 0-1.5l1.6-1.2-1.5-2.6-1.9.6a5.6 5.6 0 0 0-1.3-.8l-.3-2H10l-.3 2c-.5.2-.9.5-1.3.8l-1.9-.6-1.5 2.6L6.6 12c-.1.5-.1 1 0 1.5L5 14.7l1.5 2.6 1.9-.6c.4.3.8.6 1.3.8l.3 2h3.9l.3-2c.5-.2.9-.5 1.3-.8l1.9.6 1.5-2.6-1.6-1.2Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type MenuKey =
  | "dashboard"
  | "produk"
  | "pesanan"
  | "laporan"
  | "pengaturan";

interface NavItem {
  key: MenuKey;
  label: string;
  icon: () => JSX.Element;
}

interface AppShellProps {
  /** Menu yang sedang aktif di sidebar */
  activeMenu?: MenuKey;
  /** Callback saat user memilih menu lain */
  onMenuChange?: (key: MenuKey) => void;
  /** Nama & role user yang tampil di navbar */
  userName?: string;
  userRole?: string;
  userInitials?: string;
  /** Placeholder search bar di navbar */
  searchPlaceholder?: string;
  /** Konten halaman (akan dirender di sisi kanan, di bawah navbar) */
  children: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: IconGrid },
  { key: "produk", label: "Kelola Produk", icon: IconBox },
  { key: "pesanan", label: "Kelola Pesanan", icon: IconLock },
  { key: "laporan", label: "Laporan Penjualan", icon: IconChart },
  { key: "pengaturan", label: "Pengaturan Toko", icon: IconSettings },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AppShell({
  activeMenu = "produk",
  onMenuChange,
  userName = "Admin 1OwnStore",
  userRole = "OWNER",
  userInitials = "AO",
  searchPlaceholder = "Cari transaksi, produk, atau pelanggan...",
  children,
}: AppShellProps) {
  const [query, setQuery] = useState("");

  return (
    <div className={styles.shell}>
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>10</div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>1OwnStore</span>
            <span className={styles.brandTag}>OLEH-OLEH MALANG</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={cx(styles.navItem, key === activeMenu && styles.navItemActive)}
              onClick={() => onMenuChange?.(key)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className={styles.logout}>
          <IconLogout />
          <span>Logout</span>
        </button>
      </aside>

      {/* ---------------- MAIN AREA (navbar + content) ---------------- */}
      <div className={styles.main}>
        <header className={styles.navbar}>
          <label className={styles.search}>
            <IconSearch />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
            <kbd className={styles.kbd}>⌘K</kbd>
          </label>

          <div className={styles.navbarRight}>
            <button type="button" className={styles.iconBtn} aria-label="Notifikasi">
              <IconBell />
              <span className={styles.dot} />
            </button>

            <div className={styles.divider} />

            <div className={styles.user}>
              <div className={styles.userText}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole}>{userRole}</span>
              </div>
              <div className={styles.avatar}>{userInitials}</div>
            </div>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}