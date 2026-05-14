import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Profile from '@/models/Profile';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();    if (!data.businessName || !data.category || !data.wilaya || !data.phone) {
      return Response.json({ success: false, error: 'الحقول المطلوبة: اسم النشاط، التخصص، الولاية، الهاتف' }, { status: 400 });
    }

    if (data.userId) {
      const existingProfile = await Profile.findOne({ user_id: data.userId });
      if (existingProfile) {
        return Response.json({ success: false, error: 'لقد قمت بإضافة نشاط بالفعل. يمكنك إضافة نشاط واحد فقط لكل حساب.' }, { status: 400 });
      }
    }
    const sanitize = (val: string) => (val || '').trim().slice(0, 500);

    const newProfile = await Profile.create({
      user_id: data.userId || null,
      business_name: sanitize(data.businessName),
      owner_name: sanitize(data.ownerName),
      category: sanitize(data.category),
      wilaya: sanitize(data.wilaya),
      address: sanitize(data.address),
      description: (data.description || '').trim().slice(0, 2000),
      phone: sanitize(data.phone),
      whatsapp: sanitize(data.whatsapp),
      email: sanitize(data.email),
      location_link: sanitize(data.locationLink),
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      facebook: sanitize(data.facebook),
      instagram: sanitize(data.instagram),
      tiktok: sanitize(data.tiktok),
      images: data.images || [],
      logo_url: sanitize(data.logo_url),
      status: 'pending',
    });

    return Response.json({ success: true, profileId: newProfile._id });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
