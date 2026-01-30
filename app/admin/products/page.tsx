import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table"; // Import the engine
import { columns } from "./columns"; // Import the config
import { Product, PaginatedResult } from "@/lib/types";
import { api } from "@/lib/api-client";
import { AdminSearch } from "@/components/admin/admin-search";

// 1. Helper function to fetch data server-side
async function getProducts(
  page: number,
  limit: number,
): Promise<PaginatedResult<Product>> {
  try {
    const result = await api.get<PaginatedResult<Product>>(
      `/Product?page=${page}&limit=${limit}`,
    );
    if (result.success && result.data) {
      return result.data;
    }
    // Return empty structure if failed
    return {
      items: [],
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      items: [],
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ page?: string; limit?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const q = searchParams.q;

  let products: Product[] = [];
  let paginatedResult: any = {
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 1,
  };

  if (q) {
    const result = await api.get(`/Search/products?q=${q}`);
    if (result.success) {
      products = result.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        priceSummary: `$${p.price?.toFixed(2) || "0.00"}`,
        totalStock: p.stockQuantity || 0,
        categoryName: p.categoryName,
        baseImage: p.image || null,
        isActive: p.isActive,
        description: p.description,
        createdAt: new Date(), // Search doesn't return date yet
      }));
    }
  } else {
    paginatedResult = await getProducts(page, limit);
    products = paginatedResult.items || [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="Search products..." />
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. Render the DataTable with paginated data */}
      <DataTable columns={columns} data={products} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        {!q && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginatedResult.hasPreviousPage}
              asChild={!!paginatedResult.hasPreviousPage}
            >
              {paginatedResult.hasPreviousPage ? (
                <Link
                  href={`/admin/products?page=${page - 1}&limit=${limit}`}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Link>
              ) : (
                <span className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </span>
              )}
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {paginatedResult.totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginatedResult.hasNextPage}
              asChild={!!paginatedResult.hasNextPage}
            >
              {paginatedResult.hasNextPage ? (
                <Link
                  href={`/admin/products?page=${page + 1}&limit=${limit}`}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <span className="flex items-center">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
