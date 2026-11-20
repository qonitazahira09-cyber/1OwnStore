import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  // TODO: cek session admin di sini
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ message: "Tidak ada file" }, { status: 400 });
  }

  const urls: string[] = [];
  for (const file of files) {
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json({ message: `Format ${file.name} tidak didukung (pakai JPG/PNG/WebP)` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: `${file.name} lebih dari 5 MB` }, { status: 400 });
    }

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage
      .from("produk")
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    urls.push(supabase.storage.from("produk").getPublicUrl(path).data.publicUrl);
  }

  return NextResponse.json({ urls });
}