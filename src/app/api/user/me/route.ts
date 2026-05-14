import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Profile from '@/models/Profile';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me-in-production';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find all profiles linked to this user
    const profiles = await Profile.find({ user_id: decoded.userId }).sort({ created_at: -1 }).lean();

    const mappedProfiles = profiles.map((doc: any) => {
      const { _id, ...rest } = doc;
      return { id: _id.toString(), ...rest };
    });

    return Response.json({ success: true, data: mappedProfiles, email: decoded.email, userId: decoded.userId });
  } catch (error: unknown) {
    console.error('User profile fetch error:', error);
    const message = error instanceof Error ? error.message : 'Fetch failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
