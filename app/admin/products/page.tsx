import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table"; // Import the engine
import { columns } from "./columns"; // Import the config
import { Product } from "@/lib/types";
import { api } from "@/lib/api-client";

// 1. Helper function to fetch data server-side
async function getProducts(): Promise<Product[]> {
  try {
    const result = await api.get<Product[]>("/Product/all");
    if (result.success) {
      return result.data || [];
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductsPage(props: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  // 2. Fetch data (fetching all for now, then slicing locally)
  const allProducts = await getProducts();

  // Calculate pagination
  const totalItems = allProducts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;
  const paginatedProducts = allProducts.slice(offset, offset + limit);

  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

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
      <DataTable columns={columns} data={paginatedProducts} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          asChild={!!hasPreviousPage}
        >
          {hasPreviousPage ? (
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
          Page {page} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          asChild={!!hasNextPage}
        >
          {hasNextPage ? (
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
