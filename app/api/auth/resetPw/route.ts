import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Cek apakah user dengan email tersebut ada
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Email tidak terdaftar' }, { status: 404 });
    }

    // 2. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password
    await db.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    return NextResponse.json({ message: 'Password berhasil diperbarui' }, { status: 200 });
  } catch (error) {
    console.error('Error reset password:', error);
    return NextResponse.json({ message: 'Gagal memperbarui password' }, { status: 500 });
  }
}