'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Profile {
  id: string;
  business_name: string;
  category: string;
  wilaya: string;
  status: string;
  is_published: boolean;
  image_url: string;
  phone: string;
  description: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:  { label: 'قيد المراجعة', bg: '#FEF3C7', color: '#d97706' },
  active:   { label: 'نشط',          bg: '#F0FDF4', color: '#16a34a' },
  expired:  { label: 'منتهي',        bg: '#F3F4F6', color: '#6B7280' },
};

export default function UserDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('user_token');
    if (!token) { router.push('/login'); return; }

    try {
      const res = await fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data || []);
        setEmail(data.email || '');
      } else {
        setError('فشل تحميل البيانات');
      }
    } catch {
      setError('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا النشاط؟ لا يمكن التراجع عن هذا الإجراء.')) return;

    const token = localStorage.getItem('user_token');
    try {
      const res = await fetch(`/api/user/profiles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfiles(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'فشل الحذف');
      }
    } catch {
      alert('خطأ في الاتصال');
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-user-dash" dir="rtl">
        {/* Sidebar */}
        <aside className="w-user-sidebar">
          <div className="w-user-avatar">
            <i className="fa-solid fa-circle-user"></i>
            <div>
              <p className="w-user-name">أهلاً بك</p>
              <p className="w-user-email">{email}</p>
            </div>
          </div>

          <nav className="w-user-nav">
            <a href="#profiles" className="w-user-nav-link active">
              <i className="fa-solid fa-store"></i> ملفاتي
              {profiles.length > 0 && <span className="w-sidebar-badge">{profiles.length}</span>}
            </a>
            {profiles.length === 0 && (
              <Link href="/register" className="w-user-nav-link">
                <i className="fa-solid fa-plus"></i> إضافة نشاط
              </Link>
            )}
          </nav>

          <div className="w-user-sidebar-footer">
            <button onClick={handleLogout} className="w-user-logout-btn">
              <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="w-user-main">
          <div className="w-user-topbar">
            <h1 className="w-user-topbar-title">
              <i className="fa-solid fa-gauge" style={{ color: '#F97316', marginLeft: '10px' }}></i>
              لوحة التحكم
            </h1>
            {profiles.length === 0 && (
              <Link href="/register" className="w-btn" style={{ fontSize: '0.85rem', padding: '10px 18px' }}>
                <i className="fa-solid fa-plus"></i> إضافة نشاط جديد
              </Link>
            )}
          </div>

          <div className="w-user-content" id="profiles">
            {/* Stats row */}
            <div className="w-user-stats">
              <div className="w-stat-card">
                <i className="fa-solid fa-store"></i>
                <div>
                  <p className="w-stat-num">{profiles.length}</p>
                  <p className="w-stat-label">إجمالي الملفات</p>
                </div>
              </div>
              <div className="w-stat-card">
                <i className="fa-solid fa-check-circle" style={{ color: '#22c55e' }}></i>
                <div>
                  <p className="w-stat-num">{profiles.filter(p => p.status === 'active').length}</p>
                  <p className="w-stat-label">ملفات نشطة</p>
                </div>
              </div>
              <div className="w-stat-card">
                <i className="fa-solid fa-clock" style={{ color: '#f59e0b' }}></i>
                <div>
                  <p className="w-stat-num">{profiles.filter(p => p.status === 'pending').length}</p>
                  <p className="w-stat-label">قيد المراجعة</p>
                </div>
              </div>
            </div>

            {/* Profiles list */}
            {loading ? (
              <div className="w-user-loading">
                <i className="fa-solid fa-spinner w-spin"></i>
                <p>جاري التحميل...</p>
              </div>
            ) : error ? (
              <div className="w-error-box">{error}</div>
            ) : profiles.length === 0 ? (
              <div className="w-user-empty">
                <i className="fa-solid fa-store-slash"></i>
                <h3>لا توجد ملفات بعد</h3>
                <p>سجّل نشاطك التجاري الآن وابدأ في جذب العملاء</p>
                <Link href="/register" className="w-btn" style={{ marginTop: '16px' }}>
                  <i className="fa-solid fa-plus"></i> أضف أول نشاط
                </Link>
              </div>
            ) : (
              <div className="w-user-profiles-list">
                {profiles.map(p => {
                  const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.pending;
                  return (
                    <div key={p.id} className="w-user-profile-card">
                      <div className="w-upc-left">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.business_name} className="w-upc-img" />
                          : (
                            <div className="w-upc-img-placeholder">
                              <i className="fa-solid fa-store"></i>
                            </div>
                          )
                        }
                        <div className="w-upc-info">
                          <h3 className="w-upc-name">{p.business_name}</h3>
                          <p className="w-upc-cat">
                            <i className="fa-solid fa-tag"></i> {p.category}
                          </p>
                          <p className="w-upc-wilaya">
                            <i className="fa-solid fa-location-dot"></i> {p.wilaya}
                          </p>
                        </div>
                      </div>
                      <div className="w-upc-right">
                        <span className="w-upc-status" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                        <span className="w-upc-published" style={{ background: p.is_published ? '#F0FDF4' : '#F3F4F6', color: p.is_published ? '#16a34a' : '#9CA3AF' }}>
                          <i className={`fa-solid fa-${p.is_published ? 'eye' : 'eye-slash'}`}></i>
                          {p.is_published ? 'مرئي' : 'مخفي'}
                        </span>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="w-btn-delete-small"
                          title="حذف النشاط"
                        >
                          <i className="fa-solid fa-trash"></i> حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
