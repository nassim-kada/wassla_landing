'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export default function AdminLogin() {
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'فشل تسجيل الدخول'); return; }
      localStorage.setItem('admin_token', data.token);
      router.push('/admin/dashboard');
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-auth-wrapper">
      <div className="w-auth-card">
        <div className="w-auth-logo"><i className="fa-solid fa-lock"></i></div>
        <h1 className="w-auth-title">وصلة</h1>
        <p className="w-auth-subtitle">لوحة تحكم المسؤول</p>

        {error && <div className="w-error-box">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="w-form-group" style={{ textAlign: 'right' }}>
            <label className="w-form-label"><i className="fa-solid fa-envelope" style={{ marginLeft: '6px' }}></i> البريد الإلكتروني</label>
            <input className="w-form-control" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@wassla.dz" />
          </div>
          <div className="w-form-group" style={{ textAlign: 'right' }}>
            <label className="w-form-label"><i className="fa-solid fa-lock" style={{ marginLeft: '6px' }}></i> كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input className="w-form-control" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '40px' }} />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer' }}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
          </div>
          <button type="submit" className="w-btn" style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px' }} disabled={loading}>
            {loading ? <i className="fa-solid fa-spinner w-spin"></i> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
