export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  img: string;
  filterValue: string;
  sortOrder?: number;
  productCount?: number;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "1:18",
    slug: "1-18",
    img: "/images/placeholder.png",
    filterValue: "1:18",
  },
  {
    id: "cat-2",
    name: "1:24",
    slug: "1-24",
    img: "/images/placeholder.png",
    filterValue: "1:24",
  },
  {
    id: "cat-3",
    name: "1:32",
    slug: "1-32",
    img: "/images/placeholder.png",
    filterValue: "1:32",
  },
  {
    id: "cat-4",
    name: "1:36",
    slug: "1-36",
    img: "/images/placeholder.png",
    filterValue: "1:36",
  },
  {
    id: "cat-5",
    name: "RC Toys",
    slug: "rc-toys",
    img: "/images/placeholder.png",
    filterValue: "RC Toys",
  },
  {
    id: "cat-6",
    name: "3D Frames",
    slug: "3d-frames",
    img: "/images/placeholder.png",
    filterValue: "3D Frames",
  },
];

const STORAGE_KEY_CATEGORIES = "dm_categories";

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  return data ? JSON.parse(data) : INITIAL_CATEGORIES;
}

export function saveStoredCategories(categories: CategoryItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }
}

export function sortCategoriesByPreferredOrder<T extends { name: string; filterValue?: string; slug?: string }>(
  categories: T[]
): T[] {
  return [...categories].sort((a, b) => {
    const getPriority = (item: T) => {
      const name = (item.name || "").toLowerCase().trim();
      const filter = (item.filterValue || "").toLowerCase().trim();
      const slug = (item.slug || "").toLowerCase().trim();

      if (name.includes("1:18") || filter.includes("1:18") || slug.includes("1-18")) return 1;
      if (name.includes("1:24") || filter.includes("1:24") || slug.includes("1-24")) return 2;
      if (name.includes("1:32") || filter.includes("1:32") || slug.includes("1-32")) return 3;
      if (name.includes("1:36") || filter.includes("1:36") || slug.includes("1-36")) return 4;
      if (name.includes("rc") || filter.includes("rc") || slug.includes("rc")) return 5;
      if (name.includes("frame") || filter.includes("frame") || slug.includes("frame")) return 6;
      return 99;
    };
    return getPriority(a) - getPriority(b);
  });
}
