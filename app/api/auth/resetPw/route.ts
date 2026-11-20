import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Email dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Cek apakah user dengan email tersebut ada (Supabase Client)
    const { data: user, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase Check Error:', checkError);
      return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ message: 'Email tidak terdaftar' }, { status: 404 });
    }

    // 2. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password di Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
      return NextResponse.json({ message: 'Gagal memperbarui password' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password berhasil diperbarui' }, { status: 200 });
  } catch (error) {
    console.error('Error reset password:', error);
    return NextResponse.json({ message: 'Gagal memperbarui password' }, { status: 500 });
  }
}