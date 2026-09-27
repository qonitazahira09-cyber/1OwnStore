"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AppShell, { MenuKey } from "@/components/sideNav";

/* ------------------------------------------------------------------ */
/*  Map URL path -> active sidebar menu                                */
/*  Sesuaikan key & path di bawah ini dengan route admin kamu yang     */
/*  sebenarnya (mis. jika folder-nya bukan /admin/pesanan, ganti).     */
/* ------------------------------------------------------------------ */

function getActiveMenu(pathname: string): MenuKey {
  if (pathname.startsWith("/admin/kelola")) return "produk";
  if (pathname.startsWith("/admin/pesanan")) return "pesanan";
  if (pathname.startsWith("/admin/laporan")) return "laporan";
  if (pathname.startsWith("/admin/pengaturan")) return "pengaturan";
  return "dashboard";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeMenu = getActiveMenu(pathname);

  return <AppShell activeMenu={activeMenu}>{children}</AppShell>;
}