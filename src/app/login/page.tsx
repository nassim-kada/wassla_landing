'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'فشل تسجيل الدخول'); return; }
      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_email', data.user.email);
      router.push('/dashboard');
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-auth-wrapper w-auth-user-bg">
      {/* Back link */}
      <Link href="/" className="w-auth-back">
        <i className="fa-solid fa-arrow-right"></i> العودة للرئيسية
      </Link>

      <div className="w-auth-card w-auth-card-user">
        <div className="w-auth-logo w-auth-logo-user">
          <i className="fa-solid fa-briefcase"></i>
        </div>
        <h1 className="w-auth-title">مرحباً بعودتك</h1>
        <p className="w-auth-subtitle">سجّل دخولك لإدارة ملفك المهني</p>

        {error && (
          <div className="w-error-box">
            <i className="fa-solid fa-circle-exclamation" style={{ marginLeft: '6px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'right' }}>
          <div className="w-form-group">
            <label className="w-form-label">
              <i className="fa-solid fa-envelope" style={{ marginLeft: '6px', color: '#F97316' }}></i>
              البريد الإلكتروني
            </label>
            <input
              className="w-form-control"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="w-form-group">
            <label className="w-form-label">
              <i className="fa-solid fa-lock" style={{ marginLeft: '6px', color: '#F97316' }}></i>
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="w-form-control"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-btn"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px', fontSize: '1rem', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading
              ? <><i className="fa-solid fa-spinner w-spin"></i> جاري التحقق...</>
              : <><i className="fa-solid fa-right-to-bracket"></i> تسجيل الدخول</>
            }
          </button>
        </form>

        <div className="w-auth-divider"><span>أو</span></div>

        <Link href="/register" className="w-btn-outline" style={{ display: 'flex', justifyContent: 'center', padding: '13px', borderRadius: '12px', textDecoration: 'none' }}>
          <i className="fa-solid fa-user-plus"></i> حساب جديد — سجّل عملك
        </Link>
      </div>
    </div>
  );
}
