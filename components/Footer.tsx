import Link from 'next/link';
export default function Footer() {
  return (
<footer className="site-footer">
  <div className="footer-inner">
    <div className="footer-col brand-col">
      <h3>1OwnStore <span color="orange" className="dot orange"></span></h3>
      <p>Oleh-oleh khas Malang yang fresh &amp; renyah.</p>
      <p className="footer-address"> Jl. Raya Malang No. 123</p>
    </div>

    <div className="footer-col">
      <h4><span className="dot orange"></span>BANTUAN</h4>
      <Link href="#">About Us</Link>
      <Link href="#">Shipping Policy</Link>
      <Link href="#">Terms of Service</Link>
      <Link href="#">FAQ &amp; Return Policy</Link>
    </div>

    <div className="footer-col">
      <h4><span className="dot orange"></span>HUBUNGI KAMI</h4>
      <p>WhatsApp</p>
      <p>Instagram</p>
      <p>Facebook</p>
      
    </div>
  </div>

  <div className="footer-bottom">
    <p>&copy; 2026 Malang Fresh. All Rights Reserved.</p>
    <div className="footer-badges">
      <span className="badge-label">PAYMENT</span>
      <span className="pay-chip">QRIS</span>
      <span className="pay-chip">BCA</span>
      <span className="badge-label">SHIPPING</span>
      <span className="pay-chip">JNE</span>
      <span className="pay-chip">J&amp;T</span>
    </div>
  </div>
</footer>
  );
}