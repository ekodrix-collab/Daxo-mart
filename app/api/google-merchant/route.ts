import { NextResponse } from "next/server";
import { fetchProducts } from "@/service/storeService";

export const revalidate = 3600; // Cache feed for 1 hour

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daxomart.resellerpro.in";
    const products = await fetchProducts();

    const xmlItems = products
      .map((p) => {
        const ensureAbsoluteUrl = (url: string) => {
          if (!url) return `${baseUrl}/og-image.png`;
          if (url.startsWith("http://") || url.startsWith("https://")) return url;
          return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
        };

        const prodUrl = `${baseUrl}/products/${p.slug || p.id}`;
        const mainImage = ensureAbsoluteUrl(p.images?.[0] || p.img);
        const additionalImages = (p.images || [])
          .slice(1, 10)
          .map((img) => `<g:additional_image_link>${escapeXml(ensureAbsoluteUrl(img))}</g:additional_image_link>`)
          .join("\n        ");

        const isAvailable = p.inStock && (p.stock === undefined || p.stock > 0);
        const availability = isAvailable ? "in_stock" : "out_of_stock";
        const currentPrice = Number(p.price) || 0;
        const regularPrice = Number(p.oldPrice) && Number(p.oldPrice) > currentPrice ? Number(p.oldPrice) : currentPrice;
        const hasSale = regularPrice > currentPrice;

        const cleanTitle = escapeXml(p.name);
        const cleanDesc = escapeXml(
          p.description
            ? p.description.replace(/<[^>]*>?/gm, "").slice(0, 4950)
            : `Buy ${p.name} online at DaxoMart India. Premium diecast metal alloy scale model car with 100% quality check and free express delivery.`
        );

        const categoryTag = p.category ? escapeXml(`Diecast Cars > ${p.category}`) : "Diecast Scale Model Cars";
        const skuVal = escapeXml(p.sku || `DXM-${p.id}`);

        return `    <item>
      <g:id>DXM-${p.id}</g:id>
      <g:title>${cleanTitle}</g:title>
      <g:description>${cleanDesc}</g:description>
      <g:link>${escapeXml(prodUrl)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
      ${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice.toFixed(2)} INR</g:price>
      ${hasSale ? `<g:sale_price>${currentPrice.toFixed(2)} INR</g:sale_price>` : ""}
      <g:brand>${escapeXml((p as any).brand || "DaxoMart")}</g:brand>
      <g:mpn>${skuVal}</g:mpn>
      <g:condition>new</g:condition>
      <g:google_product_category>Toys &amp; Games &gt; Toys &gt; Toy Vehicles &gt; Model Cars</g:google_product_category>
      <g:product_type>${categoryTag}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`;
      })
      .join("\n");

    const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DaxoMart Diecast Scale Model Cars &amp; RC Toys Store</title>
    <link>${baseUrl}</link>
    <description>India's Premier Online Store for 1:18, 1:24, and 1:32 Scale Diecast Model Cars, RC Racing Vehicles &amp; 3D Collectible Frames.</description>
${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xmlFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("Google Merchant Feed Error:", err);
    return new NextResponse(`<error>Failed to generate Google Merchant feed: ${err?.message}</error>`, {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
