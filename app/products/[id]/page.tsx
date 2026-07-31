import { notFound } from "next/navigation";
import { fetchProducts } from "@/service/storeService";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/jsonLd";

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
      url: `https://daxomart.resellerpro/products/${product.slug || product.id}`,
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

  const productJsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: (product as any).originalPrice,
    images: product.images,
    slug: product.slug,
    id: product.id,
    category: product.category,
    brand: (product as any).brand,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://daxomart.resellerpro" },
    { name: "Products", url: "https://daxomart.resellerpro/products" },
    { name: product.name, url: `https://daxomart.resellerpro/products/${product.slug || product.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} allProducts={products} />
    </>
  );
}

