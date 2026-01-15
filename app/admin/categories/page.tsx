import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryActions } from "./_components/category-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryDialog } from "./_components/category-dialog";
// Mock Data Fetcher (Server Side)
import { getCategoriesAction } from "@/app/actions/categories";
import Link from "next/link";
import { Category } from "@/lib/types";

export default async function CategoriesPage(props: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  // Fetch data directly on the server
  const result = await getCategoriesAction(page, limit);
  console.log(result.data);

  // result.data is now PaginatedResult<Category> or undefined
  const paginatedData = result.success ? result.data : null;

  const categories: Category[] = paginatedData ? paginatedData.items : [];
  const totalPages = paginatedData ? paginatedData.totalPages : 1;
  const hasPreviousPage = paginatedData ? paginatedData.hasPreviousPage : false;
  const hasNextPage = paginatedData ? paginatedData.hasNextPage : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        {/* Pass data to Client Component */}
        <CategoryDialog categories={categories} />
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.parentId ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                      {category.parentName}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Top Level
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <CategoryActions
                    category={category}
                    otherCategories={categories}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
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
      </div>
    </div>
  );
}
