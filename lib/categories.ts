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
    name: "1:64",
    slug: "1-64",
    img: "/images/placeholder.png",
    filterValue: "1:64",
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
