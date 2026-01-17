import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table"; // Import the engine
import { columns } from "./columns"; // Import the config
import { Product, PaginatedResult } from "@/lib/types";
import { api } from "@/lib/api-client";

// 1. Helper function to fetch data server-side
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
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  // 2. Fetch data (server-side pagination)
  const paginatedResult = await getProducts(page, limit);
  const products = paginatedResult.items || []; // Ensure items is an array

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* 3. Render the DataTable with paginated data */}
      <DataTable columns={columns} data={products} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
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
      </div>
    </div>
  );
}
