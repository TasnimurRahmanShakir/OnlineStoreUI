import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "./_components/category-dialog";
// Mock Data Fetcher (Server Side)
import { getCategoriesAction } from "@/app/actions/categories";
import Link from "next/link";
import { Category } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api-client";
import { AdminSearch } from "@/components/admin/admin-search";

export default async function CategoriesPage(props: {
  searchParams: Promise<{ page?: string; limit?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const q = searchParams.q;

  // Fetch data directly on the server
  let categories: Category[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let paginatedData: any = {
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 1,
  };

  if (q) {
    const result = await api.get(`/Search/categories?q=${q}`);
    if (result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories = (result.data as any).map((c: any) => ({
        id: c.id,
        name: c.name,
        // Other fields might be missing in search, mock them or make optional
        description: "",
        slug: "",
        createdAt: new Date(),
      }));
    }
  } else {
    const result = await getCategoriesAction(page, limit);
    paginatedData = result.success ? result.data : null;
    categories = paginatedData ? paginatedData.items : [];
  }

  const totalPages = paginatedData ? paginatedData.totalPages : 1;
  const hasPreviousPage = paginatedData ? paginatedData.hasPreviousPage : false;
  const hasNextPage = paginatedData ? paginatedData.hasNextPage : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="Search categories..." />
          {/* Pass data to Client Component */}
          <CategoryDialog categories={categories} />
        </div>
      </div>

      <DataTable columns={columns} data={categories} />

      <div className="flex items-center justify-end space-x-2">
        {!q && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage}
              asChild={!!hasPreviousPage}
            >
              {hasPreviousPage ? (
                <Link
                  href={`/admin/categories?page=${page - 1}&limit=${limit}`}
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
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              asChild={!!hasNextPage}
            >
              {hasNextPage ? (
                <Link
                  href={`/admin/categories?page=${page + 1}&limit=${limit}`}
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
