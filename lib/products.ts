export interface ColorOption {
  name: string;      // e.g. "Yellow Car", "White Car"
  colorHex?: string;  // optional hex value like "#FFD700" or "#FFFFFF"
  image?: string;     // URL of variant image uploaded via Admin
}

export interface Product {
  id: number | string;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  costPrice?: number; // Dealer Cost Price (Admin only)
  oldPrice: number;
  priceStr: string;
  oldPriceStr: string;
  scale: string;
  category: "1:32" | "1:24" | "1:18" | "RC" | "Frame" | string;
  img: string;
  images: string[];
  badge: string | null;
  description: string;
  features: string[];
  inStock: boolean;
  stock?: number;
  isActive?: boolean;
  sku: string;
  colors?: ColorOption[];
  videoUrl?: string | null;
}

const PRODUCTS: Product[] = [];

export default PRODUCTS;

export function getProduct(id: number | string) {
  return PRODUCTS.find((p) => String(p.id) === String(id)) ?? null;
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductsByCategory(cat: Product["category"]) {
  return PRODUCTS.filter((p) => p.category === cat);
}
