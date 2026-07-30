import { notFound } from "next/navigation";
import { fetchProducts } from "@/service/storeService";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

/* ── Dynamic Metadata ────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const products = await fetchProducts();
  const product = products.find((p) => p.slug === id || String(p.id) === String(id));
  if (!product) return { title: "Product Not Found – Daxo-mart" };

  const title = (product as any).metaTitle || `${product.name} | Daxo-mart`;
  const description =
    (product as any).metaDescription ||
    (product.description ? product.description.slice(0, 160) : `Buy ${product.name} at Daxo-mart for ₹${product.price}. High quality, fast delivery guaranteed.`);
  const imageUrl = product.images?.[0] || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://daxomart.com/products/${product.id}`,
      siteName: "Daxo-mart",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/* ── Page (Server Component) ─────────────────────────────────────── */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await fetchProducts();
  const product = products.find((p) => p.slug === id || String(p.id) === String(id));

  if (!product) notFound();

  return <ProductDetailClient product={product} allProducts={products} />;
}
