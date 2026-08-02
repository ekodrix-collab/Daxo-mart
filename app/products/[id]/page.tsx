import { notFound } from "next/navigation";
import { fetchProducts } from "@/service/storeService";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/jsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daxomart.resellerpro.in";

/* ── Dynamic Metadata ────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const products = await fetchProducts();
  const product = products.find((p) => p.slug === id || String(p.id) === String(id));
  if (!product) return { title: "Product Not Found – DaxoMart" };

  const title = (product as any).metaTitle || `${product.name} | DaxoMart Scale Cars`;
  const description =
    (product as any).metaDescription ||
    (product.description ? product.description.slice(0, 160) : `Buy ${product.name} at DaxoMart India for ₹${product.price}. 100% Quality Checked with Free Express Delivery & COD.`);
  const imageUrl = product.images?.[0] || "/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug || product.id}`,
      siteName: "DaxoMart",
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
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/products` },
    { name: product.name, url: `${SITE_URL}/products/${product.slug || product.id}` },
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

