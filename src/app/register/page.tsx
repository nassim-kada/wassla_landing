'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { 
  ssr: false,
  loading: () => <div className="w-map-placeholder">جاري تحميل الخريطة...</div>
});

const allWilayas = [
  '01 - أدرار','02 - الشلف','03 - الأغواط','04 - أم البواقي','05 - باتنة','06 - بجاية',
  '07 - بسكرة','08 - بشار','09 - البليدة','10 - البويرة','11 - تمنراست','12 - تبسة',
  '13 - تلمسان','14 - تيارت','15 - تيزي وزو','16 - الجزائر','17 - الجلفة','18 - جيجل',
  '19 - سطيف','20 - سعيدة','21 - سكيكدة','22 - سيدي بلعباس','23 - عنابة','24 - قالمة',
  '25 - قسنطينة','26 - المدية','27 - مستغانم','28 - المسيلة','29 - معسكر','30 - ورقلة',
  '31 - وهران','32 - البيض','33 - إليزي','34 - برج بوعريريج','35 - بومرداس',
  '36 - الطارف','37 - تندوف','38 - تيسمسيلت','39 - الوادي','40 - خنشلة',
  '41 - سوق أهراس','42 - تيبازة','43 - ميلة','44 - عين الدفلى','45 - النعامة',
  '46 - عين تيموشنت','47 - غرداية','48 - غليزان','49 - تيميمون','50 - برج باجي مختار',
  '51 - أولاد جلال','52 - بني عباس','53 - عين صالح','54 - عين قزام',
  '55 - تقرت','56 - جانت','57 - المغير','58 - المنيعة',
];
const allCategories = [
  'حلاق','كهربائي','ترصيص (Plombier)','تبريد وتكييف','ميكانيكي','طبيب أسنان','محامي',
  'مدرسة خاصة','تصليح هواتف','صحة وعافية','تجارة ومتاجر','بناء وعقار','مطاعم وأغذية',
  'تعليم وتكوين','خدمات عامة','جمال وموضة','تقنية ورقمية','سيارات ونقل',
];

const STEPS = [
  { num: 1, icon: 'fa-store', label: 'معلومات النشاط' },
  { num: 2, icon: 'fa-phone', label: 'التواصل' },
  { num: 3, icon: 'fa-image', label: 'الصورة والموقع' },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    businessName: '', ownerName: '', category: '', wilaya: '',
    address: '', description: '', phone: '', whatsapp: '',
    email: '', password: '', locationLink: '',
    latitude: null, longitude: null,
    facebook: '', instagram: '', tiktok: ''
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      setIsLoggedIn(true);
      fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.userId) setCurrentUserId(data.userId);
          if (data.data && data.data.length > 0) {
            setHasProfile(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const update = (field: string, val: any) => setFormData((prev: any) => ({ ...prev, [field]: val }));

  const goNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.businessName || !formData.category || !formData.wilaya) {
        setError('يرجى ملء: اسم النشاط، التخصص، والولاية');
        return;
      }
    }
    if (step === 2) {
      if (!formData.phone) {
        setError('رقم الهاتف مطلوب');
        return;
      }
      if (formData.email && formData.password && formData.password.length < 6) {
        setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Upload all images
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const uploadResult = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrls.push(uploadResult.url);
        } else {
          console.error('Failed to upload an image:', uploadResult.error);
        }
      }

      // 2. Optionally create account or use current
      let userId: string | null = currentUserId;
      if (!userId && formData.email && formData.password) {
        const signupRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const signupResult = await signupRes.json();
        if (signupRes.ok) userId = signupResult.userId || null;
        if (!signupRes.ok && !signupResult.error?.includes('مسجل')) {
          setError(signupResult.error || 'فشل إنشاء الحساب');
          setLoading(false);
          return;
        }
      }

      // 3. Upload logo if exists
      let logoUrl = '';
      if (logoFile) {
        const logoData = new FormData();
        logoData.append('file', logoFile);
        const logoRes = await fetch('/api/upload', { method: 'POST', body: logoData });
        const logoResult = await logoRes.json();
        if (logoRes.ok) logoUrl = logoResult.url;
      }

      // 4. Submit profile
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: imageUrls, logo_url: logoUrl, userId }),
      });
      const result = await res.json();
      if (!res.ok) { setError(result.error || 'فشل التسجيل'); setLoading(false); return; }

      setSuccess(true);
    } catch (err: any) {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles: File[] = [];
      const newPreviews: string[] = [];

      files.forEach(file => {
        if (file.size <= 5 * 1024 * 1024) {
          newFiles.push(file);
          newPreviews.push(URL.createObjectURL(file));
        }
      });

      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 2 * 1024 * 1024) {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setError('حجم الشعار يجب أن يكون أقل من 2 ميجابايت');
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
  };

  if (checking) {
    return (
      <>
        <Navbar />
        <div className="w-reg-page">
          <div className="w-user-loading">
            <i className="fa-solid fa-spinner w-spin"></i>
            <p>جاري التحقق...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (hasProfile) {
    return (
      <>
        <Navbar />
        <div className="w-reg-page" dir="rtl">
          <div className="w-reg-success" style={{ borderColor: '#F97316' }}>
            <div className="w-reg-success-icon" style={{ color: '#F97316' }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <h2>لديك نشاط مسجل بالفعل</h2>
            <p>يمكنك إضافة نشاط واحد فقط لكل حساب. يمكنك تعديل معلومات نشاطك الحالي أو متابعة حالته من لوحة التحكم.</p>
            <div className="w-reg-success-actions">
              <Link href="/dashboard" className="w-btn" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-gauge"></i> لوحة التحكم
              </Link>
              <Link href="/" className="w-btn-outline" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-house"></i> الرئيسية
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="w-reg-page">
          <div className="w-reg-success" dir="rtl">
            <div className="w-reg-success-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>تم التسجيل بنجاح!</h2>
            <p>سنراجع طلبك قريباً وسيتم تفعيل ملفك خلال 24 ساعة.</p>
            {formData.email && (
              <p className="w-reg-success-note">
                <i className="fa-solid fa-envelope"></i>
                يمكنك تتبع حالة ملفك عبر تسجيل الدخول بالبريد الإلكتروني.
              </p>
            )}
            <div className="w-reg-success-actions">
              <Link href="/" className="w-btn" style={{ textDecoration: 'none' }}>
                <i className="fa-solid fa-house"></i> العودة للرئيسية
              </Link>
              {formData.email && (
                <Link href="/login" className="w-btn-outline" style={{ textDecoration: 'none' }}>
                  <i className="fa-solid fa-right-to-bracket"></i> تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-reg-page" dir="rtl">
        <div className="w-reg-header">
          <h1 className="w-reg-title">
            <i className="fa-solid fa-store" style={{ color: 'var(--primary)', marginLeft: '10px' }}></i>
            سجّل نشاطك التجاري
          </h1>
          <p className="w-reg-subtitle">أضف عملك إلى دليل Wassla وابدأ في جذب العملاء من كل الجزائر</p>
        </div>

        <div className="w-reg-steps">
          {STEPS.map((s, i) => (
            <div key={s.num} className="w-reg-step-row">
              <div className={`w-reg-step-item ${step === s.num ? 'current' : step > s.num ? 'done' : ''}`}>
                <div className="w-reg-step-circle">
                  {step > s.num
                    ? <i className="fa-solid fa-check"></i>
                    : <i className={`fa-solid ${s.icon}`}></i>
                  }
                </div>
                <span className="w-reg-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-reg-step-connector ${step > s.num ? 'done' : ''}`}></div>}
            </div>
          ))}
        </div>

        {error && (
          <div className="w-error-box w-reg-error">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-reg-form">
          {step === 1 && (
            <div className="w-reg-card">
              <div className="w-reg-card-header">
                <i className="fa-solid fa-store"></i>
                <div>
                  <h2>معلومات النشاط</h2>
                  <p>أخبرنا عن عملك ونشاطك التجاري</p>
                </div>
              </div>

              <div className="w-form-grid">
                <div className="w-form-group">
                  <label className="w-form-label"><span className="req">*</span> اسم النشاط / المحل</label>
                  <input className="w-form-control" type="text" required value={formData.businessName} onChange={e => update('businessName', e.target.value)} placeholder="مثال: مؤسسة الأمل للبناء" />
                </div>
                <div className="w-form-group">
                  <label className="w-form-label">اسم صاحب النشاط</label>
                  <input className="w-form-control" type="text" value={formData.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="اسمك الكامل" />
                </div>
              </div>

              <div className="w-form-grid">
                <div className="w-form-group">
                  <label className="w-form-label"><span className="req">*</span> التخصص</label>
                  <select className="w-form-control" required value={formData.category} onChange={e => update('category', e.target.value)}>
                    <option value="">اختر تخصصك...</option>
                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-form-group">
                  <label className="w-form-label"><span className="req">*</span> الولاية</label>
                  <select className="w-form-control" required value={formData.wilaya} onChange={e => update('wilaya', e.target.value)}>
                    <option value="">اختر الولاية...</option>
                    {allWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="w-form-group">
                <label className="w-form-label">العنوان التفصيلي</label>
                <input className="w-form-control" type="text" value={formData.address} onChange={e => update('address', e.target.value)} placeholder="مثال: شارع 1 نوفمبر، أمام بنك CPA" />
              </div>

              <div className="w-form-group">
                <label className="w-form-label">وصف النشاط</label>
                <textarea className="w-form-control" value={formData.description} onChange={e => update('description', e.target.value)} placeholder="اكتب وصفاً جذاباً عن خدماتك وما يميزك..." rows={3}></textarea>
              </div>

              <div className="w-reg-nav">
                <div></div>
                <button type="button" className="w-btn" onClick={goNext}>التالي <i className="fa-solid fa-arrow-left"></i></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-reg-card">
              <div className="w-reg-card-header">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h2>معلومات التواصل</h2>
                  <p>كيف يتواصل معك العملاء؟</p>
                </div>
              </div>

              <div className="w-form-grid">
                <div className="w-form-group">
                  <label className="w-form-label"><span className="req">*</span> رقم الهاتف</label>
                  <input className="w-form-control" type="tel" required value={formData.phone} onChange={e => update('phone', e.target.value)} placeholder="05XX XX XX XX" />
                </div>
                <div className="w-form-group">
                  <label className="w-form-label">واتساب</label>
                  <input className="w-form-control" type="tel" value={formData.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="إذا كان مختلفاً" />
                </div>
              </div>

              <div className="w-reg-section-title"><i className="fa-solid fa-share-nodes"></i> روابط التواصل <span>(اختياري)</span></div>
              <div className="w-form-grid">
                <div className="w-form-group">
                  <label className="w-form-label">فيسبوك</label>
                  <input className="w-form-control" type="url" placeholder="https://facebook.com/..." value={formData.facebook} onChange={e => update('facebook', e.target.value)} />
                </div>
                <div className="w-form-group">
                  <label className="w-form-label">إنستغرام</label>
                  <input className="w-form-control" type="url" placeholder="https://instagram.com/..." value={formData.instagram} onChange={e => update('instagram', e.target.value)} />
                </div>
              </div>

              {!isLoggedIn && (
                <div className="w-reg-account-box">
                  <div className="w-reg-account-header">
                    <i className="fa-solid fa-user-circle"></i>
                    <div>
                      <h3>إنشاء حساب <span className="w-reg-optional-badge">اختياري</span></h3>
                      <p>أنشئ حساباً لمتابعة حالة ملفك</p>
                    </div>
                  </div>
                  <div className="w-form-grid">
                    <div className="w-form-group" style={{ marginBottom: 0 }}><label className="w-form-label">البريد الإلكتروني</label><input className="w-form-control" type="email" value={formData.email} onChange={e => update('email', e.target.value)} placeholder="example@email.com" /></div>
                    <div className="w-form-group" style={{ marginBottom: 0 }}><label className="w-form-label">كلمة المرور</label><input className="w-form-control" type="password" minLength={6} value={formData.password} onChange={e => update('password', e.target.value)} placeholder="6 أحرف على الأقل" /></div>
                  </div>
                </div>
              )}

              <div className="w-reg-nav">
                <button type="button" className="w-btn-outline" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-right"></i> رجوع</button>
                <button type="button" className="w-btn" onClick={goNext}>التالي <i className="fa-solid fa-arrow-left"></i></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-reg-card">
              <div className="w-reg-card-header">
                <i className="fa-solid fa-image"></i>
                <div>
                  <h2>الصور والموقع</h2>
                  <p>أضف شعارك، صورك وموقعك على الخريطة</p>
                </div>
              </div>

              <div className="w-reg-section-title"><i className="fa-solid fa-id-badge"></i> شعار النشاط <span>(يظهر في نتائج البحث والملف الشخصي)</span></div>
              <div style={{ marginBottom: '24px' }}>
                {!logoPreview ? (
                  <label className="w-logo-upload-placeholder">
                    <i className="fa-solid fa-camera"></i>
                    <span>ارفع شعارك</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div className="w-logo-upload-preview">
                    <img src={logoPreview} alt="Logo Preview" />
                    <button type="button" onClick={removeLogo} className="w-remove-logo"><i className="fa-solid fa-times"></i></button>
                  </div>
                )}
              </div>

              <div className="w-reg-section-title"><i className="fa-solid fa-images"></i> صور النشاط <span>(يمكنك رفع عدة صور — بحد أقصى 5MB لكل صورة)</span></div>
              <div className="w-multi-upload">
                <label className="w-multi-upload-add">
                  <i className="fa-solid fa-plus"></i>
                  <span>إضافة صور</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {imagePreviews.map((src, i) => (
                  <div key={i} className="w-multi-upload-item">
                    <img src={src} alt="" />
                    <button type="button" onClick={() => removeImage(i)} className="w-remove-img"><i className="fa-solid fa-times"></i></button>
                  </div>
                ))}
              </div>

              <div className="w-reg-section-title" style={{ marginTop: '24px' }}><i className="fa-solid fa-map-location-dot"></i> الموقع الجغرافي</div>
              <LocationPicker 
                lat={formData.latitude} 
                lng={formData.longitude} 
                onChange={(lat, lng) => { update('latitude', lat); update('longitude', lng); }} 
              />

              <div className="w-reg-nav">
                <button type="button" className="w-btn-outline" onClick={() => setStep(2)}><i className="fa-solid fa-arrow-right"></i> رجوع</button>
                <button type="submit" className="w-btn w-btn--submit" disabled={loading}>
                  {loading ? <><i className="fa-solid fa-spinner w-spin"></i> جاري الإرسال...</> : <><i className="fa-solid fa-paper-plane"></i> إرسال الطلب</>}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}
