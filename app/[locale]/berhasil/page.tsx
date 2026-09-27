"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import "./berhasil.css";

function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button className={className} onClick={handleCopy}>
      {copied ? "Tersalin!" : label}
    </button>
  );
}

export default function BerhasilPage() {
  return (
    <>

      <main className="sukses-page">
        <div className="sukses-card">
          <div className="success-icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E9B57"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1>Pesanan Berhasil Dibuat!</h1>
          <p className="sukses-sub">
            Terima kasih, <strong>Budi</strong>. Pesanan Anda segera diproses
            oleh Malang Fresh.
          </p>

          <div className="order-number-pill">
            <span className="order-label">No. Pesanan:</span>
            <code className="order-code">#MLG-20260908-8829</code>
            <CopyButton
              text="#MLG-20260908-8829"
              label="Salin"
              className="copy-link-btn"
            />
          </div>

          <div className="status-bar">
            <span className="status-left">
              <span className="status-dot"></span>
              Status: <strong>Menunggu Pembayaran</strong>
            </span>
            <span className="status-right">
              Estimasi Tiba: <strong>10 Sep 2026</strong>
            </span>
          </div>

          <div className="total-box">
            <div className="total-row">
              <span className="total-label">Total Tagihan</span>
              <span className="total-amount">Rp 125.500</span>
            </div>

            <div className="bank-box">
              <div className="bank-info">
                <span className="bank-label">TRANSFER BANK BCA</span>
                <span className="bank-number">893 123 4567</span>
                <span className="bank-caption">a/n 1ownstore Malang</span>
              </div>
              <CopyButton
                text="8931234567"
                label="Salin No Rek"
                className="copy-btn"
              />
            </div>
          </div>

          <div className="items-section">
            <div className="items-head">
              <span className="items-label">
                RINGKASAN ITEM <span className="items-pill">3 Produk</span>
              </span>
              <Link href="/riwayat" className="items-detail-link">
                Rincian Pesanan
              </Link>
            </div>

            <div className="order-item">
              <span className="qty-badge">2x</span>
              <div className="item-info">
                <strong>Keripik Apel Malang Manalagi Premium</strong>
                <span className="item-unit">@ Rp 35.000</span>
              </div>
              <span className="item-total">Rp 70.000</span>
            </div>

            <div className="order-item">
              <span className="qty-badge">3x</span>
              <div className="item-info">
                <strong>Sari Apel Murni Brosem Batu</strong>
                <span className="item-unit">@ Rp 16.000</span>
              </div>
              <span className="item-total">Rp 48.000</span>
            </div>

            <div className="order-item">
              <span className="qty-badge">1x</span>
              <div className="item-info">
                <strong>Keripik Tempe Renyah Khas Sanan</strong>
                <span className="item-unit">@ Rp 22.500</span>
              </div>
              <span className="item-total">Rp 22.500</span>
            </div>
          </div>

          <div className="address-box">
            <div className="address-head">
              <span className="address-label">📍 ALAMAT PENGIRIMAN</span>
              <span className="courier-pill">J&amp;T Express</span>
            </div>
            <div className="address-name-row">
              <strong>Budi Santoso</strong>
              <span className="dot-sep"></span>
              <span>0812-3456-7890</span>
            </div>
            <p className="address-text">
              Jl. Ijen No. 45, RT 02 / RW 04, Kel. Klojen, Kota Malang, Jawa
              Timur 65115
            </p>
          </div>

          <br />
          <br />

          <div className="status-bar">
            <span className="status-left">
              <Link href="/">Kembali Keberanda</Link>
            </span>
            <span className="status-right">
              <Link href="/lacak">
                <strong>Lacak Pesanan</strong>
              </Link>
            </span>
          </div>
        </div>
      </main>

      
    </>
  );
}