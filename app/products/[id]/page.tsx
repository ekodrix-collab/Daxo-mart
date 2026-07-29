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
  const product = products.find((p) => String(p.id) === String(id));
  if (!product) return { title: "Product Not Found – DAXOMART" };
  return {
    title: `${product.name} – DAXOMART`,
    description: product.description,
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
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
