'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const wilayas = ["16. الجزائر","31. وهران","25. قسنطينة","06. بجاية","09. البليدة","19. سطيف","23. عنابة","13. تلمسان","18. جيجل","05. باتنة","07. بسكرة","10. البويرة","35. بومرداس","15. تيزي وزو","42. تيبازة","03. الأغواط","30. ورقلة","47. غرداية","11. تمنراست","44. عين الدفلى"];
const categories = ["حلاق","كهربائي","ترصيص (Plombier)","تبريد وتكييف","ميكانيكي","طبيب أسنان","محامي","مدرسة خاصة","تصليح هواتف","خياطة","مطعم","مخبزة","بناء","دهان"];

const staticCards = [
  { id: '1', business_name: "د. أمين بن علي", category: "طبيب أسنان", wilaya: "16. الجزائر", description: "أخصائي في زراعة وتجميل الأسنان، خبرة أكثر من 10 سنوات في العاصمة.", phone: "0555 12 34 56", image_url: "/4.webp", lat: 36.7538, lng: 3.0588 },
  { id: '2', business_name: "إليكتريك برو", category: "كهربائي", wilaya: "31. وهران", description: "تركيب وصيانة جميع الشبكات الكهربائية المنزلية والصناعية.", phone: "0666 98 76 54", image_url: "/7.webp", lat: 35.6969, lng: -0.6331 },
  { id: '3', business_name: "صالون الحلاقة العصري", category: "حلاق", wilaya: "25. قسنطينة", description: "حلاقة عصرية، تنظيف بشرة، وخدمات VIP لزبائننا في قسنطينة.", phone: "0770 11 22 33", image_url: "/8.png", lat: 36.3650, lng: 6.6147 },
  { id: '4', business_name: "ميكانيك السريع", category: "ميكانيكي", wilaya: "19. سطيف", description: "فحص بالكمبيوتر وإصلاح محركات الديزل والبنزين.", phone: "0551 22 33 44", image_url: "/mal.webp", lat: 36.1898, lng: 5.4107 },
];

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'results' | 'specialties' | 'pitch'>('home');
  const [loading, setLoading] = useState(false);
  const [latestListings, setLatestListings] = useState<any[]>([]);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await fetch('/api/profiles');
      const data = await res.json();
      if (data.success) setLatestListings(data.data || []);
    } catch (err) {
      console.error('Fetch latest error:', err);
    }
  };

  const handleSearch = async (catOverride?: string) => {
    setLoading(true);
    setView('results');
    try {
      const params = new URLSearchParams();
      if (searchText) params.set('search', searchText);
      if (selectedWilaya) params.set('wilaya', selectedWilaya);
      if (catOverride || selectedCat) params.set('category', catOverride || selectedCat);

      const res = await fetch(`/api/profiles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchByCat = (cat: string) => {
    setSelectedCat(cat);
    handleSearch(cat);
  };

  const resetView = () => {
    setView('home');
    setResults(null);
    setSearchText('');
    setSelectedWilaya('');
    setSelectedCat('');
  };

  return (
    <>
      <Navbar />

      {/* HOME VIEW */}
      {view === 'home' && (
        <>
          <section className="w-hero" suppressHydrationWarning>
            <div className="w-hero-text" suppressHydrationWarning>
              <h1 className="w-hero-title">ابحث عن <span>المحترفين</span></h1>
              <p className="w-hero-sub">اكبر منصة جزائرية لجمع بطاقات الأعمال. حلاق، طبيب، ميكانيكي.. كلش كاين!</p>
            </div>

            <div className="w-search-card" suppressHydrationWarning>
              <div className="w-search-input" suppressHydrationWarning>
                <i className="fa-solid fa-search"></i>
                <input type="text" placeholder="عن ماذا تبحث؟ (اسم، نشاط...)" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              </div>
              <div className="w-search-selects" suppressHydrationWarning>
                <select value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}>
                  <option value="">كل الولايات</option>
                  {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                  <option value="">كل المجالات</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button className="w-search-btn" onClick={() => handleSearch()}>بحث</button>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }} suppressHydrationWarning>
              <button className="w-btn-outline" onClick={() => setView('specialties')}>
                <i className="fa-solid fa-th-large" style={{ color: '#F97316' }}></i> التخصصات
              </button>
              <button className="w-btn-outline" onClick={() => setView('pitch')}>
                <i className="fa-solid fa-rocket" style={{ color: '#F97316' }}></i> أضف عملك
              </button>
            </div>
          </section>

          {/* LATEST LISTINGS SECTION */}
          <section className="w-latest-listings" dir="rtl" style={{ padding: '64px 1.5rem', background: '#F9FAFB' }} suppressHydrationWarning>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }} suppressHydrationWarning>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }} suppressHydrationWarning>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>
                  <i className="fa-solid fa-fire" style={{ color: '#F97316', marginLeft: '10px' }}></i>
                  أحدث المحترفين المنضمين
                </h2>
                <button className="w-btn-outline" onClick={() => handleSearch()}>
                  عرض الكل <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
{/* i will be the best hacker in the world  */}
              {/* i will be the best hacker in the word  */}
              {latestListings.length > 0 ? (
                <div className="w-cards-grid">
                  {latestListings.slice(0, 8).map(card => (
                    <div key={card.id} className="w-card w-animate" onClick={() => setSelectedProfile(card)}>
                      {card.image_url ? (
                        <img src={card.image_url} alt={card.business_name} />
                      ) : (
                        <div style={{ height: '180px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontSize: '3rem' }}>
                          <i className="fa-solid fa-store"></i>
                        </div>
                      )}
                      <h3>{card.business_name}</h3>
                      <p className="w-card-cat">{card.category}</p>
                      <p className="w-card-loc"><i className="fa-solid fa-location-dot" style={{ marginLeft: '4px' }}></i> {card.wilaya}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontWeight: 700 }} suppressHydrationWarning>
                  جاري تحميل القائمة...
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* RESULTS VIEW */}
      {view === 'results' && results && (
        <>
          <div style={{ background: 'linear-gradient(-45deg, #ea580c, #f97316, #fdba74, #ffffff)', backgroundSize: '400% 400%', animation: 'gradientX 10s ease infinite', padding: '16px 1.5rem', position: 'sticky', top: '64px', zIndex: 40 }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={resetView} className="w-btn-outline" style={{ background: 'rgba(255,255,255,0.8)' }}>
                <i className="fa-solid fa-home"></i> الرئيسية
              </button>
              <div className="w-search-card" style={{ padding: '8px', boxShadow: 'none', flex: 1, minWidth: '300px', flexDirection: 'row', alignItems: 'center' }}>
                <div className="w-search-input" style={{ flex: 1 }}>
                  <i className="fa-solid fa-search"></i>
                  <input type="text" placeholder="بحث..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                </div>
                <button className="w-search-btn" style={{ padding: '10px 24px' }} onClick={() => handleSearch()}>بحث</button>
              </div>
            </div>
          </div>

          <div className="w-results">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '96px 0', color: '#F97316' }}>
                <i className="fa-solid fa-spinner w-spin" style={{ fontSize: '2.5rem' }}></i>
                <p style={{ marginTop: '16px', fontWeight: 700 }}>جاري البحث...</p>
              </div>
            ) : results && results.length > 0 ? (
              <>
                <p className="w-results-count">تم العثور على {results.length} محترف</p>
                <div className="w-cards-grid">
                  {results.map(card => (
                    <div key={card.id} className="w-card w-animate" onClick={() => setSelectedProfile(card)}>
                      <img src={card.image_url} alt={card.business_name} />
                      <h3>{card.business_name}</h3>
                      <p className="w-card-cat">{card.category}</p>
                      <p className="w-card-loc"><i className="fa-solid fa-location-dot" style={{ marginLeft: '4px' }}></i> {card.wilaya}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '96px 0' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6B7280' }}>لم نجد أي نتائج!</h3>
              </div>
            )}
          </div>
        </>
      )}

      {/* SPECIALTIES VIEW */}
      {view === 'specialties' && (
        <div style={{ background: 'white', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', padding: '64px 1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>تصفح حسب التخصص</h2>
            <button onClick={resetView} className="w-btn-outline" style={{ marginTop: '16px' }}>
              <i className="fa-solid fa-arrow-right"></i> العودة
            </button>
          </div>
          <div className="w-specialties-grid">
            {categories.map(cat => (
              <div key={cat} className="w-specialty-card" onClick={() => searchByCat(cat)}>
                <i className="fa-solid fa-briefcase"></i>
                <p>{cat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PITCH VIEW */}
      {view === 'pitch' && (
        <div>
          <div className="w-pitch-header">
            <h1>حاب تكبر خدمتك وتجيب كليان جدد؟</h1>
            <p>نحن هنا لنقل عملك من الطريقة التقليدية المكلفة إلى العالم الرقمي المتطور.</p>
            <button onClick={resetView} className="w-btn-outline" style={{ marginTop: '24px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <i className="fa-solid fa-arrow-right"></i> العودة
            </button>
          </div>

          <div className="w-pitch-grid">
            <div className="w-pitch-problem">
              <h3><i className="fa-solid fa-circle-xmark" style={{ marginLeft: '8px' }}></i> المشاكل التي تواجهها حالياً:</h3>
              <ul className="w-pitch-list">
                <li><i className="fa-solid fa-minus" style={{ color: '#FCA5A5' }}></i> توزيع يدوي للبطاقات الورقية (تكلفة طباعة عالية وضياع سريع).</li>
                <li><i className="fa-solid fa-minus" style={{ color: '#FCA5A5' }}></i> ميزانية ضخمة للـ &quot;Sponsored&quot; يومياً على فيسبوك وإنستغرام.</li>
                <li><i className="fa-solid fa-minus" style={{ color: '#FCA5A5' }}></i> صعوبة وصول الزبائن لك عندما يبحثون في محركات البحث.</li>
                <li><i className="fa-solid fa-minus" style={{ color: '#FCA5A5' }}></i> عدم وجود واجهة احترافية ثابتة تعرض أعمالك وموقعك بدقة.</li>
              </ul>
            </div>
            <div className="w-pitch-solution">
              <h3><i className="fa-solid fa-circle-check" style={{ marginLeft: '8px' }}></i> الحل مع منصة &quot;وصلة&quot;:</h3>
              <ul className="w-pitch-list">
                <li><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> بطاقة أعمال رقمية دائمة قابلة للمشاركة بضغطة زر.</li>
                <li><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> تواجد دائم في نتائج البحث دون الحاجة لدفع مبالغ يومية.</li>
                <li><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> ربط مباشر مع خرائط جوجل ورقم الهاتف والواتساب.</li>
                <li><i className="fa-solid fa-check" style={{ color: '#22c55e' }}></i> تكلفة سنوية رمزية أقل من ثمن طباعة رزمة واحدة من البطاقات!</li>
              </ul>
            </div>
          </div>

          <div className="w-pricing">
            <h2>اختر العرض المناسب لك</h2>
            <div className="w-price-card featured">
              <div className="w-price-badge">العرض الأكثر طلباً</div>
              <h3>باقة البطاقة الرقمية</h3>
              <div className="w-price-amount">1000 دج <span>/ سنة كاملة</span></div>
              <ul className="w-price-features">
                <li><i className="fa-solid fa-check"></i> ظهور كامل في نتائج البحث بالمنصة</li>
                <li><i className="fa-solid fa-check"></i> بروفايل احترافي خاص بك</li>
                <li><i className="fa-solid fa-check"></i> عرض معلومات الاتصال والموقع</li>
                <li><i className="fa-solid fa-check"></i> دعم فني طوال السنة</li>
              </ul>
              <Link href="/register" className="w-btn" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.05rem', borderRadius: '12px' }}>اشترك الآن</Link>
            </div>
            <div className="w-price-card">
              <h3>المساحات الإعلانية</h3>
              <p style={{ color: '#9CA3AF', fontWeight: 700, marginBottom: '20px', fontStyle: 'italic' }}>لأصحاب الشركات الذين يريدون الظهور في الواجهة الرئيسية وبشكل دائم.</p>
              <ul className="w-price-features">
                <li><i className="fa-solid fa-check" style={{ color: '#F97316' }}></i> إعلان &quot;Banners&quot; في الصفحة الرئيسية</li>
                <li><i className="fa-solid fa-check" style={{ color: '#F97316' }}></i> تمييز العمل في أعلى نتائج البحث</li>
                <li><i className="fa-solid fa-check" style={{ color: '#F97316' }}></i> استهداف دقيق لولايات معينة</li>
              </ul>
              <button className="w-btn-dark" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '12px' }}>تواصل معنا</button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {selectedProfile && (
        <div className="w-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setSelectedProfile(null); }}>
          <div className="w-modal w-modal--v2">
            <button className="w-modal-close" onClick={() => { setSelectedProfile(null); setActiveImage(null); }}>
              <i className="fa-solid fa-times"></i>
            </button>
            
            <div className="w-modal-header-v2">
              <div className="w-modal-logo-v2">
                {selectedProfile.logo_url ? (
                  <img src={selectedProfile.logo_url} alt="" />
                ) : (
                  <div className="w-modal-logo-placeholder"><i className="fa-solid fa-store"></i></div>
                )}
              </div>
              <div className="w-modal-header-text">
                <h2>{selectedProfile.business_name}</h2>
                <p className="cat">{selectedProfile.category}</p>
                <div className="w-modal-badges">
                  <span className="w-badge-loc"><i className="fa-solid fa-location-dot"></i> {selectedProfile.wilaya}</span>
                  {selectedProfile.status === 'active' && <span className="w-badge-status"><i className="fa-solid fa-check-circle"></i> موثق</span>}
                </div>
              </div>
            </div>

            <div className="w-modal-body-v2">
              <div className="w-modal-main-content">
                <section className="w-modal-section">
                  <h3><i className="fa-solid fa-info-circle"></i> عن المحترف</h3>
                  <p>{selectedProfile.description || 'لا يوجد وصف متاح لهذا النشاط.'}</p>
                </section>

                <div className="w-modal-contact-grid">
                  <div className="w-contact-card">
                    <i className="fa-solid fa-phone"></i>
                    <div>
                      <span>رقم الهاتف</span>
                      <strong>{selectedProfile.phone}</strong>
                    </div>
                  </div>
                  {selectedProfile.whatsapp && (
                    <div className="w-contact-card whatsapp">
                      <i className="fa-brands fa-whatsapp"></i>
                      <div>
                        <span>واتساب</span>
                        <strong>{selectedProfile.whatsapp}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-modal-socials">
                  {selectedProfile.facebook && <a href={selectedProfile.facebook} target="_blank" className="social-link fb"><i className="fa-brands fa-facebook-f"></i></a>}
                  {selectedProfile.instagram && <a href={selectedProfile.instagram} target="_blank" className="social-link ig"><i className="fa-brands fa-instagram"></i></a>}
                  {selectedProfile.tiktok && <a href={selectedProfile.tiktok} target="_blank" className="social-link tk"><i className="fa-brands fa-tiktok"></i></a>}
                </div>

                <section className="w-modal-section">
                  <h3><i className="fa-solid fa-map-marked-alt"></i> الموقع الجغرافي</h3>
                  <div className="w-map-container-v2">
                    <iframe
                      src={`https://www.google.com/maps?q=${selectedProfile.latitude || selectedProfile.lat || 36.7538},${selectedProfile.longitude || selectedProfile.lng || 3.0588}&hl=ar&z=15&output=embed`}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </section>
              </div>

              <div className="w-modal-gallery-side">
                <div className="w-main-image-view">
                  <img src={activeImage || selectedProfile.logo_url || selectedProfile.image_url || (selectedProfile.images && selectedProfile.images[0]) || '/placeholder.png'} alt="" />
                </div>
                {selectedProfile.images && selectedProfile.images.length > 0 && (
                  <div className="w-gallery-thumbnails">
                    {selectedProfile.images.map((img: string, i: number) => (
                      <div key={i} className={`w-thumb ${activeImage === img ? 'active' : ''}`} onClick={() => setActiveImage(img)}>
                        <img src={img} alt="" />
                      </div>
                    ))}
                    {selectedProfile.image_url && (
                       <div className={`w-thumb ${activeImage === selectedProfile.image_url ? 'active' : ''}`} onClick={() => setActiveImage(selectedProfile.image_url)}>
                        <img src={selectedProfile.image_url} alt="" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-modal-footer-v2">
              <a href={`tel:${selectedProfile.phone}`} className="w-btn w-btn--call">
                <i className="fa-solid fa-phone-volume"></i> اتصل بالمحترف
              </a>
              {selectedProfile.whatsapp && (
                <a href={`https://wa.me/${selectedProfile.whatsapp}`} target="_blank" className="w-btn w-btn--wa">
                  <i className="fa-brands fa-whatsapp"></i> مراسلة واتساب
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {(view !== 'home' || results) && <Footer />}
    </>
  );
}
