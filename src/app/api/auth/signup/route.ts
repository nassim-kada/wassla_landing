import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    return Response.json({ success: true, userId: user._id });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Signup failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
