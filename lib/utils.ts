import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "./types";
import { BASE_URL2 } from "./api-constants";

export function constructImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  // Clean base URL and ensure proper slash handling
  const cleanBase = BASE_URL2.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;

  return `${cleanBase}${cleanPath}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CategoryTree = Category & {
  children: CategoryTree[];
};

export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const categoryMap = new Map<string, CategoryTree>();
  const roots: CategoryTree[] = [];

  // Initialize map
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build values
  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id);
    if (node) {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId)?.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}
