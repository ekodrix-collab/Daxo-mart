export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
  is_active?: boolean;
}

export const INITIAL_BRANDS: BrandItem[] = [
  {
    id: "brand-1",
    name: "MERCEDES-BENZ",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/2048px-Mercedes-Logo.svg.png",
    is_active: true,
  },
  {
    id: "brand-2",
    name: "LAMBORGHINI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Lamborghini_Logo.svg/1024px-Lamborghini_Logo.svg.png",
    is_active: true,
  },
  {
    id: "brand-3",
    name: "BUGATTI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bugatti_logo.svg/1024px-Bugatti_logo.svg.png",
    is_active: true,
  },
  {
    id: "brand-4",
    name: "TOYOTA",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/1024px-Toyota.svg.png",
    is_active: true,
  },
  {
    id: "brand-5",
    name: "ROLLS-ROYCE",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Rolls-Royce_Motor_Cars_logo.svg/1024px-Rolls-Royce_Motor_Cars_logo.svg.png",
    is_active: true,
  },
  {
    id: "brand-6",
    name: "PORSCHE",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Porsche-Logo.png",
    is_active: true,
  },
  {
    id: "brand-7",
    name: "BMW",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png",
    is_active: true,
  },
  {
    id: "brand-8",
    name: "AUDI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/2048px-Audi-Logo_2016.svg.png",
    is_active: true,
  },
  {
    id: "brand-9",
    name: "FERRARI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1024px-Ferrari-Logo.svg.png",
    is_active: true,
  },
  {
    id: "brand-10",
    name: "MCLAREN",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/66/McLaren_logo.svg/1200px-McLaren_logo.svg.png",
    is_active: true,
  },
];

const STORAGE_KEY_BRANDS = "dm_brands_v3";

export function getStoredBrands(): BrandItem[] {
  if (typeof window === "undefined") return INITIAL_BRANDS;
  const data = localStorage.getItem(STORAGE_KEY_BRANDS);
  if (!data) return INITIAL_BRANDS;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BRANDS;
  } catch {
    return INITIAL_BRANDS;
  }
}

export function saveStoredBrands(brands: BrandItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_BRANDS, JSON.stringify(brands));
    window.dispatchEvent(new Event("dm_brands_updated"));
  }
}
