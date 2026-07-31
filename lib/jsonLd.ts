export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Daxo-mart",
    url: "https://daxomart.resellerpro",
    logo: "https://daxomart.resellerpro/icon.png",
    sameAs: [
      "https://www.instagram.com/daxomart",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Malayalam"],
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Daxo-mart",
    url: "https://daxomart.resellerpro",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://daxomart.resellerpro/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  slug?: string;
  id: number | string;
  category?: string;
  brand?: string;
}) {
  const url = `https://daxomart.resellerpro/products/${product.slug || product.id}`;
  const image = product.images?.[0] || "https://daxomart.resellerpro/og-image.png";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Buy ${product.name} at Daxo-mart`,
    image: image,
    url: url,
    brand: {
      "@type": "Brand",
      name: product.brand || "Daxo-mart",
    },
    category: product.category || "Diecast Cars",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: url,
      seller: {
        "@type": "Organization",
        name: "Daxo-mart",
      },
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
