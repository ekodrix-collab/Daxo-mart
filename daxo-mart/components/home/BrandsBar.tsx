import React from "react";

/* ── Brand Logo SVG Emblems ────────────────────────────────────────── */
const BRAND_LOGOS: { name: string; svg: React.ReactNode }[] = [
  {
    name: "MERCEDES-BENZ",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 2.5L12 12M12 12L4.5 17M12 12L19.5 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "BMW",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="12" r="6" />
        <path d="M12 6V18M6 12H18" />
        <path d="M12 6A6 6 0 0 1 18 12H12V6Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M6 12A6 6 0 0 1 12 18V12H6Z" fill="currentColor" fillOpacity="0.4" />
      </svg>
    ),
  },
  {
    name: "AUDI",
    svg: (
      <svg width="34" height="18" viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="10" r="6.5" />
        <circle cx="16.5" cy="10" r="6.5" />
        <circle cx="24" cy="10" r="6.5" />
        <circle cx="31.5" cy="10" r="6.5" />
      </svg>
    ),
  },
  {
    name: "ROLLS-ROYCE",
    svg: (
      <svg width="20" height="22" viewBox="0 0 24 26" fill="currentColor">
        <rect x="2" y="2" width="20" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <text x="12" y="11" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="sans-serif">R</text>
        <text x="12" y="19" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="sans-serif">R</text>
      </svg>
    ),
  },
  {
    name: "FERRARI",
    svg: (
      <svg width="18" height="22" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 2L18 5V13C18 18 12 21.5 10 22C8 21.5 2 18 2 13V5L10 2Z" />
        <path d="M8 17C9 14 10 11 12 8C11 11 11.5 13 13 14" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "LAMBORGHINI",
    svg: (
      <svg width="18" height="22" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 2L18 5V13C18 18 12 21.5 10 22C8 21.5 2 18 2 13V5L10 2Z" />
        <path d="M6 14C8 12 10 9 10 7C10 10 12 12 14 14" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "PORSCHE",
    svg: (
      <svg width="18" height="22" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 2L18 5V13C18 18 12 21.5 10 22C8 21.5 2 18 2 13V5L10 2Z" />
        <line x1="2" y1="9" x2="18" y2="9" />
        <line x1="10" y1="9" x2="10" y2="22" />
      </svg>
    ),
  },
  {
    name: "TOYOTA",
    svg: (
      <svg width="26" height="18" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="15" cy="10" rx="13.5" ry="8.5" />
        <ellipse cx="15" cy="7" rx="8" ry="4" />
        <ellipse cx="15" cy="11.5" rx="3.5" ry="6" />
      </svg>
    ),
  },
  {
    name: "BUGATTI",
    svg: (
      <svg width="26" height="18" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="15" cy="10" rx="13.5" ry="8.5" />
        <text x="15" y="13.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="currentColor" stroke="none">EB</text>
      </svg>
    ),
  },
  {
    name: "MCLAREN",
    svg: (
      <svg width="24" height="18" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 14C10 6 22 5 24 10C18 11 10 13 4 14Z" fill="currentColor" fillOpacity="0.4" />
      </svg>
    ),
  },
];

/* Duplicate list for seamless infinite marquee */
const MARQUEE_ITEMS = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

export default function BrandsBar() {
  return (
    <div
      style={{
        background: "#231c17",
        borderTop: "1px solid #332b25",
        borderBottom: "1px solid #332b25",
        padding: "18px 0",
        overflow: "hidden",
      }}
    >
      <div className="marquee-track" style={{ gap: 52, padding: "0 20px" }}>
        {MARQUEE_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#a69c92",
              flexShrink: 0,
              whiteSpace: "nowrap",
              cursor: "default",
              transition: "color 0.2s ease",
            }}
            className="brand-logo-item"
          >
            <span style={{ display: "flex", alignItems: "center", opacity: 0.85 }}>
              {item.svg}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "'Pally', system-ui, sans-serif",
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .brand-logo-item:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
