// lib/produk.ts -- tipe + mapper DB (snake_case) <-> app (camelCase)

export type StockStatus = "Tersedia" | "Stok Menipis" | "Habis";
export interface Variant { name: string; icon: string }
export interface Size { label: string; price: number }
export interface Accordion { title: string; content: string; tags?: string[] }

export interface Product {
  id: string;
  thumbnail?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: StockStatus;
  images: string[];
  description?: string;
  variants: Variant[];
  sizes: Size[];
  accordions: Accordion[];
  priceOld?: number;
  discount?: string;
  badgeTagline?: string;
}

/* ---------- DB row -> Product ---------- */
export function rowToProduct(r: any): Product {
  return {
    id: String(r.id),
    thumbnail: r.thumbnail || "",
    name: r.name,
    sku: r.sku,
    category: r.category,
    price: r.price,
    stock: r.stock,
    unit: r.unit,
    status: r.status,
    images: r.images ?? [],
    description: r.description ?? "",
    variants: r.variants ?? [],
    sizes: r.sizes ?? [],
    accordions: r.accordions ?? [],
    priceOld: r.price_old ?? undefined,
    discount: r.discount ?? undefined,
    badgeTagline: r.badge_tagline ?? undefined,
  };
}

/* ---------- body request -> DB row ---------- */
export function bodyToRow(b: any) {
  return {
    name: String(b.name ?? "").trim(),
    sku: String(b.sku ?? "").trim(),
    category: String(b.category ?? "").trim() || "Keripik",
    price: Number(b.price) || 0,
    price_old: b.priceOld ? Number(b.priceOld) : null,
    discount: b.discount || null,
    badge_tagline: b.badgeTagline || null,
    stock: Number(b.stock) || 0,
    unit: b.unit || "pcs",
    status: b.status || "Tersedia",
    thumbnail: b.thumbnail || null,
    images: Array.isArray(b.images) ? b.images : [],
    description: b.description || null,
    variants: Array.isArray(b.variants) ? b.variants.filter((v: Variant) => v.name?.trim()) : [],
    sizes: Array.isArray(b.sizes) ? b.sizes.filter((s: Size) => s.label?.trim()) : [],
    accordions: Array.isArray(b.accordions)
      ? b.accordions.filter((a: Accordion) => a.title?.trim() && a.content?.trim())
      : [],
  };
}

/* ================= Tipe halaman detail ================= */
export interface VariantItem { id: string; name: string; label: string; desc: string; icon: string }
export interface AccordionItem { num: string; title: string; content: string; tags?: string[] }
export interface ReviewItem {
  id: number; author: string; initial: string; avatarBg: string;
  time: string; variant: string; text: string; helpful: number;
}
export interface RelatedProductItem {
  id: string; tag: string; name: string; desc: string; price: string; image: string;
}
export interface RatingBreakdown { star: number; percent: number }

export interface ProductDetailData {
  id: string;
  title: string;
  rating: string;
  reviewsCount: string;
  soldCount: string;
  priceNow: string;
  priceOld: string;
  discount: string;
  badgeTagline?: string;
  images: string[];
  variants: VariantItem[];
  sizes: Size[];
  accordions: AccordionItem[];
  reviews: ReviewItem[];
  ratingBreakdown: RatingBreakdown[];
  satisfactionPct?: string;
  relatedProducts: RelatedProductItem[];
}

const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

// Ulasan masih dummy sampai kamu bikin tabel `ulasan`
const DEMO_REVIEWS: ReviewItem[] = [
  {
    id: 1, author: "Dian Puspitasari", initial: "D", avatarBg: "avatar-red",
    time: "Kemarin, 14:20", variant: "Original",
    text: "Garingnya pas banget, gak alot sama sekali dan rasanya alami tanpa pemanis tambahan. Packaging ziplock-nya tebal jadi tetap garing walau sudah dibuka beberapa hari.",
    helpful: 42,
  },
  {
    id: 2, author: "Reza Ramadhan", initial: "R", avatarBg: "avatar-orange",
    time: "3 hari lalu", variant: "Kayu Manis",
    text: "Pesan untuk oleh-oleh kantor ke Jakarta, packing rapi dan tebal jadi keripik sampai dalam kondisi utuh. Recommended!",
    helpful: 19,
  },
];

export function toDetailData(p: Product, related: Product[]): ProductDetailData {
  let accordions: AccordionItem[] = p.accordions
    .filter((a) => a.title && a.content)
    .map((a, i) => ({
      num: String(i + 1).padStart(2, "0"),
      title: a.title,
      content: a.content,
      tags: a.tags?.length ? a.tags : undefined,
    }));

  // fallback: kalau belum isi accordion tapi ada deskripsi
  if (accordions.length === 0 && p.description) {
    accordions = [{ num: "01", title: "Deskripsi Produk", content: p.description }];
  }

  const images = p.images.length ? p.images : [p.thumbnail || "/foto/mix.jpg"];

  return {
    id: p.id,
    title: p.name,
    rating: "4.9",
    reviewsCount: "1.248",
    soldCount: "3.400+",
    priceNow: rupiah(p.price),
    priceOld: p.priceOld ? rupiah(p.priceOld) : "",
    discount: p.discount || "",
    badgeTagline: p.badgeTagline,
    images,
    variants: p.variants.map((v, i) => ({
      id: String(i), name: v.name, label: v.name, desc: "", icon: v.icon,
    })),
    sizes: p.sizes,
    accordions,
    reviews: DEMO_REVIEWS,
    ratingBreakdown: [
      { star: 5, percent: 88 },
      { star: 4, percent: 9 },
      { star: 3, percent: 2 },
    ],
    satisfactionPct: "98% Puas & Beli Ulang",
    relatedProducts: related.map((r) => ({
      id: r.id,
      tag: r.category,
      name: r.name,
      desc: r.unit ? `Per ${r.unit}` : "",
      price: rupiah(r.price),
      image: r.thumbnail || r.images[0] || "/foto/mix.jpg",
    })),
  };
}