"use client";

import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HWTZ6D2XWG";

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}

// Custom Event Tracker for E-Commerce User Behavior
export function trackGAEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

export function trackProductView(product: { id: string | number; name: string; price: number; category?: string }) {
  trackGAEvent("view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category || "Diecast Cars",
        price: product.price,
      },
    ],
  });
}

export function trackAddToCart(product: { id: string | number; name: string; price: number; category?: string }, quantity = 1) {
  trackGAEvent("add_to_cart", {
    currency: "INR",
    value: product.price * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        item_category: product.category || "Diecast Cars",
        price: product.price,
        quantity,
      },
    ],
  });
}

export function trackWhatsAppCheckout(productName: string, amount: number, quantity = 1) {
  trackGAEvent("begin_checkout", {
    currency: "INR",
    value: amount,
    coupon: "DIRECT_WHATSAPP",
    items: [
      {
        item_name: productName,
        price: amount,
        quantity,
      },
    ],
  });
}
