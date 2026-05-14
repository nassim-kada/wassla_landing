import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Profile from '@/models/Profile';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me-in-production';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Ensure the profile belongs to the user
    const profile = await Profile.findOne({ _id: id, user_id: decoded.userId });
    if (!profile) {
      return Response.json({ error: 'Profile not found or unauthorized' }, { status: 404 });
    }

    await Profile.deleteOne({ _id: id });

    return Response.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete profile error:', error);
    const message = error instanceof Error ? error.message : 'Delete failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
