'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  business_name: string;
  owner_name: string;
  category: string;
  wilaya: string;
  address: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  location_link: string;
  latitude: number;
  longitude: number;
  facebook: string;
  instagram: string;
  tiktok: string;
  image_url: string;
  images: string[];
  status: string;
  is_published: boolean;
  code: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/profiles?${params}`);
      const data = await res.json();
      if (data.success) setProfiles(data.data || []);
    } catch { /* */ } finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) { router.push('/admin/login'); return; }
    fetchProfiles();
  }, [fetchProfiles, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    const res = await fetch('/api/admin/profiles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if ((await res.json()).success) setProfiles(profiles.filter(p => p.id !== id));
  };

  const handleToggle = async (id: string, current: boolean) => {
    const res = await fetch('/api/admin/profiles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_published: !current }) });
    if ((await res.json()).success) setProfiles(profiles.map(p => p.id === id ? { ...p, is_published: !current } : p));
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch('/api/admin/profiles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if ((await res.json()).success) setProfiles(profiles.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div className="w-dash-container" dir="rtl">
      <aside className="w-sidebar">
        <div className="w-sidebar-header">
          <span className="w-sidebar-logo"><i className="fa-solid fa-address-card" style={{ marginLeft: '6px' }}></i> Wassla</span>
        </div>
        <div className="w-sidebar-nav">
          <Link href="#" className="w-sidebar-link active"><i className="fa-solid fa-users"></i> الملفات <span className="w-sidebar-badge">{profiles.length}</span></Link>
          <Link href="#" className="w-sidebar-link"><i className="fa-solid fa-file-lines"></i> طلبات جديدة</Link>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }} className="w-sidebar-link">
            <i className="fa-solid fa-right-from-bracket"></i> خروج
          </button>
        </div>
      </aside>

      <main className="w-dash-main">
        <header className="w-dash-topbar">
          <span style={{ fontWeight: 800 }}><i className="fa-solid fa-gauge" style={{ marginLeft: '8px', color: '#F97316' }}></i> لوحة التحكم</span>
        </header>
        <div className="w-dash-content">
          <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="w-btn" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '10px 16px' }}>
              <i className="fa-solid fa-plus"></i> إضافة
            </Link>
            <span style={{ color: '#6B7280', fontWeight: 700, fontSize: '0.9rem' }}>{profiles.length} ملف</span>
            <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
              <i className="fa-solid fa-search" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}></i>
              <input className="w-form-control" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProfiles()} style={{ paddingRight: '36px' }} />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
              <i className="fa-solid fa-spinner w-spin" style={{ fontSize: '2rem' }}></i>
              <p style={{ marginTop: '12px' }}>جاري التحميل...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>لا توجد ملفات</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profiles.map(p => (
                <div key={p.id} className="w-admin-card" style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setSelectedProfile(p)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt="" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #F3F4F6' }} />
                    ) : (
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB' }}>
                        <i className="fa-solid fa-store"></i>
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.business_name}
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: p.status === 'active' ? '#F0FDF4' : '#FEF3C7', color: p.status === 'active' ? '#16a34a' : '#d97706' }}>
                          {p.status === 'active' ? 'نشط' : p.status === 'pending' ? 'قيد المراجعة' : 'منتهي'}
                        </span>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{p.category} — {p.wilaya}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF' }}>الهاتف: {p.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {p.status === 'pending' && (
                      <button onClick={() => handleStatusChange(p.id, 'active')} className="w-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        <i className="fa-solid fa-check"></i> تفعيل
                      </button>
                    )}
                    <div onClick={() => handleToggle(p.id, p.is_published)} style={{ width: '40px', height: '24px', background: p.is_published ? '#F97316' : '#D1D5DB', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: p.is_published ? '2px' : '18px', transition: 'left 0.2s' }}></div>
                    </div>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-trash-can" style={{ transition: 'color 0.2s' }}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* DETAIL MODAL */}
      {selectedProfile && (
        <div className="w-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setSelectedProfile(null); }}>
          <div className="w-modal" style={{ maxWidth: '800px' }}>
            <button className="w-modal-close" onClick={() => setSelectedProfile(null)}>
              <i className="fa-solid fa-times"></i>
            </button>
            <div className="w-modal-grid">
              <div className="w-modal-sidebar">
                <div className="w-modal-images-scroll">
                  {selectedProfile.images && selectedProfile.images.length > 0 ? (
                    selectedProfile.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="" style={{ width: '100%', borderRadius: '12px', marginBottom: '8px', objectFit: 'cover' }} />
                    ))
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: '16px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontSize: '4rem', marginBottom: '16px' }}>
                      <i className="fa-solid fa-store"></i>
                    </div>
                  )}
                </div>
                <div className="w-modal-info-box">
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>{selectedProfile.business_name}</h2>
                  <p className="cat" style={{ color: '#F97316', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px' }}>{selectedProfile.category}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="info-row"><i className="fa-solid fa-user"></i> <span style={{ fontWeight: 700 }}>{selectedProfile.owner_name || 'غير محدد'}</span></div>
                    <div className="info-row"><i className="fa-solid fa-location-dot"></i> <span>{selectedProfile.wilaya} — {selectedProfile.address}</span></div>
                    <div className="info-row" dir="ltr"><i className="fa-solid fa-phone"></i> <span>{selectedProfile.phone}</span></div>
                    {selectedProfile.whatsapp && <div className="info-row" dir="ltr"><i className="fa-brands fa-whatsapp" style={{ color: '#22c55e' }}></i> <span>{selectedProfile.whatsapp}</span></div>}
                    {selectedProfile.email && <div className="info-row" dir="ltr"><i className="fa-solid fa-envelope"></i> <span>{selectedProfile.email}</span></div>}
                  </div>
                </div>
              </div>
              <div className="w-modal-main">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>عن النشاط:</h3>
                <p style={{ lineHeight: 1.7, color: '#4B5563', fontWeight: 600, marginBottom: '24px' }}>{selectedProfile.description || 'لا يوجد وصف'}</p>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>الروابط الاجتماعية:</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  {selectedProfile.facebook && <a href={selectedProfile.facebook} target="_blank" style={{ color: '#1877F2', fontSize: '1.5rem' }}><i className="fa-brands fa-facebook"></i></a>}
                  {selectedProfile.instagram && <a href={selectedProfile.instagram} target="_blank" style={{ color: '#E4405F', fontSize: '1.5rem' }}><i className="fa-brands fa-instagram"></i></a>}
                  {selectedProfile.tiktok && <a href={selectedProfile.tiktok} target="_blank" style={{ color: '#000', fontSize: '1.5rem' }}><i className="fa-brands fa-tiktok"></i></a>}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>الموقع الجغرافي:</h3>
                {selectedProfile.latitude && selectedProfile.longitude ? (
                  <div className="w-map-container" style={{ height: '200px' }}>
                    <iframe
                      src={`https://www.google.com/maps?q=${selectedProfile.latitude},${selectedProfile.longitude}&hl=ar&z=15&output=embed`}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                ) : selectedProfile.location_link ? (
                  <a href={selectedProfile.location_link} target="_blank" className="w-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-external-link"></i> فتح الموقع في خرائط جوجل
                  </a>
                ) : <p style={{ color: '#9CA3AF' }}>لم يتم تحديد موقع</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
