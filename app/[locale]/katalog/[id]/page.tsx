// app/[locale]/katalog/[id]/page.tsx  (SERVER component)
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { rowToProduct, toDetailData } from "@/lib/produk";
import ProdukDetail from "./ProdukDetail";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const { data, error } = await supabase.from("produk").select("*").eq("id", id).maybeSingle();
  if (error || !data) notFound();

  const { data: rel } = await supabase
    .from("produk")
    .select("*")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(4);

  const product = toDetailData(rowToProduct(data), (rel ?? []).map(rowToProduct));
  return <ProdukDetail product={product} />;
}