import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-me-in-production';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: 'بيانات تسجيل الدخول غير صحيحة' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return Response.json({ error: 'بيانات تسجيل الدخول غير صحيحة' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return Response.json({
      success: true,
      token,
      user: { email: user.email, id: user._id },
    });
  } catch (error: unknown) {
    console.error('User login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
