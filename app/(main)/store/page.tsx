import { getStoreProductsAction } from "@/app/actions/product";
import { getAllCategoriesAction } from "@/app/actions/categories";
import { getAllBrandsAction } from "@/app/actions/brands";
import { buildCategoryTree } from "@/lib/utils";
import { StoreFilters } from "@/components/store/store-filters";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreHeader } from "@/components/store/store-header";
import { StorePagination } from "@/components/store/pagination";

export const metadata = {
  title: "Store - All Products",
  description: "Browse our wide range of products.",
};

interface StorePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string | string[];
    brand?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function StorePage(props: StorePageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = 24;

  const [productsData, categories, brands] = await Promise.all([
    getStoreProductsAction({
      page,
      limit,
      search: searchParams.search,
      categoryId: searchParams.categoryId,
      brand: searchParams.brand,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,
      sort: searchParams.sort,
    }),
    getAllCategoriesAction(false),
    getAllBrandsAction(),
  ]);

  const products =
    productsData.success && productsData.data ? productsData.data.items : [];
  const totalItems =
    productsData.success && productsData.data
      ? productsData.data.totalItems
      : 0;
  const totalPages =
    productsData.success && productsData.data
      ? productsData.data.totalPages
      : 0;

  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
          <StoreFilters categories={categoryTree} brands={brands} />
        </aside>

        <div className="flex-1">
          <StoreHeader
            totalItems={totalItems}
            categories={categoryTree}
            brands={brands}
          />

          <ProductGrid products={products} />

          <StorePagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
