import Link from "next/link";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllOrdersAction } from "@/app/actions/order";
import { OrderSummary, PaginatedResult } from "@/lib/types";
import { OrderActions } from "@/components/admin/order-actions";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  const response = await getAllOrdersAction(currentPage, limit);

  if (!response.success || !response.data) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Orders</h2>
        <div className="rounded-md border p-6 text-center text-red-500">
          Failed to load orders. {response.error}
        </div>
      </div>
    );
  }

  const data = response.data;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items && data.items.length > 0 ? (
              data.items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderActions
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {data.currentPage} of {data.totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!data.hasPreviousPage}
            asChild={data.hasPreviousPage}
          >
            {data.hasPreviousPage ? (
              <Link href={`/admin/orders?page=${data.currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.hasNextPage}
            asChild={data.hasNextPage}
          >
            {data.hasNextPage ? (
              <Link href={`/admin/orders?page=${data.currentPage + 1}`}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
