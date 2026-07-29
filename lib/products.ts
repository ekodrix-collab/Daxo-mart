export interface Product {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  oldPrice: number;
  priceStr: string;
  oldPriceStr: string;
  scale: string;
  category: "1:32" | "1:24" | "1:18" | "RC" | "Frame";
  img: string;
  images: string[];
  badge: string | null;
  description: string;
  features: string[];
  inStock: boolean;
  sku: string;
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
