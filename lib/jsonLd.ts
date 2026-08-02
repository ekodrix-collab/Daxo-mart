const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daxomart.resellerpro.in";

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DaxoMart",
    alternateName: ["Daxo Mart", "DaxoMart Store", "DaxoMart Diecast"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "DaxoMart is India's leading online store for premium 1:18, 1:24, and 1:32 scale diecast metal model cars, RC vehicles, and 3D frame collectibles.",
    sameAs: [
      "https://www.instagram.com/daxomart",
      "https://facebook.com/daxomart",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9876543210",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Malayalam"],
    },
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DaxoMart",
    alternateName: ["Daxo Mart", "DaxoMart Diecast Cars"],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateStoreJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "OnlineStore"],
    name: "DaxoMart",
    alternateName: "DaxoMart Diecast & RC Collectibles",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "Buy premium 1:18, 1:24, 1:32 diecast scale metal cars, RC drift cars, and 3D collectible car frames online in India. 100% Quality Checked with Free Pan-India Shipping.",
    priceRange: "₹499 - ₹4,999",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash on Delivery, WhatsApp Order, Credit Card, Debit Card, UPI, Net Banking",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
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
  const url = `${SITE_URL}/products/${product.slug || product.id}`;
  const image = product.images?.[0] || `${SITE_URL}/og-image.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Buy ${product.name} at DaxoMart India. Premium diecast metal alloy scale model car with free express delivery.`,
    image: [image],
    url: url,
    sku: `DXM-${product.id}`,
    brand: {
      "@type": "Brand",
      name: product.brand || "DaxoMart",
    },
    category: product.category || "Diecast Cars",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: url,
      seller: {
        "@type": "Organization",
        name: "DaxoMart",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnPeriod",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
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

export function generateFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is DaxoMart?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DaxoMart is India's leading online store for premium 1:18, 1:24, and 1:32 scale diecast metal model cars, remote control racing vehicles, and 3D frame collectibles.",
        },
      },
      {
        "@type": "Question",
        name: "Does DaxoMart offer Free Delivery across India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! DaxoMart offers 100% Free Express Shipping across India on all orders with 24-48 hour dispatch.",
        },
      },
      {
        "@type": "Question",
        name: "Are DaxoMart diecast cars made of original metal alloy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all DaxoMart scale model cars are manufactured using heavy die-cast metal alloy bodies with rubber tires, opening doors, sound & light effects, and realistic interior detailing.",
        },
      },
      {
        "@type": "Question",
        name: "How can I order diecast cars on DaxoMart?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can place your order directly through our secure online checkout or tap 'WhatsApp Order' for instant 1-click ordering with live agent support.",
        },
      },
    ],
  };
}
