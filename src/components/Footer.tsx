import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-footer-v2">
      <div className="w-footer-inner">

        {/* Brand Column */}
        <div className="w-footer-col w-footer-brand-col">
          <Link href="/" className="w-footer-logo">
            <i className="fa-solid fa-address-card"></i>
            <span>Wassla</span>
          </Link>
          <p className="w-footer-tagline">
            الدليل الجزائري الأذكى للمهنيين والخدمات. ابحث، تواصل، ونجح.
          </p>
          <div className="w-footer-socials">
            <a href="#" className="w-footer-social" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="w-footer-social" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="w-footer-social" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-footer-col">
          <h4 className="w-footer-heading">روابط سريعة</h4>
          <ul className="w-footer-links">
            <li><Link href="/">الرئيسية</Link></li>
            <li><Link href="/#specialties">التخصصات</Link></li>
            <li><Link href="/register">أضف نشاطك</Link></li>
            <li><Link href="/login">دخول الأعضاء</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="w-footer-col">
          <h4 className="w-footer-heading">الدعم</h4>
          <ul className="w-footer-links">
            <li><a href="mailto:contact@wassla.dz">تواصل معنا</a></li>
            <li><Link href="/register">سجّل عملك</Link></li>
            <li><a href="#">سياسة الخصوصية</a></li>
          </ul>
        </div>

        {/* CTA */}
        <div className="w-footer-col w-footer-cta-col">
          <h4 className="w-footer-heading">انضم إلى Wassla</h4>
          <p className="w-footer-cta-text">سجّل عملك مجاناً واوصل لآلاف العملاء في جميع ولايات الجزائر.</p>
          <Link href="/register" className="w-btn w-footer-cta-btn">
            <i className="fa-solid fa-rocket"></i> ابدأ الآن
          </Link>
          <div className="w-footer-admin-link">
            <Link href="/admin/login">
              <i className="fa-solid fa-shield-halved"></i> لوحة المسؤول
            </Link>
          </div>
        </div>

      </div>

      <div className="w-footer-bottom">
        <p>© {year} Wassla — جميع الحقوق محفوظة. صُنع بـ <i className="fa-solid fa-heart" style={{color:'#F97316'}}></i> في الجزائر</p>
      </div>
    </footer>
  );
}
