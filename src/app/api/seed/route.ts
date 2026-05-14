import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// This is a one-time seeding endpoint. PROTECT IT OR DELETE AFTER USE.
const SEED_SECRET = process.env.SEED_SECRET || 'wassla-seed-2026';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    if (secret !== SEED_SECRET) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const email = 'nassim@wassla.com';
    const password = '@@@nassim123';

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ success: true, message: 'Admin user already exists', email });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash, role: 'admin' });

    return Response.json({ success: true, message: 'Admin user created', email });
  } catch (error: unknown) {
    console.error('Seed error:', error);
    const message = error instanceof Error ? error.message : 'Seed failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
