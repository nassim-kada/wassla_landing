'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user_token'));
  }, []);

  return (
    <nav className="w-navbar" suppressHydrationWarning>
      <div className="w-navbar-inner" suppressHydrationWarning>
        {/* Logo — always left in LTR, but this is Arabic so it's on the right side of the flex */}
        <Link href="/" className="w-logo">
          <i className="fa-solid fa-address-card"></i>
          <span>Wassla</span>
        </Link>

        {/* Center nav links */}
        <div className="w-nav-links" suppressHydrationWarning>
          <Link href="/" className={`w-nav-link ${pathname === '/' ? 'w-nav-link--active' : ''}`}>
            الرئيسية
          </Link>
          <Link href="/#specialties" className="w-nav-link">
            التخصصات
          </Link>
        </div>

        {/* Right-side actions */}
        <div className="w-nav-actions" suppressHydrationWarning>
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-nav-link w-nav-link--icon">
            <i className="fa-solid fa-circle-user"></i>
            <span className="w-nav-link-label">{isLoggedIn ? 'حسابي' : 'دخول'}</span>
          </Link>
          <Link href="/register" className="w-btn w-btn--nav">
            <i className="fa-solid fa-plus"></i>
            أضف عملك
          </Link>
        </div>
      </div>
    </nav>
  );
}
