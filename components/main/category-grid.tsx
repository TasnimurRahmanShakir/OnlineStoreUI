"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { BASE_URL2 } from "@/lib/api-constants";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Filter for top-level categories (where parentId is null or empty)
  // and take the first 8 to display
  const topCategories = categories.filter((c) => !c.parentId).slice(0, 8);

  // If no categories, show nothing or a placeholder
  if (topCategories.length === 0) return null;

  const getImageUrl = (url?: string) => {
    if (!url)
      return "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith("http")) return url;

    // Ensure proper slash handling
    const cleanBase = BASE_URL2.replace(/\/$/, "");
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCategories.map((category) => (
          <Link
            key={category.id}
            href={`/store?categoryId=${category.id}`}
            className="group relative h-64 overflow-hidden rounded-xl bg-gray-100 block"
          >
            <Image
              src={getImageUrl(category.imageUrl)}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white mb-1">
                {category.name}
              </h3>
              <p className="text-white/80 text-sm font-medium opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                Explore Items
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
