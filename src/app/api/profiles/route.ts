import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Profile from '@/models/Profile';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || '';
    const wilaya = searchParams.get('wilaya') || '';
    const category = searchParams.get('category') || '';

    const query: any = { status: 'active' };

    if (search) {
      query.$or = [
        { business_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (wilaya) {
      query.wilaya = wilaya;
    }
    if (category) {
      query.category = category;
    }

    const data = await Profile.find(query).sort({ created_at: -1 }).lean();

    // Map `_id` to `id` manually since `lean()` skips the toJSON transform
    const mappedData = data.map(doc => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest };
    });

    return Response.json({ success: true, data: mappedData });
  } catch (error: unknown) {
    console.error('Profiles GET error:', error);
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
