"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Sprofile.module.css";

// ==== Ganti href di sini sesuai nama folder route kamu ====
const menuItems = [
  { icon: "🚚", label: "Lacak Pesanan", href: "/profile/lacak", badge: "1 aktif" },
  { icon: "🧾", label: "Status Pembayaran", href: "/profile/statusPembayaran", badge: "1 tagihan" },
  { icon: "👤", label: "Biodata Diri", href: "/profile/biodataProfile" },
  { icon: "🧺", label: "Riwayat Belanja", href: "/profile/riwayatProfile" },
  { icon: "⚙️", label: "Pengaturan & Keamanan", href: "/profile/pengaturanProfile" },
];

type UserData = {
  nama: string;
  email: string;
  activeOrders?: number;
  poinApel?: number;
};

export default function Sprofile() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ==== Data user asli, diambil dari API ====
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.nama) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const initials = user
    ? user.nama
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/id/masuk");
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <div className={styles.avatarBox}>
            <span className={styles.avatar}>{initials || "..."}</span>
            <span className={styles.onlineDot} />
          </div>
          <h3 className={styles.profileName}>{user ? user.nama : "Memuat..."}</h3>
          <p className={styles.profileEmail}>{user ? user.email : ""}</p>
        </div>

        <nav className={styles.menu}>
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.menuItem} ${active ? styles.menuItemActive : ""}`}
              >
                <span className={styles.menuLeft}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span
                    className={`${styles.menuBadge} ${
                      active ? styles.menuBadgeActive : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            className={`${styles.menuItem} ${styles.menuItemDanger} ${
              showLogoutModal ? styles.menuItemDangerActive : ""
            }`}
            onClick={() => setShowLogoutModal(true)}
          >
            <span className={styles.menuLeft}>
              <span>↪</span>
              <span>Keluar Akun</span>
            </span>
            {showLogoutModal && <span className={styles.dangerDot} />}
          </button>
        </nav>

        <div className={styles.helpBox}>
          <p className={styles.helpTitle}>Butuh Bantuan Akun?</p>
          <p className={styles.helpText}>
            Hubungi Layanan Sahabat Malang Fresh setiap hari 08.00 - 21.00 WIB.
          </p>
        </div>
      </aside>

      {/* ================= MODAL KONFIRMASI LOGOUT ================= */}
      {showLogoutModal && (
        <div className={styles.overlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalIcon}>↪</span>

            <h2 className={styles.modalTitle}>
              Yakin Ingin Keluar dari Akun Malang Fresh?
            </h2>

            <p className={styles.modalDesc}>
              Kamu masih memiliki{" "}
              <span className={styles.highlightOrange}>
                {user?.activeOrders ?? 0} pesanan aktif
              </span>{" "}
              yang sedang dikirim dan{" "}
              <span className={styles.highlightBrown}>
                {user?.poinApel ?? 0} Poin Apel
              </span>{" "}
              yang belum ditukarkan. Pastikan kamu mengingat email dan kata sandi
              saat ingin masuk kembali.
            </p>

            <div className={styles.userBox}>
              <span className={styles.userAvatar}>{initials}</span>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.nama}</p>
                <p className={styles.userEmail}>{user?.email}</p>
              </div>
              <span className={styles.memberTag}>MEMBER EMAS</span>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
              >
                Batal &amp; Tetap di Sini
              </button>
              <button
                className={styles.btnConfirm}
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Memproses..." : "Ya, Keluar dari Akun"}
              </button>
            </div>

            <p className={styles.helpLink}>
              Mengalami kendala keamanan akun?{" "}
              <a href="#" className={styles.link}>
                Lapor ke Tim Bantuan
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}