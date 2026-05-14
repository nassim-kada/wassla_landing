import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Profile from '@/models/Profile';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || '';
    const wilaya = searchParams.get('wilaya') || '';

    const query: any = {};

    if (search) {
      query.$or = [
        { business_name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    if (wilaya) {
      query.wilaya = wilaya;
    }

    const data = await Profile.find(query).sort({ created_at: -1 }).lean();

    const mappedData = data.map(doc => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest };
    });

    return Response.json({ success: true, data: mappedData });
  } catch (error: unknown) {
    console.error('Admin Profiles GET error:', error);
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    await Profile.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (error: unknown) {
    console.error('Admin Profiles DELETE error:', error);
    const message = error instanceof Error ? error.message : 'Delete failed';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const { id, ...updates } = await request.json();
    if (!id) {
      return Response.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    await Profile.findByIdAndUpdate(id, updates, { new: true });

    return Response.json({ success: true });
  } catch (error: unknown) {
    console.error('Admin Profiles PATCH error:', error);
    const message = error instanceof Error ? error.message : 'Update failed';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
